const handler = async (event) => {
  const params = event.authorizationToken.split(' ')
  const token = params[1]
  console.log('token: ', token)

  if (token === undefined) return denyAllPolicy()
  // TODO: Handle Token here
  return allowPolicy(event.methodArn)
}

function denyAllPolicy() {
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
function allowPolicy(methodArn) {
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
  handler,
}
