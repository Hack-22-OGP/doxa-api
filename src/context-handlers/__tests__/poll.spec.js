import poll from '../poll'
import pollDB from '../../databases/poll-db'

const getResponse = (results) => {
    return JSON.parse(results.body).response
}
describe('test poll api', () => {
    describe('test create poll Api', () => {

        beforeAll(() => {
            pollDB.dbPutPoll = jest.fn()
        })

        it('should create poll', async () => {
            const results = await poll.handlerCreatePoll({
                body: JSON.stringify({
                    text: 'Who should be the world Leader?', options: [{
                        optionText: 'No one should be leader',

                    }, {
                        optionText: 'Obama FTW',
                    }],
                })
            })


            expect(getResponse(results)).toEqual(expect.objectContaining({
                text: 'Who should be the world Leader?',
                options: [
                    expect.objectContaining({
                        "optionText": "No one should be leader"
                    }),
                    expect.objectContaining({
                        "optionText": "Obama FTW"
                    })]
            }))
        })

        it('should return invalid input if request is not valid', async () => {
            const results = await poll.handlerCreatePoll({
                body: JSON.stringify({ undefined })
            })


            expect(getResponse(results)).toEqual("Invalid input")
        })
    })

    describe('test poll list api', () => {
        beforeAll(() => {
            pollDB.dbScanPoll = jest.fn()
        })
        
        const stubPollData = () => {
            pollDB.dbScanPoll.mockResolvedValueOnce({
                Items: [{
                    id: 1,
                    text: 'Who should be the world Leader?'
                }]
            })
        }

        it('should return list of poll', async () => {
            stubPollData()

            const results = await poll.handlerGetPollList()
            expect(getResponse(results)).toEqual([{
                id: 1,
                text: 'Who should be the world Leader?'
            }])
        })
    })

    describe('test poll detail api', () => {
        beforeAll(() => {
            pollDB.dbGetPoll = jest.fn().mockResolvedValueOnce({
                Item: {
                    id: 1,
                    text: 'Who should be the world Leader?',
                    options: [{
                        optionText: 'No one should be leader',
                    }]
                }
            })
        })

        it('should return poll ', async () => {
            const results =  await poll.handlerGetPollDetail({
                pathParameters: { id : 1}
            })

            expect(getResponse(results)).toEqual({
                id: 1,
                text: 'Who should be the world Leader?',
                options: [{
                    optionText: 'No one should be leader',
                }]
            })
        })
    })
})

