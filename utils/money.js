const graphQLLib = require('graphql-request')
const EthDater = require('ethereum-block-by-date')
const moment = require('moment')
const Web3 = require('web3');
const {InvalidWallet, InvalidBlock, ProblemGettingBlock, ProblemGettingLatestBlock, TheGraphError} = require('../utils/customExceptions')


const connectWeb3 = (providerLink) => {
  const web3 = new Web3(providerLink);
  return web3
}

const validateBlockNumber = async (web3, blockNumber, logs=false) => {
  try{
    const block = await web3.eth.getBlock(blockNumber)
    if(block === null){throw new InvalidBlock}
    return block
  } catch(e){
    if(logs===true){console.log(e)}
    throw new InvalidBlock
  }
}


const getBlockFromDate = async (web3, date) => {
  console.log(date)
  try{
    const dater = new EthDater(web3);
    const block = await dater.getDate(
      date,                  // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      false                    // Block after, optional. Search for the nearest block before or after the given date. By default true.
    );
    return block.block
  } catch(e){
    throw new ProblemGettingBlock
  }
}

const getLatestBlock = async (web3) => {
    try{
      let today = new Date(new Date().getTime())
      
      console.log(today)
      const dater = new EthDater(web3);
      const block = await dater.getDate(
        today,                  // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
        false                    // Block after, optional. Search for the nearest block before or after the given date. By default true.
      );
      console.log(block)
      today = new moment(today)
      return block.block
    } catch(e){
      throw new ProblemGettingLatestBlock
    }
}

const queryBalance = async (walletAdress, blockNumber) => {
  const query = graphQLLib.gql`{
    tokenHolder(
      id: \"${walletAdress.toLowerCase()}\",   
      block: {number: ${blockNumber}}
    ) {
      tokenBalance
    }
  }`
  let response

  try{
    // Query for user's balance
    const graphAdress = 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed-governance'
    console.log('Gimme that balance')
    response = await graphQLLib.request(graphAdress, query)
    console.log(response)
  }catch(e){
    throw new TheGraphError()    // FIXME - this ain't functional
  }
  
  /*
  e.g.
  "errors": [
      {
        "message": "Failed to decode `block.number` value: `subgraph QmP6nmmu7n7e1qnqnRQDZwkNKhGCrknrPw65LhregRWybC has only indexed up to block number 12145803 and data for block number 12178833 is therefore not yet available`"
      }
    ]
  */

  if(response['tokenHolder']==null){
    throw new InvalidWallet
  } else {
    return parseFloat(parseFloat(response['tokenHolder']['tokenBalance']).toFixed(2))
  } 
}

const getAuthorFromSignature = async (web3, message, signature) => {
  const signer = await web3.eth.accounts.recover(message, signature)
  return signer
}

module.exports = {
    connectWeb3,
    validateBlockNumber,
    getLatestBlock, 
    queryBalance,
    getAuthorFromSignature, 
    getBlockFromDate
} 