const moment = require('moment')
const {getPoll, getPollVotes, getCachedResults, saveCachedResults, checkIfPollStart, checkIfPollFinito} = require('../utils/db')
const {checkIfAlreadyVoted, initEmptyResults} = require('../utils/voting')
const {connectWeb3, getLatestBlock, queryBalance, validateBlockNumber, getAuthorFromSignature, getBlockFromDate} = require('../utils/money')
const {handleError, InvalidStartDate, InvalidEndDate, InsufficientFunds, PollNotStarted, PollFinished, TooManyOptions, UserAlreadyVoted, CachedResultsDontExist,
    TooManyStartingConditions} = require('../utils/customExceptions')


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
    else if(!moment(x).isValid()){
        throw new InvalidStartDate
    }
    return true
}

const pollCastMiddleware = async (req, res, next) => {

    try{
        // Ensure body has all required params
        if(!('title' in req.body) || !(typeof req.body['title'] === 'string')){
            return res.status(400).send({'message': 'Missing or invalid Title'})
        } 
        if(!('description' in req.body)){
            req.body['description'] = ''
        } else if(req.body['description'].length > 400){
            return res.status(400).send({'message': 'Description too long (maximum of 400 words)'})
        }
        if (!('options' in req.body) || !(Array.isArray(req.body.options)) || (req.body.options.length<=1) ){
            return res.status(400).send({'message': 'Missing or invalid answer options'});
        }
        if (!('multipleOption' in req.body) || (!typeof req.body.multipleOption === "boolean")){
            return res.status(400).send({'message': 'Missing or invalid voting strategy'})
        }
        if(!('endDate' in req.body) || !(moment(req.body['endDate']).isValid())){
            return res.status(400).send({'message': 'Invalid end date (DD/MM/YYYY HH:mm)'})
        }

        // Check the dates work out and set variables accordingly
        //const today = new moment(new Date(new Date().getTime()))
        const today = new moment().utc()
        const startDateAsDate = moment(req.body['startDate']).utc()
        const endDateAsDate = moment(req.body['endDate']).utc()

        if(endDateAsDate <= today){throw new InvalidEndDate} 
        req.body['started'] = startDateAsDate > today ? false: true
        req.body['finished'] = false  

        console.log(startDateIsValid(req.body['startDate']))
        console.log(blockNumberIsValid(req.body['blockNumber']))

        if(!startDateIsValid(req.body['startDate']) && !blockNumberIsValid(req.body['blockNumber'])){
            console.log('Start date and blockNumber are both null')
            // Both are uselees - get latest block and it's done
            const web3 = connectWeb3(req.providerLink)
            req.body['blockNumber'] = await getLatestBlock(web3, startDateIsValid(req.body['startDate']))
            req.body['startDate'] = new moment().format()
        } else if(startDateIsValid(req.body['startDate']) && blockNumberIsValid(req.body['blockNumber'])) {
            console.log('Start date and blockNumber are both invalid....')
            throw new TooManyStartingConditions       
        }
        else if(startDateIsValid(req.body['startDate'])){
            console.log('Start date is good')
            // Use start date and get block number
            const web3 = connectWeb3(req.providerLink) 
            req.body['blockNumber'] = await getBlockFromDate(web3, moment(req.body['startDate']))
        
        } else if(blockNumberIsValid(req.body['blockNumber'])){
            console.log('blockNumber is good')
            // Use block number and get start date
            req.body['startDate'] = null
        } 
        let changes
        changes, req.body = await checkIfPollStart(req.body, req.providerLink, req.dev)
        changes, req.body = await checkIfPollFinito(req.body)
    }catch(e){
        return handleError(res, e)
    }
    console.log('Out')

    return next()
}

const voteCastMiddleware = async (req, res, next) => {
     
    
    try{
        // Ensure body has all required params
        if(!('wallet' in req.body) || !(typeof req.body['wallet'] === 'string')){
            console.log('Missing or invalid Wallet')
            return res.status(400).send({'message': 'Missing or invalid Wallet'});
        }
        if (!('vote' in req.body) || !(Array.isArray(req.body.vote))){
            return res.status(400).send({'message': 'Missing or invalid Vote'});
        }
        if (!('signature' in req.body) || !(typeof req.body['signature'] === 'string')){
            return res.status(400).send({'message': 'Missing or invalid signature'});
        }
        if (!('message' in req.body) || !(typeof req.body['message'] === 'string')){
            return res.status(400).send({'message': 'Missing original message (that the user signed to)'});
        }
        
        // Ensure poll exists
        let client = await req.db
        let pollInfo = req.pollInfo
        let votes = req.votes

        // Ensure voting period is valid
        if(pollInfo['started'] === false){
            throw new PollNotStarted
        } else if(pollInfo['finished'] === true){
            throw new PollFinished
        }

        // Ensure vote itself is valid (according to policy)
        if(pollInfo['multipleOption'] === false){
            if(req.body.vote.length != 1){
                throw new TooManyOptions
            }
        }
        
        req.body['wallet'] = req.body['wallet']
        console.log(req.body)

        if(req.dev===true){
            if('balance' in req.body){
                req.balance = req.body['balance']
            } else {
                req.balance = 100
            }   
        } else {

            // Ensure voter is valid
            const voted = checkIfAlreadyVoted(votes, req.body['wallet'])
            if(voted===true){
                throw new UserAlreadyVoted
            }

            // Get wallet balance and ensure it is valid
            const balance = await queryBalance(req.body['wallet'], pollInfo['blockNumber'])
            req.balance = balance
            if(!(balance > 0)){
                throw new InsufficientFunds
            }
            
            // Ensure signature is valid
            const web3 = connectWeb3(req.providerLink)
            const signer = await getAuthorFromSignature(web3, req.body['message'], req.body['signature']) 
            if(signer != req.body['wallet']){ 
                return res.status(400).send({'message': 'Signature and wallet address do not match'})
            }
        }

    }catch(e){
        return handleError(res, e)
    }
      
    return next()

}

const getPollMiddleware = async (req, res, next) => {
    try{
        // Ensure poll exists
        let client = await req.db
        let pollInfo = await getPoll(client, req.params.id, req.providerLink, req.dev)
        req.pollInfo = pollInfo
        return next()
    }catch(e){
        return handleError(res, e)
    }
}

const getVotesMiddleware = async (req, res, next) => {
    try{
        let client = await req.db
        let votes = await getPollVotes(client, req.params.id)
        req.votes = votes
        return next()
    }catch(e){
        return handleError(res, e)
    }
}

const getCachedResultsMiddleware = async (req, res, next) => {
    let client = await req.db
    let pollInfo = req.pollInfo
    let votes = req.votes

    try{

        let cachedResults = await getCachedResults(client, pollInfo['resultsCache'])
        
        console.log('Deciding how to serve results')

        if(cachedResults['numVotes'] == votes.length){
            throw new CachedResultsDontExist
            console.log('> Using cached results')
            pollInfo['results'] = cachedResults['optionWeights']
            pollInfo['totalNDXUsed'] = cachedResults['totalNDXUsed']
            return res.status(200).send(pollInfo)
        } else {
            console.log('> Cache won\'t do, moving on')
            return next()
        }

    }catch(e){
        if(e instanceof CachedResultsDontExist){
            // This should never happen but let's deal with it just in case - Init empty cache and continue to next middleware to populate it            
            let optionWeights = initEmptyResults(pollInfo['options'])
            const cache = await saveCachedResults(client, optionWeights, pollInfo['id'], 0, 0)
            pollInfo['resultsCache'] = cache['id']
            await client.put(pollInfo)
            req.pollInfo = pollInfo
            return next()
        }
        return handleError(res, e)
    }
}

module.exports = {
    pollCastMiddleware,
    voteCastMiddleware,
    getPollMiddleware,
    getVotesMiddleware,
    getCachedResultsMiddleware
} 