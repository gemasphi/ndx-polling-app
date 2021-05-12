import Faker from 'faker'

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
    fectchingVoted: boolean;
    voted?: boolean;
    voting: boolean;
    fectchingVotes: boolean;
}


/*
export function createFakePolls() : Array<Poll>{
    let polls : Array<Poll> = [];

    for (let i = 0; i < Math.floor(Math.random() * 25); i++){
        let options : Array<string> = []
        let results: Array<Result> = [] 

        for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++){
            options.push(Faker.random.words())
        }


        let total_votes = 0
        for (let i = 0; i <options.length; i++){
            let votes =  Faker.random.number();
            total_votes += votes;
            results.push({
                option: i,
                value: 0,
                votes: votes
            })
          }


        results = results.map(result => ({...result, value: Math.round(100*result.votes/total_votes)}))

        polls.push({
            id: Faker.random.uuid(),
            title: Faker.lorem.sentence(),
            description: Faker.lorem.sentences(),
            options: options,
            multiOption: Faker.random.boolean(),
            blockNumber: Faker.random.number(),
            votes: [],
            results: results,
            finished: Faker.random.boolean()
        })
    }

    console.log(polls)
    return polls;
}
*/

