const uuid = require('uuid')
const pollDb = require('../databases/poll-db')

const createPoll = async poll => {
  const item = {
    id: uuid.v4(),
    text: poll.text,
    options: poll.options.map(option => {
      return {
        optionId: uuid.v4(),
        optionText: option.optionText,
        voteCount: 0
      }
    }),
    createdDate: Date.now(),
    updatedDate: Date.now()
  }


  await pollDb.dbPutPoll(item)
  return item
}

const getPollList = async () => {
  const pollListResult = await pollDb.dbScanPoll()
  if (pollListResult === undefined) return undefined
    
  return pollListResult.Items.map(poll => {
    return {
      id: poll.id,
      text: poll.text
    }
  })
}

const getPollDetail = async id => {
  const pollDetailResult = await pollDb.dbGetPoll(id)
  return pollDetailResult.Item
}

module.exports = {
  createPoll,
  getPollList,
  getPollDetail
}