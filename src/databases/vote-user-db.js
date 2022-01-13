const AWS = require('aws-sdk')

AWS.config.setPromisesDependency(require('bluebird'))

const dynamo = () => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:5000',
    })
  }
  return new AWS.DynamoDB.DocumentClient()
}
const dynamoDb = dynamo()

const dbPutVoteUser = async (item) => {
  try {
    const recordCreate = {
      TableName: process.env.DOXA_VOTE_USER_TABLE,
      Item: item,
    }
    await dynamoDb.put(recordCreate).promise()
  } catch (e) {
    console.error('[ERROR] dbPutPoll: ', e)
  }
}

const dbGetVoteUser = async (id) => {
  try {
    const query = {
      TableName: process.env.DOXA_VOTE_USER_TABLE,
      Key: { id },
    }
    return dynamoDb.get(query).promise()
  } catch (e) {
    console.error('[ERROR] dbGetPoll: ', e)
    return undefined
  }
}

module.exports = {
  dbPutVoteUser,
  dbGetVoteUser
}
