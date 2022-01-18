const handlerIndex = async (event) => {
  return {
    statusCode: 301,
    headers: {
      Location:
        'http://localhost:5156/sgid/v1/oauth/authorize?response_type=code&client_id=doxa&scope=openid&redirect_uri=http://localhost:3000/dev/sgid/callback&nonce=randomnonce&state=prod',
    },
  }
}

module.exports = {
  handlerIndex,
}
