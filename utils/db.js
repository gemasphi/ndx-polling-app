const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const Identities = require('orbit-db-identity-provider')
const moment = require('moment')
const uniqid = require('uniqid');
const {InvalidID, CachedResultsDontExist} = require('../utils/customExceptions')
const {initEmptyResults} = require('../utils/voting')
const {connectWeb3, getLatestBlock} = require('../utils/money')


const getClientDB = async (path) => {
  /*
    const options = { 
      id: 'local-id',
    }
    const identity = await Identities.createIdentity(options)
    */
    const ipfsOptions = {
        //repo: path,
        // identity: identity,
        Addresses: {
          Swarm: [
            "/ip4/0.0.0.0/tcp/5002",
            "/ip4/127.0.0.1/tcp/5003/ws"
          ],
          API: '/ip4/127.0.0.1/tcp/6012',
          Gateway: '/ip4/127.0.0.1/tcp/9191'
        },
    }

    const db = await IPFS.create(ipfsOptions)
      .then(ipfs => {
        return OrbitDB.createInstance(ipfs)
      }).then(orbitDB => {
          return orbitDB.docs('ndx-polling', { indexBy: 'id' })
      }).then(db => {
        // Listen for updates from peers
        db.events.on('replicated', (address) => {
          console.log("replicated")
        })
        return db
      })
    
    await db.load()
    console.log('> DB is live! Peers can connect @ ' + db.address.toString())

    return db
}

const savePoll = async (client, poll) => {
  // Generate ID
  let id = uniqid()
  poll['id'] = id
  poll['objectType'] = 'poll'

  const optionWeights = initEmptyResults(poll['options'])
  const cache = await saveCachedResults(client, optionWeights, id, 0, 0)
  
  poll['resultsCache'] = cache['id']
  await client.put(poll)
  return poll
}

const getPoll = async (client, id, providerLink, dev) => {
  let pollInfo = await client.get(id)[0]
  
  if(typeof pollInfo === 'undefined'){
    throw new InvalidID
  }
  let changes
  
  if(!('started' in pollInfo) || (pollInfo['started'] === false)){
    changes, pollInfo = await checkIfPollStart(pollInfo, providerLink, dev) 
    if(changes===true){
      await client.put(pollInfo)
    }   
  } 
  if(!('finished' in pollInfo) || (pollInfo['finished'] === false)){
    changes, pollInfo = await checkIfPollFinito(pollInfo)
    if(changes===true){
      await client.put(pollInfo)
    }   
  }
  
  return pollInfo
}

/*
const updateNDX = async (client, poll, newNDX) => {
  poll['totalNDXUsed'] = newNDX
  await client.put(poll)
  return poll
}
*/

const getAllPolls = async (client) => {
  const polls = client.query((doc) => {
    if(doc.objectType == 'poll'){
      return doc
    }
  })
  return polls 
}

const saveVote = async (client, vote) => {
  // Generate ID
  let id = uniqid()
  vote['id'] = id
  vote['objectType'] = 'vote'
  await client.put(vote)
  return vote
}

const getPollVotes = async(client, pollId) => {
  const votes = client.query((doc) => {
    if(doc.objectType == 'vote' && doc.poll == pollId){
      return doc
    }
  })
  return votes
}

const saveCachedResults = async (client, optionWeights, pollId, numVotes, totalNDXUsed) => {
    let id = uniqid()
    let results = {
      id,
      'objectType': 'results',
      pollId,
      optionWeights,
      numVotes,
      totalNDXUsed
    }
    await client.put(results)
    return results
}

const getCachedResults = async (client, id) => {
  let results = await client.get(id)[0]
  
  if(typeof results === 'undefined'){
    throw new CachedResultsDontExist
  }
  return results
}

const updateCachedResults = async (client, id, optionWeights, pollId, numVotes, totalNDXUsed) => {
  let results = {
    id,
    'objectType': 'results',
    pollId,
    optionWeights,
    numVotes,
    totalNDXUsed
  }
  await client.put(results)
  return results
}

const checkIfPollStart = async (pollInfo, providerLink, dev) => {
  const today = new moment().utc()
  console.log(pollInfo)
  if(pollInfo['startDate']===null){
    // FIXME - using req.
    const web3 = connectWeb3(providerLink) 
    let blockNumber = await getLatestBlock(web3, dev)
    console.log('Latest block: ' + blockNumber + ' our block: ' + pollInfo['blockNumber'])
    
    if(blockNumber > pollInfo['blockNumber']){
      pollInfo['started'] = true
      pollInfo['startDate'] = today.format()
    } else {
      pollInfo['started'] = false
    } 
  } else {
    const startDate = moment(pollInfo['startDate']).utc()
    if(today.isAfter(startDate)){
      pollInfo['started'] = true
    } else {
      pollInfo['started'] = false
    }
  }
  return pollInfo['started'], pollInfo
}

const checkIfPollFinito = async (pollInfo) => {
  const today = new moment().utc()
  const endDate = moment(pollInfo['endDate'])
  
  if(today.isAfter(endDate)){
    pollInfo['finished'] = true
  } else {
    pollInfo['finished'] = false
  }
  return pollInfo['finished'], pollInfo
}

function omit(obj, omitKey) {
  return Object.keys(obj).reduce((result, key) => {
    if(key !== omitKey) {
       result[key] = obj[key];
    }
    return result;
  }, {});
}

module.exports = {
  getClientDB,
  savePoll,
  getPoll,
  getAllPolls,
  saveVote,
  getPollVotes,
  saveCachedResults,
  getCachedResults,
  updateCachedResults,
  omit,
  checkIfPollStart, 
  checkIfPollFinito
};
