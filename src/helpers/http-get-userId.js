const httpGetUserId = (event) => {
  const authString = event.headers.Authorization
  if (authString === undefined) return undefined
  const authParams = authString.split(' ')
  return authParams[1]
}

module.exports = {
  httpGetUserId,
}
