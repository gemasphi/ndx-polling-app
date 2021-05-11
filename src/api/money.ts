import {gql, request} from 'graphql-request';
import Web3 from 'web3';
import EthDater from 'ethereum-block-by-date';
import exc from "api/customExceptions";
import {WEB3_INFURA_PROJECT_ID} from "api/env";

const connectWeb3 = () => {
  const web3 = new Web3(WEB3_INFURA_PROJECT_ID);
  return web3
}

async function getBlockFromDate(web3, date) {
  try {
    const dater = new EthDater(web3);
    const block = await dater.getDate(
      date,                     // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      false                    // Block after, optional. Search for the nearest block before or after the given date. By default true.
    );
    return block.block;
  } catch (e) {
    console.log(e)
    throw exc.ProblemGettingBlock;
  }
}

async function getLatestBlock(web3) {
    try {
      let today = new Date(new Date().getTime());     // Maybe it makes more since to receive this as an argument now
      console.log(today)
      const dater = new EthDater(web3);
      const block = await dater.getDate(
        today,                  
        false                    // Block after, optional. Search for the nearest block before or after the given date. By default true.
      );
      console.log(block);
      return block.block;
    } catch (e) {
      console.log(e)
      throw exc.ProblemGettingLatestBlock;
    }
}

async function queryBalance(walletAdress, blockNumber) {
  const query = gql`{
    tokenHolder(
      id: \"${walletAdress.toLowerCase()}\",   
      block: {number: ${blockNumber}}
    ) {
      tokenBalance
    }
  }`;
  let response;
  try {
    // Query for user's balance
    const graphAdress = 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed-governance';
    response = await request(graphAdress, query);
  } catch (e) {
    console.log(e)
    throw exc.TheGraphError;
  }

  if (response['tokenHolder'] == null) {
    throw new exc.InvalidWallet();
  } else {
    let balance = parseFloat(response['tokenHolder']['tokenBalance']);
    let balance_ = balance.toFixed(2);
    balance = parseFloat(balance_);
    return balance;
  }
}

const money = { 
  connectWeb3, 
  getBlockFromDate, 
  getLatestBlock, 
  queryBalance, 
}

export default money;
