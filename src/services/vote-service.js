const voteUserDb = require('../databases/vote-user-db')
const pollDb = require('../databases/poll-db')
const { getPollDetail } = require('../services/poll-service')

const _isValidPoll = (poll, optionId) => {
  if (poll === undefined) return false
  if (poll.options === undefined) return false
  if (optionId < 0 || optionId > poll.options.length - 1) return false
  return true
}

const _updatePollVoteCount = async (poll, optionId) => {
  const optionIdx = poll.options.findIndex((option) => option.id === optionId)
  poll.options[optionIdx].voteCount++
  const result = await pollDb.dbUpdatePollOptions(poll)
  return result
}

const createVote = async (pollId, optionId, userId) => {
  const poll = await getPollDetail(pollId)
  if (!_isValidPoll(poll, optionId))
    return {
      success: false,
      response: 'Invalid Poll ID or Option ID.',
    }

  const id = pollId + '-' + userId
  const voteUser = await voteUserDb.dbGetVoteUser(id)
  if (voteUser.Item === undefined) {
    await voteUserDb.dbPutVoteUser({
      id: id,
    })
    const updatedPoll = await _updatePollVoteCount(poll, optionId)
    return {
      success: true,
      response: updatedPoll.Attributes,
    }
  } else {
    return {
      success: false,
      response: 'User already voted',
    }
  }
}

const getVoteStatus = async (pollId, userId) => {
  const id = pollId + '-' + userId
  console.log('id: ', id)
  // return voteUserDb.dbGetVoteUser(id).Item
  const result = await voteUserDb.dbGetVoteUser(id)
  console.log('result: ', result)
  return result.Item
}

module.exports = {
  createVote,
  getVoteStatus,
}
