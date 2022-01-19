const axios = require('axios')
const { JWK, JWS } = require('node-jose')
const { formatHttpResponse } = require('../helpers/http-format')
const AWS = require('aws-sdk')
const secretName = 'SGID_CLIENT_SECRET'
let clientSecret

const clientSecretMgr = new AWS.SecretsManager({
  region: 'ap-southeast-1',
})

clientSecretMgr.getSecretValue({ SecretId: secretName }, function (err, data) {
  if (err) {
    throw err
  } else {
    clientSecret = JSON.parse(data.SecretString)[secretName]
  }
})
const CLIENT_ID = 'DOXA-TEST'
const GRANT_TYPE = 'authorization_code'

const SGID_BASEURL = process.env.IS_OFFLINE
  ? 'http://localhost:5156/sgid'
  : 'https://api.id.gov.sg'

const SGID_WELLKNOWN_BASEURL = process.env.IS_OFFLINE
  ? 'http://localhost:5156'
  : 'https://api.id.gov.sg'

const DOXA_SGID_CALLBACK = process.env.IS_OFFLINE
  ? 'http://localhost:3000/dev/sgid/callback'
  : 'https://73l0w8qedc.execute-api.ap-southeast-1.amazonaws.com/dev/sgid/callback'

const _fetchToken = async (code) => {
  try {
    const response = await axios.post(`${SGID_BASEURL}/v1/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      redirect_uri: DOXA_SGID_CALLBACK,
      code: code,
      grant_type: GRANT_TYPE,
    })
    return response.status === 200 ? response.data : undefined
  } catch (e) {
    console.error('_fetchToken: ', e)
    return undefined
  }
}

const _verifyAndDecodeToken = async (token) => {
  try {
    const response = await axios.get(
      `${SGID_WELLKNOWN_BASEURL}/.well-known/jwks.json`
    )
    if (response.status === 200) {
      const keystore = await JWK.asKeyStore(response.data)
      const verified = await JWS.createVerify(keystore).verify(token)
      const payload = JSON.parse(verified.payload)
      return payload
    }
    return undefined
  } catch (e) {
    console.error('_verifyAndDecodeToken: ', e)
    return undefined
  }
}

const handlerCallback = async (event) => {
  const { code, state } = event.queryStringParameters

  const { access_token, id_token } = await _fetchToken(code)
  if (id_token !== undefined) {
    const payload = await _verifyAndDecodeToken(id_token)
    if (payload !== undefined) {
      return {
        statusCode: 200,
        body: JSON.stringify(payload),
      }
    }
    return formatHttpResponse(
      false,
      'Authentication error: Unable to verify or decode token.'
    )
  }
  return formatHttpResponse(false, 'Authentication error: Unable fetch token.')
}

module.exports = {
  handlerCallback,
}
