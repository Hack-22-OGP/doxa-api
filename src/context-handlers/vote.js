const { createVote } = require('../services/vote-service')
const { formatHttpResponse } = require('../helpers/http-format')

const handlerCreateVote = async (event) => {
  const pollId = event.pathParameters.id
  const optionId = event.pathParameters.optionId
  const result = await createVote(pollId, optionId)
  return (result === undefined) ? formatHttpResponse(false, 'Invalid Vote.') : formatHttpResponse(true, result)
}

module.exports = {
  handlerCreateVote
}