const { createVote } = require('../services/vote-service')
const { formatHttpResponse } = require('../helpers/http-format')

const handlerCreateVote = async (event) => {
  const authString = event.headers.Authorization
  if (authString === undefined)
    return formatHttpResponse(false, 'Invalid Authorization Bearer token.')
  const authParams = authString.split(' ')
  const userId = authParams[1]

  const pollId = event.pathParameters.id
  if (event.body === null)
    return formatHttpResponse(false, 'Invalid Option ID.')
  const eventBody = JSON.parse(event.body)
  const optionId = parseInt(eventBody.optionId)
  if (isNaN(optionId)) return formatHttpResponse(false, 'Invalid Option ID.')

  const result = await createVote(pollId, optionId, userId)
  return formatHttpResponse(result.success, result.response)
}

module.exports = {
  handlerCreateVote,
}
