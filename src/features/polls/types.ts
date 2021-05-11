export interface Vote{
	options: Array<number>;
	wallet: string; 
    balance: number; 
}

export interface Result{
    option: number;
    weights: number;
    numVotes: number;
}

export interface Poll{
    id: string;
    title: string;
    description: string;
    options: Array<string>;
    multipleOption: boolean;
    blockNumber: string;
    finished: boolean;
    started: boolean;
    votes?: Array<Vote>;
    results?: Array<Result>;
    startDate: string;
    endDate: string;
    totalNDXUsed?: number;
    voted?: boolean;
} 

export interface Polls{
    currentPoll?: Poll;
	list: Array<Poll>;
    loading: boolean;
    showResults: boolean;
    showVotes: boolean;
    wallet?: string;
    connectingWallet: boolean;
    connectingDB: boolean;
    fectchingVoted: boolean;
    voted?: boolean;
    voting: boolean;
    fectchingVotes: boolean;
    space?: any;
    box?: any;
}