const express = require('express');
const router = express.Router();
const {asyncMiddleware} = require('../utils/asyncMiddleware');
const {getResults, checkIfAlreadyVoted, totalNDX} = require('../utils/voting')
const {pollCastMiddleware, voteCastMiddleware, getPollMiddleware, getVotesMiddleware, getCachedResultsMiddleware} = require('../utils/validators')
const {savePoll, getPoll, getAllPolls, saveVote, getPollVotes, updateCachedResults, omit} = require('../utils/db')
const {handleError} = require('../utils/customExceptions')


// Save Poll
router.post('/', asyncMiddleware(pollCastMiddleware), asyncMiddleware(async (req, res, next) => {
    // Get params from body
    let pollInfo = req.body

    try{
      let client = await req.db
      console.log(pollInfo)
      let poll = await savePoll(client, pollInfo)


      // Reply
      res.status(201).send(poll);

    } catch(e){
      return handleError(res, e)
    }
}));

// Get single poll
router.get('/:id',  asyncMiddleware(getPollMiddleware), asyncMiddleware(async (req, res, next) => {
  try{
    let pollInfo = req.pollInfo  
    res.status(200).send(pollInfo);
  }catch(e){
    return handleError(res, e)
  }
}))

// Get poll list
router.get('/', asyncMiddleware(async (req, res, next) => {
  try{
      let client = await req.db
      let allPolls = await getAllPolls(client)
      
      // Sort by start date
      allPolls = allPolls.sort((a, b) => (new Date(a.startDate) > new Date(b.startDate)) ? 1 : -1)

      res.status(200).send(allPolls);
  }catch(e){
    return handleError(res, e)
  }
}))

// Cast Vote
router.put('/:id', asyncMiddleware(getPollMiddleware), asyncMiddleware(getVotesMiddleware), asyncMiddleware(voteCastMiddleware), asyncMiddleware(async (req, res, next) => {

    // Get params from body
    const walletAdress = req.body.wallet
    const balance = req.balance 
    const signature = req.body.signature
    let options = req.body.vote  
    let pollInfo = req.pollInfo

    try{
      // Get DB client
      let client = await req.db

      // Save poll with new answer
      let newVote = {
        'wallet': walletAdress,
        'balance': parseFloat(parseFloat(balance).toFixed(2)),
        'options': options,
        'signature': signature,
        'poll': pollInfo['id']
      }
      
      newVote = await saveVote(client, newVote)
     
      // Reply
      res.status(201).send(pollInfo);

    }catch(e){
      return handleError(res, e)
    }
    
}))

// Get votes list
router.get('/:id/votes', asyncMiddleware(getVotesMiddleware), asyncMiddleware(async (req, res, next) => {
  try{
    const votes = req.votes
    res.status(200).send(votes)
  }catch(e){
    return handleError(res, e)
  }
}))

// Get results
router.get('/:id/results', asyncMiddleware(getPollMiddleware), asyncMiddleware(getVotesMiddleware), asyncMiddleware(getCachedResultsMiddleware),
  asyncMiddleware(async (req, res, next) => {
    try{
      let client = await req.db
      let pollInfo = req.pollInfo
      let votes = req.votes

      let results = await getResults(client, pollInfo, votes, req.dev)
      let totalNDXUsed = totalNDX(votes)

      await updateCachedResults(client, pollInfo['resultsCache'], results, pollInfo['id'], votes.length, totalNDXUsed)

      // Copy poll information and change it to reply
      let replyObj = JSON.parse(JSON.stringify(pollInfo));
      replyObj['results'] = results
      replyObj['totalNDXUsed'] = totalNDXUsed
      res.status(200).send(replyObj)
    
    }catch(e){
      return handleError(res, e)
    }
}))

// Check if voted
router.get('/:id/voted', asyncMiddleware(getVotesMiddleware), asyncMiddleware(async (req, res, next) => {
  try{
    let wallet = req.get('wallet')    // Parameter from header

    if (wallet == null) {
      return res.status(400).send({'message': 'Missing Wallet'});
    }

    let voted = checkIfAlreadyVoted(req.votes, wallet)

    res.status(200).send({voted})
  } catch(e){
    return handleError(res, e)
  }
}))


module.exports = router;

