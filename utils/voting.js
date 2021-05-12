const {UnknownVotingPolicy} = require('../utils/customExceptions')

const initEmptyResults = (options) => {

  // Init every option with zero weight
  let data = {}
  for(let option of options){
    data[option] = {
      'option': option,
      'weights': 0,
      'numVotes': 0
    }
  }
  return data
}

const singleOptionVoting = (votes, options, logs=false) => {

  let data = initEmptyResults(options)
  
  // Add weights to each option according to how voting occured
  let balanceSum = 0
  for(let vote of votes){
    balanceSum += vote['balance']
    data[vote['options'][0]]['weights'] += vote['balance']
    data[vote['options'][0]]['numVotes'] += 1    
  }
  
  // Normalize it all 
  if(votes.length>0){
    for(let option of options){
      data[option]['weights'] = data[option]['weights']/balanceSum
    }
  }


  return Object.values(data)
}

const multiOptionVoting = (votes, options, logs=false) => {

  let data = initEmptyResults(options)

  let balanceSum = 0
  for(let vote of votes){
    for(let selectedOption of vote['options']){
      balanceSum += vote['balance']
      data[selectedOption]['weights'] += vote['balance']
      data[selectedOption]['numVotes'] += 1      
    }
  }

  // Normalize it all so it adds to 1
  if(votes.length>0){
    for(let option of options){
      data[option]['weights'] = data[option]['weights']/balanceSum
    }
  }

  return Object.values(data)
}

const getResults = async (client, pollInfo, votes, dev=false) => {

  let results

  console.log('> Calculating brand new results')

  if(pollInfo['multipleOption'] === true){
    results = multiOptionVoting(votes,  Array.from(Array(pollInfo['options'].length),(x,i)=>i), dev)
  } else if(pollInfo['multipleOption'] === false){
    results = singleOptionVoting(votes, Array.from(Array(pollInfo['options'].length),(x,i)=>i), dev)
  } else {
    console.log(pollInfo)
    throw new UnknownVotingPolicy   // Should never happen, handling it just in case.
  }

  return results

}

const checkIfAlreadyVoted = (votes, wallet) => {
  for(let vote of votes){
    if(vote['wallet'] == wallet){
      return true
    }
  }
  return false
}

const totalNDX = (votes) => {
  let totalNDXUsed = 0
  for(let vote of votes){
    totalNDXUsed+=vote['balance']
  }
  totalNDXUsed = parseFloat(parseFloat(totalNDXUsed).toFixed(2))
  return totalNDXUsed
}


module.exports = {
  initEmptyResults,
  multiOptionVoting, 
  singleOptionVoting,
  checkIfAlreadyVoted,
  getResults,
  totalNDX
} 