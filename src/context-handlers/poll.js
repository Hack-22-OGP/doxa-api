const uuid = require('uuid')
const AWS = require('aws-sdk')

AWS.config.setPromisesDependency(require('bluebird'))

const dynamo = () => {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:5000'
    })
  }
  return new AWS.DynamoDB.DocumentClient()
}
const dynamoDb = dynamo()

const createPoll = async (event) => {
  const text = JSON.parse(event.body).text
  if (typeof text !== 'string') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'createPoll validation error: invalid text',
        pollText: text   
      })
    }
  }

  const item = {
    TableName: process.env.DOXA_POLL_TABLE,
    Item: {
      id: uuid.v4(),
      text: text,
      createdDate: Date.now(),
      updatedDate: Date.now()
    }
  }
  await dynamoDb.put(item).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'createPoll successful',
      item: item   
    })
  }
}

module.exports = {
  createPoll
}