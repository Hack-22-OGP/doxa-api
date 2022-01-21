const axios = require('axios')
const { JWK, JWS } = require('node-jose')
const Crypto = require('crypto-js')
const { formatHttpResponse } = require('../helpers/http-format')
const AWS = require('aws-sdk')

const clientSecretMgr = new AWS.SecretsManager({
  region: 'ap-southeast-1',
})
const CLIENT_ID = 'DOXA-TEST'
const SECRET_MANAGER_SECRET_NAME = 'SGID_CLIENT_SECRET'
const GRANT_TYPE = 'authorization_code'

const AES_KEY = 'emG1NwGuzHPxTg' // TODO: Move this to Secret Manager

const SGID_BASEURL = process.env.IS_OFFLINE
  ? 'http://localhost:5156/sgid'
  : 'https://api.id.gov.sg'

const SGID_WELLKNOWN_BASEURL = process.env.IS_OFFLINE
  ? 'http://localhost:5156'
  : 'https://api.id.gov.sg'

const DOXA_SGID_CALLBACK = process.env.IS_OFFLINE
  ? 'http://localhost:3000/dev/sgid/callback'
  : 'https://73l0w8qedc.execute-api.ap-southeast-1.amazonaws.com/dev/sgid/callback'

const _getSecretManager = (secretName) => {
  return new Promise((resolve, reject) => {
    clientSecretMgr.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        throw err
      } else {
        const secretValue = JSON.parse(data.SecretString)[secretName]
        resolve(secretValue)
      }
    })
  })
}

const _fetchToken = async (code) => {
  try {
    const clientSecret = await _getSecretManager(SECRET_MANAGER_SECRET_NAME)
    console.log('clientSecret: ', clientSecret)
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

const handlerCallback = async (event, ctx) => {
  const { code, state } = event.queryStringParameters
  const { access_token, id_token } = await _fetchToken(code)
  if (id_token !== undefined) {
    const payload = await _verifyAndDecodeToken(id_token)
    if (payload !== undefined) {
      const targetBytes = Crypto.AES.decrypt(payload.nonce, AES_KEY)
      const target = targetBytes.toString(Crypto.enc.Utf8)
      console.log('target: ', target)

      if (process.env.IS_OFFLINE) {
        payload.sub = payload.sub.substring(2, 11)
      }

      console.log('payload: ', payload)

      return {
        statusCode: 301,
        headers: {
          Location: 'https://amazonaws.com',
          'Set-Cookie': `u=${payload.sub}; domain=.amazonaws.com; Path=/`,
        },
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
