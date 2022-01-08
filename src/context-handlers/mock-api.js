const mock1 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        text: 'Covid vaccine is a scam!',
        options: [
          {
            optionId: 1,
            optionText: 'Totally agree',
            voteCount: 2049
          },
          {
            optionId: 2,
            optionText: 'Scam your head!',
            voteCount: 5121},
          {
            optionId: 3,
            optionText: 'I hate vaccine, but still get my jab',
            voteCount: 4772
          }	
        ],
        start: Date.now(),
        end: Date.now(),
        enabled: true,
        deleted: false,
        createdDate: Date.now(),
        lastUpdateDate: Date.now()
      },
    ),
  }
}

module.exports = {
  mock1
}