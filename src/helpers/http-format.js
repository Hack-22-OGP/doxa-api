const formatHttpResponse = (success, response) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: success,
      response: response   
    })
  }
}

module.exports = {
  formatHttpResponse
}