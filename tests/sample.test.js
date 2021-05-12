const request = require('supertest')
const moment = require('moment')
const app = require('../app')

/*
    "pretest": "npm run prod > /dev/null 2>&1 &",
    "test": "jest",
    "posttest": "npm run kill"
*/

// Load fake data
const dataset = require('./mockData.json')

let today = new Date(new Date().getTime())
let startDate = new Date(today)
let endDate = new Date(today)

startDate.setDate(today.getDate() - 1)
endDate.setDate(today.getDate() + 1)

startDate = moment(startDate).format('DD/MM/YYYY HH:mm')
endDate = moment(endDate).format('DD/MM/YYYY HH:mm')

const pollData = {
  ...dataset['polls']['pollInfoA'],
  startDate,
  endDate
}
let pollId

const voteDataOne = dataset['votes']['one']
const voteDataTwo = dataset['votes']['two']

const walletOne = voteDataOne['wallet']
const walletTwo = voteDataTwo['wallet']


jest.useFakeTimers();
describe('Creating a Single Option Poll', async () => {
  
  it('Should create a new poll', async () => {

    const res = await request(app)
      .post('/poll/')
      .send(pollData)
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('id')

    // Save info for later
    pollId = res.body['id']
  })

  it('Should return accurate information about that poll', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId)

    expect(res.statusCode).toEqual(200)
    // TODO
  })

  it('Should have a single poll when listing polls', async () => {
    
    const res = await request(app)
      .get('/poll/')

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBe(1)

  })

  it('Should have no votes', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/votes')

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBe(0)
  })

  it('Should return false when querying if a wallet adress voted', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/voted')
      .set('wallet', walletOne)

    expect(res.statusCode).toEqual(200)
    expect(res.body.voted).toBe(false)
  })

  it('Should have empty results', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/results')
      .send(pollData)
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('results')
    expect(res.body['results'].length).toBe(pollData['options'].length)
    for(const option of res.body['results']){
      expect(option['numVotes']).toBe(0)
      expect(option['weights']).toBe(0)
    }
  })
  
})

// Only suit for dev, which is not ideal... Needed an adress with NDX to produce a signature to be able to add some signature mocks here.
jest.useFakeTimers();
describe('Voting in a Single Option Poll', async () => {
  
  it('Should receive a vote', async () => {

    const res = await request(app)
      .put('/poll/' + pollId)
      .send(voteDataOne)
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('id')

    // Save info for later
    pollId = res.body['id']
  })

  it('Should Acknowledge the voter', async () => {

    const res = await request(app)
      .get('/poll/' + pollId + '/voted')
      .set('wallet', walletOne)

    expect(res.statusCode).toEqual(200)
    expect(res.body.voted).toBe(true)
  })

  it('Should Not Acknowledge other wallets', async () => {

    const res = await request(app)
      .get('/poll/' + pollId + '/voted')
      .set('wallet', walletTwo)

    expect(res.statusCode).toEqual(200)
    expect(res.body.voted).toBe(false)
  })

  it('Should have one vote', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/votes')

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBe(1)
  })

  it('Should have correct results', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/results')
      .send(pollData)
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('results')
    expect(res.body['results'].length).toBe(pollData['options'].length)
    for (const [i, option] of res.body['results'].entries()) {
        if(i==voteDataOne['vote'][0]){
          expect(option['numVotes']).toBe(1)
          expect(option['weights']).toBe(1)
        } else {
          expect(option['numVotes']).toBe(0)
          expect(option['weights']).toBe(0)
        }
    }
  })

  it('Should receive another vote', async () => {

    const res = await request(app)
      .put('/poll/' + pollId)
      .send(voteDataTwo)
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('id')

    // Save info for later
    pollId = res.body['id']
  })

  it('Should Acknowledge the new voter', async () => {

    const res = await request(app)
      .get('/poll/' + pollId + '/voted')
      .set('wallet', walletTwo)

    expect(res.statusCode).toEqual(200)
    expect(res.body.voted).toBe(true)
  })

  it('Should have two votes', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/votes')

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBe(2)
  })

  it('Should have correct results', async () => {
    
    const res = await request(app)
      .get('/poll/' + pollId + '/results')
      .send(pollData)
      .set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('results')
    expect(res.body['results'].length).toBe(pollData['options'].length)
    for (const [i, option] of res.body['results'].entries()) {

        if(i==voteDataOne['vote'][0] || i==voteDataTwo['vote'][0]){
          expect(option['numVotes']).toBe(1)
          expect(option['weights']).toBe(0.5)
        } else {
          expect(option['numVotes']).toBe(0)
          expect(option['weights']).toBe(0)
        }
    }
  })
})

jest.useFakeTimers();
describe('Creating a Multiple Option Poll', async () => {})

jest.useFakeTimers();
describe('Voting in a Multiple Option Poll', async () => {})


