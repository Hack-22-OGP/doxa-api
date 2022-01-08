const pollDb = require('../databases/poll-db')
const { getPollDetail } = require('../services/poll-service') 

const _isValidPoll = (poll, optionId) => {
  if (poll === undefined) return false
  if (poll.options === undefined) return false
  const optionIds = poll.options.map(option => option.optionId)
  if (!optionIds.includes(optionId)) return false
  return true
}

const createVote = async (pollId, optionId) => {
  const poll = await getPollDetail(pollId)
  if (!_isValidPoll(poll, optionId)) return undefined

  // TODO: Validate user previous vote 
  return 'OK' // TODO: Update Poll DB's options vote count
}

module.exports = {
  createVote
}