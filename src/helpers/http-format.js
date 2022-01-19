const formatHttpResponse = (success, response) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      success: success,
      response: response,
    }),
  }
}

module.exports = {
  formatHttpResponse,
}
