const uuid = require('uuid')
const pollDb = require('../databases/poll-db')

const createPoll = async (poll) => {
  const item = {
    id: uuid.v4(),
    title: poll.title,
    options: poll.options.map((option, idx) => {
      return {
        id: idx,
        title: option.title,
        voteCount: 0,
      }
    }),
  }

  await pollDb.dbPutPoll(item)
  return item
}

const getPollList = async () => {
  const pollListResult = await pollDb.dbScanPoll()
  if (pollListResult === undefined) return undefined

  return pollListResult.Items.map((poll) => {
    return {
      id: poll.id,
      title: poll.title,
    }
  })
}

const getPollDetail = async (id) => {
  const pollDetailResult = await pollDb.dbGetPoll(id)
  return pollDetailResult.Item
}

module.exports = {
  createPoll,
  getPollList,
  getPollDetail,
}
