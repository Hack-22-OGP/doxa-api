const axios = require('axios')
const { JWK, JWS } = require('node-jose')
const { formatHttpResponse } = require('../helpers/http-format')

// TODO: Move to Secret Manager
const CLIENT_ID = 'doxa'
const CLIENT_SECRET = 'doxa-secret'
const GRANT_TYPE = 'authorization_code'

const SGID_BASEURL = 'http://localhost:5156'

const _fetchToken = async (code) => {
  try {
    const response = await axios.post(`${SGID_BASEURL}/sgid/v1/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/dev/sgid/callback', // TODO: move to env
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
    const response = await axios.get(`${SGID_BASEURL}/.well-known/jwks.json`)
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
