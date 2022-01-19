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
    item.createdDate = new Date().toISOString()
    item.updatedDate = new Date().toISOString()
    const putItem = {
      TableName: process.env.DOXA_POLL_TABLE,
      Item: item,
    }
    dynamoDb.put(putItem).promise()
  } catch (e) {
    console.error('[ERROR] dbPutPoll: ', e)
    throw e
  }
}

const dbScanPoll = async () => {
  try {
    const scanItem = {
      TableName: process.env.DOXA_POLL_TABLE,
    }
    return dynamoDb.scan(scanItem).promise()
  } catch (e) {
    console.error('[ERROR] dbScanPoll: ', e)
    return undefined
  }
}

const dbGetPoll = async (id) => {
  try {
    const getItem = {
      TableName: process.env.DOXA_POLL_TABLE,
      Key: { id },
    }
    return dynamoDb.get(getItem).promise()
  } catch (e) {
    console.error('[ERROR] dbGetPoll: ', e)
    return undefined
  }
}

const dbUpdatePollOptions = async (poll) => {
  try {
    const updateItem = {
      TableName: process.env.DOXA_POLL_TABLE,
      Key: {
        id: poll.id,
      },
      UpdateExpression: 'set options = :options, updatedDate = :updatedDate',
      ExpressionAttributeValues: {
        ':options': poll.options,
        ':updatedDate': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    }
    console.log('db: ', JSON.stringify(updateItem, ' ', 2))
    return dynamoDb.update(updateItem).promise()
  } catch (e) {
    console.error('[ERROR] dbUpdatePollOptions: ', e)
    return undefined
  }
}

module.exports = {
  dbPutPoll,
  dbScanPoll,
  dbGetPoll,
  dbUpdatePollOptions,
}
