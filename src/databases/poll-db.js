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

const dbPutPoll = async (item) => {
  try {
    const recordCreate = {
      TableName: process.env.DOXA_POLL_TABLE,
      Item: item,
    }
    await dynamoDb.put(recordCreate).promise()
  } catch (e) {
    console.error('[ERROR] dbPutPoll: ', e)
  }
}

const dbScanPoll = async () => {
  try {
    const query = {
      TableName: process.env.DOXA_POLL_TABLE,
    }
    return dynamoDb.scan(query).promise()
  } catch (e) {
    console.error('[ERROR] dbScanPoll: ', e)
    return undefined
  }
}

const dbGetPoll = async (id) => {
  try {
    const query = {
      TableName: process.env.DOXA_POLL_TABLE,
      Key: { id },
    }
    return dynamoDb.get(query).promise()
  } catch (e) {
    console.error('[ERROR] dbGetPoll: ', e)
    return undefined
  }
}

module.exports = {
  dbPutPoll,
  dbScanPoll,
  dbGetPoll,
}
