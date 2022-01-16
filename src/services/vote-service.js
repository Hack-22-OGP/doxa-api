const voteUserDb = require('../databases/vote-user-db')
const pollDb = require('../databases/poll-db')
const { getPollDetail } = require('../services/poll-service')

const _isValidPoll = (poll, optionId) => {
  if (poll === undefined) return false
  if (poll.options === undefined) return false
  // const optionIds = poll.options.map((option) => option.optionId)
  // if (!optionIds.includes(optionId)) return false
  if (isNaN(optionId)) return false
  if (optionId < 0 || optionId > poll.options.length - 1) return false
  return true
}

const _updatePollVoteCount = async (poll, optionId) => {
  const optionIdx = poll.options.findIndex((option) => option.id === optionId)
  poll.options[optionIdx].voteCount++
  console.log('poll: ', poll)
  const result = await pollDb.dbUpdatePollOptions(poll)
  console.log('result: ', result)
  return result
}

const createVote = async (pollId, optionIdString, userId) => {
  const poll = await getPollDetail(pollId)
  const optionId = parseInt(optionIdString)
  if (!_isValidPoll(poll, optionId))
    return {
      success: false,
      response: 'Invalid Poll ID or Option ID',
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

module.exports = {
  createVote,
}
