class startingConditionsDontAddUp extends Error {
    userMessage = "Both block number and start date are null."
    constructor(){
        super();
        this.name = "startingConditionsDontAddUp"
    }
}

class InvalidID extends Error {
    userMessage = "Unknown poll."
    constructor(){
        super();
        this.name = "InvalidID"
    }
}

class ProblemGettingLatestBlock extends Error {
    userMessage = "A problem occurred while getting the latest block."
    constructor(){
        super();
        this.name = "ProblemGettingLatestBlock"
    }
}

class ProblemGettingBlock extends Error {
    userMessage = "A problem occurred while getting the block from date."
    constructor(){
        super();
        this.name = "ProblemGettingBlock"
    }
}

class TheGraphError extends Error {
    userMessage = 'The Graph Returned an error when querying for balance)'
    constructor(){
        super();
        this.name = "TheGraphError"
    }
}

class InvalidWallet extends Error {
    userMessage = "Wallet/Block number combination seems invalid (querying for balance failed)."
    constructor(){
        super();
        this.name = "InvalidWallet"
    }
}

class SignWalletNotMatch extends Error {
    userMessage = "Signer wallet and current wallet do not match"
    constructor(){
        super();
        this.name = "SignWalletNotMatch"
    }
}

class InsufficientFunds extends Error {
    userMessage = "Not enough NDX tokens in wallet to cast vote."
    constructor(){
        super();
        this.name = "InsufficientFunds"
    }
}

class UserAlreadyVoted extends Error {
    userMessage = "User has already voted in this poll."
    constructor(){
        super();
        this.name = "UserAlreadyVoted"
    }
}

class AuthMandatoryButSpaceIsFalse extends Error {
    userMessage = "You need to be authenticated in 3box to perform this action."
    constructor(){
        super();
        this.name = "AuthMandatoryButSpaceIsFalse"
    }
}

const exceptions = {
    startingConditionsDontAddUp, 
    InvalidWallet, 
    ProblemGettingLatestBlock, 
    ProblemGettingBlock, 
    InvalidID, 
    InsufficientFunds, 
    UserAlreadyVoted, 
    TheGraphError,
    AuthMandatoryButSpaceIsFalse, 
    SignWalletNotMatch
}

export default exceptions