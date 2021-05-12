class InvalidID extends Error {
    constructor(args){
        super(args);
        this.name = "InvalidID"
        this.errorCode = 404
        this.message = "Unknown poll."
    }
  }

  class InvalidStartDate extends Error {
    constructor(args){
        super(args);
        this.name = "InvalidStartDate"
        this.errorCode = 400
        this.message = "Poll start date."

    }
}

class InvalidEndDate extends Error {
    constructor(args){
        super(args);
        this.name = "InvalidEndDate"
        this.errorCode = 400
        this.message = "Poll end date cannot be set to the past."

    }
}  

class PollNotStarted extends Error {
    constructor(args){
        super(args);
        this.name = "PollNotStarted"
        this.errorCode = 409
        this.message = "Voting period has not started yet."

    }
}  

class PollFinished extends Error {
    constructor(args){
        super(args);
        this.name = "PollFinished"
        this.errorCode = 409
        this.message = "Voting period is over."

    }
}

class TooManyOptions extends Error {
    constructor(args){
        super(args);
        this.name = "TooManyOptions"
        this.errorCode = 400
        this.message = "Invalid Vote - too many options for single option poll."

    }
}

class InvalidBlock extends Error {
    constructor(args){
        super(args);
        this.name = "InvalidBlock"
        this.errorCode = 406
        this.message = "The provided ETH block is invalid."
    }
}

class ProblemGettingLatestBlock extends Error {
    constructor(args){
        super(args);
        this.name = "ProblemGettingLatestBlock"
        this.errorCode = 404
        this.message = "A problem occurred while getting the latest block."
    }
}

class ProblemGettingBlock extends Error {
    constructor(args){
        super(args);
        this.name = "ProblemGettingBlock"
        this.errorCode = 404
        this.message = "A problem occurred while getting the block from date."
    }
}

class TheGraphError extends Error {
    constructor(args){
        super(args);
        this.name = "TheGraphError"
        this.errorCode = 406
        this.message = 'The Graph Returned an error when querying for balance)'
    }
}

class InvalidWallet extends Error {
    constructor(args){
        super(args);
        this.name = "InvalidWallet"
        this.errorCode = 406
        this.message = "Wallet/Block number combination seems invalid (querying for balance failed)."
    }
}

class InsufficientFunds extends Error {
    constructor(args){
        super(args);
        this.name = "InsufficientFunds"
        this.errorCode = 403
        this.message = "Not enough NDX tokens in wallet to cast vote."
    }
}

class UserAlreadyVoted extends Error {
    constructor(args){
        super(args);
        this.name = "UserAlreadyVoted"
        this.errorCode = 403
        this.message = "User has already voted in this poll."
    }
}

class UnknownVotingPolicy extends Error {
    constructor(args){
        super(args);
        this.name = "UnknownVotingPolicy"
        this.errorCode = 500
        this.message = "The poll seems to be missed configured."
    }
}

class TooManyStartingConditions extends Error {
    constructor(args){
        super(args);
        this.name = "TooManyStartingConditions"
        this.errorCode = 400
        this.message = "To create a poll you must specify only one of: block number or start date."
    }
}

class CachedResultsDontExist extends Error {
    constructor(args){
        super(args);
    }
}


let knownExceptions = [InvalidStartDate, InvalidEndDate, InvalidBlock, InvalidWallet, ProblemGettingLatestBlock, ProblemGettingBlock, InvalidID, InsufficientFunds, PollNotStarted,
     PollFinished, TooManyOptions, UserAlreadyVoted, UnknownVotingPolicy, TooManyStartingConditions, TheGraphError]
let generalErrorCode = 500
let generalErrorMessage = "Something Unexpected Happened"

function handleError(res, err){
    try{
        console.log(err)
        for(const ke of knownExceptions){
            if(err instanceof ke){
                return res.status(err.errorCode).send({'message': err.message});
            }
        } 
        return res.status(generalErrorCode).send({'error': err, 'message': generalErrorMessage});
    }catch(e){
        console.log(e)
        return res.status(generalErrorCode).send({'error': e, 'message': generalErrorMessage});
    }
    
}

module.exports = {
    handleError,
    knownExceptions,
    generalErrorCode,
    generalErrorMessage,
    InvalidStartDate, InvalidEndDate, InvalidBlock, InvalidWallet, ProblemGettingLatestBlock, ProblemGettingBlock, InvalidID, InsufficientFunds, PollNotStarted, PollFinished, TooManyOptions, UserAlreadyVoted, 
    UnknownVotingPolicy, CachedResultsDontExist, TooManyStartingConditions, TheGraphError
}