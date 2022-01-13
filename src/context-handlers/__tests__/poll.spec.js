import poll from '../poll'
import pollDB from '../../databases/poll-db'

const getResponse = (results) => {
    return JSON.parse(results.body).response
}

describe('test poll api', () => {
    
    beforeAll(() => {
        pollDB.dbPutPoll = jest.fn()
    })

    it('should create poll', async () => {
        const results = await poll.handlerCreatePoll({
            body: JSON.stringify({
                text: 'Who should be the world Leader?', options: [{
                    optionText : 'No one should be leader',
                    
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
})
