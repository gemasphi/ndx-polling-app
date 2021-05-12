import axios from 'axios'

// PLACEHOLDER
const baseURL = "/api"
//const baseURL = "http://localhost:8080/api"

// Save New Poll
export const createPoll = async (data) => {
    const response = await axios({
      method: 'post',
      url: baseURL + '/poll',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    })

    return response.data;

}

// Get Poll Info
export const getPoll = async (pollId) => {
    const response = await axios({
      method: 'get',
      url: baseURL + '/poll/' + pollId,
      headers: { 
        'Content-Type': 'application/json',
        //'wallet': "0x86772b1409b61c639eaac9ba0acfbb6e238e5f83"
      },
    })

    return response.data;

}


// Get Poll Results
export const getPollResults = async (pollId) => {
    const response = await axios({
      method: 'get',
      url: baseURL + '/poll/' + pollId + '/results',
      headers: { 
        'Content-Type': 'application/json',
        //'wallet': "0x86772b1409b61c639eaac9ba0acfbb6e238e5f83"
      },
    })
    return response.data;

}

// Get Poll Results
export const getPollVoted = async (pollId, wallet) => {
    const response = await axios({
      method: 'get',
      url: baseURL + '/poll/' + pollId + '/voted',
      headers: { 
        'Content-Type': 'application/json',
        'wallet': wallet
      },
    })
    return response.data;

}

// Get Poll Results
export const getPollVotes = async (pollId) => {

    const response = await axios({
      method: 'get',
      url: baseURL + '/poll/' + pollId + '/votes',
      headers: { 
        'Content-Type': 'application/json'
      },
    })

    return response.data;

}

// Save Vote
export const setPoll = async (id, data) => {
    const response = await axios({
      method: 'put',
      url: baseURL + '/poll/' + id,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : {...data } 
    })

    return response.data;

}

// List Polls
export const getPolls = async () => {
    const response = await axios({
      method: 'get',
      url: baseURL + '/poll/',
      headers: { 
        'Content-Type': 'application/json'
        }
    })

    return response.data;

}

export default {createPoll, getPoll, getPollResults, setPoll, getPolls, getPollVotes, getPollVoted}; 


/*
// TO BE ABLE TO TEST THIS WITH THE CALLS BELLOW, YOU NEED TO ADD THIS LINE TO YOUR PACKAGE.JSON:  "type": "module",
// PLACEHOLDER

//var data = JSON.stringify(
  {
  "name":"Awesome Poll",
  "description":"Description with less than 400 words",
  "title":"What's your favourite color?","
  options":["asd","asd"],
  "multipleOption":false,
  "blocknumber":null
  });
//createPoll(data)



//  PLACEHOLDER
var pollId = '4rthjo3m9km4n929p'
getPoll(pollId)

//  PLACEHOLDER
var pollId = '4rthjo3m9km4n929p'
getPollResults(pollId)

//  PLACEHOLDER
var pollId = '4rthjo3m9km4n929p'
var data = JSON.stringify({"vote":{"option":"Awesome Option","blockNumber":420}});
setPoll(data)

//  PLACEHOLDER
getPolls(data)
*/