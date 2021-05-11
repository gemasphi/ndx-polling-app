import {castPoll, castVote, listVotes, listPolls, getSpecificPoll, checkIfAlreadyVoted, commitPollConditions, getStartConditions} from 'api/db';
import moment from 'moment';
import m from "api/money";
import voting from "api/voting"; 
import {Result} from "features/polls/types";
import exc from "api/customExceptions";

const web3 = m.connectWeb3()

// Save New Poll
async function createPoll(space, data){
  const today = moment().utc()
  let commitStartCond=false

  if(!startDateIsValid(data['startDate']) && !blockNumberIsValid(data['blockNumber'])){
    // Start date and blockNumber are both null - get latest block and it's done
    data['blockNumber'] = await m.getLatestBlock(web3)
    data['startDate'] = today
  } else if(blockNumberIsValid(data['blockNumber'])){
    // BlockNumber is good - Don't need to do anything...
    data['startDate'] = null
  } else if(startDateIsValid(data['startDate'])){
    // Start date is good
    if(today.isAfter(data['startDate'])){
      // Start date is in the past - fill block number already
      const web3 = m.connectWeb3()
      data['blockNumber'] = await m.getBlockFromDate(web3, moment(data['startDate']))
      commitStartCond=true
    } else {
      data['blockNumber'] = null
    }
  }
  
  return await castPoll(space, data, commitStartCond)
}

// Save Vote
async function setPoll(space, id, data){
  // Get wallet balance and ensure it is valid
  const poll =  await getSpecificPoll(space, id)
  let blockNumber = poll['blockNumber']
  if(blockNumber == null){
    blockNumber = await m.getBlockFromDate(web3, moment(poll['startDate']))
    console.log('Date ' + poll['startDate'] + ' got block: '  + blockNumber)
  }
  const balance : any = await m.queryBalance(data['wallet'], blockNumber)
  if(!(balance > 0)){
    throw new exc.InsufficientFunds()
  }
  data['balance'] = balance
  await castVote(space, id, data)
}

// Get Poll Info
async function getPoll(space, pollId){
    const web3 = m.connectWeb3()
    let poll = await getSpecificPoll(space, pollId)
    let startCond = await getStartConditions(space, pollId)
    const today = moment().utc();

    if(startCond == null){
      // Manual inspection
      if(startDateIsValid(poll['startDate'])){
        // Use date to check if started
        const startDate = moment(poll['startDate']).utc();
        poll['started'] = today.isAfter(startDate);
        if(poll['started']){
          poll['blockNumber'] = await m.getBlockFromDate(web3, startDate)
          commitPollConditions(space, poll['id'], poll['startDate'], poll['blockNumber'])
        }
      } else{
        // Use block number to check if started
        let latestBlock = await m.getLatestBlock(web3)
        poll['started'] = latestBlock >= poll['blockNumber']
        if(poll['started']){
          commitPollConditions(space, poll['id'], poll['startDate'], poll['blockNumber'])
        }
      }
    } else {
      poll['started'] = true
      const startDate = moment(poll['startDate']).utc();
      poll['started'] = today.isAfter(startDate);
    }

    const endDate = moment(poll['endDate']).utc();
    poll['finished'] = today.isAfter(endDate)

    return poll
}

// Get Poll Results
async function getPollResults(space, pollId){
  const poll = await getSpecificPoll(space, pollId)
  let votes = await listVotes(web3, space, pollId)
  let results_pre = voting.calcResults(votes, poll)
 
  // Normalize weights so they sum to 1.0
  let results : Result[] = []
  for(let option = 0; option < poll['options'].length; option++){
    const selectedOption =  results_pre['results'][option]
    results.push({
      option:  option,
      numVotes: selectedOption['numVotes'],
      weights: results_pre['totalNDX'] === 0 ? 0 : selectedOption['weights'] / results_pre['totalNDX']
    }) 
  }
  const output = {
    ...poll,
    'results': results,
    'totalNDXUsed': results_pre['totalNDX']
  }
  return output
}

// Check if user already voted
async function getPollVoted(space, pollId, wallet){
  return await checkIfAlreadyVoted(web3, space, pollId, wallet)
}

// Get Poll Votes
async function getPollVotes(space, pollId){
  const votes = await listVotes(web3, space, pollId)
  return votes
}

// List Polls
async function getPolls(space){
  return await listPolls(space)
}

const blockNumberIsValid = (x) => {
  if((x==null || isNaN(x) ||  !x || /^\s*$/.test(x))){
      return false
  }
  return true
}

const startDateIsValid = (x) => {
if(x==null){
  return false
}
return true
}

const api =  {
  createPoll, 
  getPoll, 
  getPollResults, 
  setPoll, 
  getPolls, 
  getPollVotes, 
  getPollVoted
}

export default api;
