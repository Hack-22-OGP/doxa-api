const voteUserDb = require('../databases/vote-user-db')
const { getPollDetail } = require('../services/poll-service')

const _isValidPoll = (poll, optionId) => {
  if (poll === undefined) return false
  if (poll.options === undefined) return false
  const optionIds = poll.options.map((option) => option.optionId)
  if (!optionIds.includes(optionId)) return false
  return true
}

const _updatePollVoteCount = async (poll, optionId) => {
  // TODO: Increase VoteCount, update Poll table, return Poll for http response
}

const createVote = async (pollId, optionId) => {
  const poll = await getPollDetail(pollId)
  if (!_isValidPoll(poll, optionId))
    return {
      success: false,
      response: 'Invalid Poll ID or Option ID',
    }
  
  const id = pollId + '-' + 'hashedUserId000'  // replace with future hash sgID
  const voteUser = await voteUserDb.dbGetVoteUser(id)
  if (voteUser.Item === undefined) {
    await voteUserDb.dbPutVoteUser({
      id: id,
    })
    const updatedPoll = await _updatePollVoteCount(poll, optionId)
    return {
      success: true,
      response: updatedPoll,
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
