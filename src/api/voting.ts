import exc from "api/customExceptions";

function initEmptyResults(options) {
    let data = {}
    for(let option = 0; option < options.length; option++){
      data[option] = {
        'option': options[option],
        'weights': 0,
        'numVotes': 0
      }
    }
  return data
}

function updateResults(vote, lastestResults) {
  let chosenOptions =  vote['options']
  
  for(let option of chosenOptions){
    lastestResults[option]['weights'] += vote['balance']
    lastestResults[option]['numVotes'] += vote['balance']
  }
  return lastestResults
}

function calcResults(votes, poll){
  let results = initEmptyResults(poll['options'])
  let totalNDX = 0
  for(const vote of votes){
    totalNDX += vote['balance']
    results = updateResults(vote, results)
  }
  return {results, totalNDX}
}

async function getAuthorFromSignature(web3, message, signature) {
  const signer = await web3.eth.accounts.recover(message, signature);
  return signer;
}

async function verifySignature(web3, message, signature, wallet) {
  const signer = await getAuthorFromSignature(web3, message, signature) 
  if(signer !== wallet){ 
    throw new exc.SignWalletNotMatch()
  }
}

async function verifyVotes(web3, votes) {

  let verifiedVotes = votes.filter((x) => {
    try{
      verifySignature(web3, x['message'], x['signature'], x['wallet'])
      return true
    } catch(e) {
      return false
    }
  })
  return verifiedVotes
}

const voting = { 
  initEmptyResults, 
  updateResults, 
  calcResults, 
  getAuthorFromSignature, 
  verifySignature, 
  verifyVotes 
};

export default voting;
