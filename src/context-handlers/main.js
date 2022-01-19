const redirectUrl = process.env.IS_OFFLINE
  ? 'http://localhost:5156/sgid/v1/oauth/authorize?response_type=code&client_id=doxa&scope=openid&redirect_uri=http://localhost:3000/dev/sgid/callback&nonce=randomnonce&state=prod'
  : 'https://api.id.gov.sg/v1/oauth/authorize?response_type=code&client_id=DOXA-TEST&scope=openid&redirect_uri=https://73l0w8qedc.execute-api.ap-southeast-1.amazonaws.com/dev/sgid/callback&nonce=randomnonce&state=prod'

const handlerIndex = async (event) => {
  return {
    statusCode: 301,
    headers: {
      Location: redirectUrl,
    },
  }
}

const handlerDoxa = async (event) => {
  // TODO: return DOXA embedded, with QR Code to vote
}

module.exports = {
  handlerIndex,
  handlerDoxa,
}
