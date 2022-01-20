const { createVote, getVoteStatus } = require('../services/vote-service')
const { formatHttpResponse } = require('../helpers/http-format')
const { httpGetAuthToken } = require('../helpers/http-get-auth-token')

const handlerCreateVote = async (event) => {
  const userId = httpGetAuthToken(event)
  if (userId === undefined)
    return formatHttpResponse(false, 'Invalid Authorization Bearer token.')

  const pollId = event.pathParameters.id
  if (event.body === null)
    return formatHttpResponse(false, 'Invalid Option ID.')
  const eventBody = JSON.parse(event.body)
  const optionId = parseInt(eventBody.optionId)
  if (isNaN(optionId)) return formatHttpResponse(false, 'Invalid Option ID.')

  const result = await createVote(pollId, optionId, userId)
  return formatHttpResponse(result.success, result.response)
}

const handlerGetPollCheckVote = async (event) => {
  const userId = httpGetAuthToken(event)
  if (userId === undefined)
    return formatHttpResponse(false, 'Invalid Authorization Bearer token.')

  const pollId = event.pathParameters.id
  const result = await getVoteStatus(pollId, userId)
  return result === undefined
    ? formatHttpResponse(true, { status: false })
    : formatHttpResponse(true, { status: true })
}

module.exports = {
  handlerCreateVote,
  handlerGetPollCheckVote,
}
