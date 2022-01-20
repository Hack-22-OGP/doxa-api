const jwt = require('jsonwebtoken')
const { httpGetAuthToken } = require('../helpers/http-get-auth-token')

const handlerAuthenticateUser = async (event) => {
  const target = event.queryStringParameters.target
  const token = httpGetAuthToken(event)
  console.log('target: ', target)
  console.log('token: ', token)
  // TODO: verify token here - if any
}

const handlerLambdaAuthorizer = async (event) => {
  const params = event.authorizationToken.split(' ')
  const token = params[1]
  console.log('token: ', token)

  if (token === undefined) return _denyAllPolicy()
  // TODO: Handle Token here
  return _allowPolicy(event.methodArn)
}

function _denyAllPolicy() {
  return {
    principalId: '*',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: '*',
          Effect: 'Deny',
          Resource: '*',
        },
      ],
    },
  }
}
function _allowPolicy(methodArn) {
  return {
    principalId: 'apigateway.amazonaws.com',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: methodArn,
        },
      ],
    },
  }
}

module.exports = {
  handlerAuthenticateUser,
  handlerLambdaAuthorizer,
}
