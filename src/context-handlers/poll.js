const { createPoll, getPollList, getPollDetail } = require('../services/poll-service')
const { formatHttpResponse } = require('../helpers/http-format')

const handlerCreatePoll = async (event) => {
  const poll = JSON.parse(event.body)
  if (typeof poll.text !== 'string') {
    return formatHttpResponse(false, 'Invalid input')
  }
  const result = await createPoll(poll)
  return formatHttpResponse(true, result)
}

const handlerGetPollList = async () => {
  const pollList = await getPollList()
  return formatHttpResponse(true, pollList)
}

const handlerGetPollDetail = async (event) => {
  const id = event.pathParameters.id
  const pollDetail = await getPollDetail(id)
  return (pollDetail === undefined) ? formatHttpResponse(false, 'Poll ID not found.') : formatHttpResponse(true, pollDetail)
}

module.exports = {
  handlerCreatePoll,
  handlerGetPollList,
  handlerGetPollDetail
}