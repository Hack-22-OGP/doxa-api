const jwt = require('jsonwebtoken')
const Crypto = require('crypto-js')
const { httpGetAuthToken } = require('../helpers/http-get-auth-token')
const { getConsoleOutput } = require('@jest/console')

const AES_KEY = 'emG1NwGuzHPxTg' // TODO: Move this to Secret Manager

const redirectUrl = process.env.IS_OFFLINE
  ? 'http://localhost:5156/sgid/v1/oauth/authorize?response_type=code&client_id=doxa&scope=openid&redirect_uri=http://localhost:3000/dev/sgid/callback&state=prod'
  : 'https://api.id.gov.sg/v1/oauth/authorize?response_type=code&client_id=DOXA-TEST&scope=openid&redirect_uri=https://73l0w8qedc.execute-api.ap-southeast-1.amazonaws.com/dev/sgid/callback&state=prod'

const handlerAuthenticateUser = async (event) => {
  const target = event.queryStringParameters.target
  const token = httpGetAuthToken(event)
  console.log('target: ', target)
  console.log('token: ', token)
  // TODO: verify token here - if any
  const encryptedTarget = Crypto.AES.encrypt(target, AES_KEY).toString()
  console.log('nonce: ', encryptedTarget)
  if (token === undefined) {
    return {
      statusCode: 301,
      headers: {
        Location: `${redirectUrl}&nonce=${encodeURIComponent(encryptedTarget)}`,
      },
    }
  }
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
