const handlerIndex = async (event) => {
  return {
    statusCode: 200,
    body: 'Welcome to landing page!',
  }
}

const handlerDoxa = async (event) => {
  // TODO: return DOXA embedded, with QR Code to vote
}

module.exports = {
  handlerIndex,
  handlerDoxa,
}
