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

const formatHttpResponse = (success, response) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: success,
      response: response   
    })
  }
}

const createPoll = async (event) => {
  const text = JSON.parse(event.body).text
  if (typeof text !== 'string') {
    return formatHttpResponse(false, 'Invalid input')
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

  return formatHttpResponse(true, item)
}

const getPollList = async (event) => {
  const item = {
    TableName: process.env.DOXA_POLL_TABLE,
    Item: {
      id: uuid.v4()
    }
  }

  const pollListResult = await dynamoDb.scan(item).promise()
  const pollList = pollListResult.Items.map(poll => {
    return {
      id: poll.id,
      text: poll.text
    }
  })

  return formatHttpResponse(true, pollList)
}

const getPollDetail = async (event) => {
  const id = event.pathParameters.id
  const item = {
    TableName: process.env.DOXA_POLL_TABLE,
    Key: { id }
  }

  const pollDetailResult = await dynamoDb.get(item).promise()
  const pollDetail = pollDetailResult.Item
  return (pollDetail === undefined) ? formatHttpResponse(false, 'Poll ID not found.') : formatHttpResponse(true, pollDetail)
}

module.exports = {
  createPoll,
  getPollList,
  getPollDetail
}