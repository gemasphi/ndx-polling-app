
<h1 align="center">
  <br>
  <img src="https://miro.medium.com/max/10000/1*SGhrTdsbb8VIKVp35yDkIA.png" alt="Markdownify" width="500"></a>
  <br>
  NDX Polling App
  <br>
</h1>

<h4 align="center">An NDX-based Decentralized Polling App</h4>

<p align="center">
  <a href="#short-description">Short Description </a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>


<h1 align="center">
<img style="border-radius:3px" src="https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2FtheDigitalMe%2FU0WbXez63s.png?alt=media&token=1851113b-ad5c-42c9-ad44-827d7f0db68d" alt="Markdownify" width="800"></a>

</h1>



# Short Description

Open-source polling web app where users can create and vote on existing polls. When voting on a poll, the user logins on [MetaMask](https://metamask.io/) and the results are weighted by a users' NDX wallet balance. Besides that, a user can vote on multiple options in a poll.

There are three main pages:

- A poll creation page (the home page)
- A poll page that shows the voting options or the results for a specific poll
- A page that lists all the polls

### Features
- Single Page Application using React and Redux
- Serverless - it can easily be deployed on services like Heroku
- Distributed and Decentralized Database using 3box

# Quick Start
We use the following frameworks:
- React
- Redux
- 3Box
- [The Graph](https://thegraph.com/explorer/subgraph/indexed-finance/indexed-governance/)
- [Web3React](https://github.com/NoahZinsmeister/web3-react)
- [Ethers](https://docs.ethers.io/v5/)

### Developing

After cloning the repository, you need to install the dependencies needed by running `yarn install`.   

You can run the website with the following command `yarn start:dev`.

You can define the environment variables needed to run the project at `src/api/env.ts` which envolve DB configurations and the link for the web3 provider.

### Deploying
You can deploy this project by using any serverless solution. 

For example, this project can be easily deployed in Heroku, by building the code beforehand, running the command `yarn build`. Then, setting Heroku to use the branch that contains the built code. Heroku will run the command `npm run start` that will, as defined in the package.json, serve the app from the build `serve -s build`

# How it works
We can summarize the functionalities available in the web app as:
- Login/Logout with a wallet using metamask
- List all exiting polls
- Create a new poll
- Vote in a poll
- See the results for a poll
- See the votes and respective signatures in a poll 

## Poll Creation Page
Poll creation is where a user configures the settings for the new poll and specifies the question and choices. **If a user has not already connected their wallet, they are required to do so before creating a poll**. 

The poll creation interface has the following inputs:

1. Input field for the poll question (required input).
2. Input field for a short description of up to 400 characters (optional input).
3. Input fields for each question.
    - Some way of adding new questions (either a button or automatically when the user reaches the end of the current list).
4. Checkbox to make the poll a multiple answer poll.
5. Poll starting condition.

For creating a new poll, the user must select one of three starting conditions 

- A date
- An ETH block number
- The latest ETH block number

The user may select which option to choose from as displayed in the figure below.

<p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2FtheDigitalMe%2FwGr3rElK7-.png?alt=media&token=f6983136-5c48-4880-a76b-8ed9f1dd0278" />
</p>

When the option for __latest ETH block__ is selected, the system fetches the youngest ETH block in existence and starts the pole immediately. 

When selecting a block number or a date, the user is allowed to select both past or future options, and the system will act accordingly (keeping the poll in question disabled while the starting conditions are not met).

The translation between block numbers and dates is only possible for past dates (and blocks), so this can only be achieved once the poll starts. This means that, when a poll is created with conditions that will only be resolved in the future, the only starting condition that is used is the one specified directly by the user. Once this condition is met, we can get the complementary data.

## Poll Page
The poll page shows basic information and, based on the conditons presented below, a voting interface or result interface.

We show the results interface if:

- The user has not connected their wallet
- The user has already voted
- The poll has ended

Otherwise, we show the voting interface.

### Voting Interface

The user is required to sign its selected options via metamask before voting. The weight of a user's vote is directly proportional to the amount of NDX tokens he had in the poll's block number. 

Any time that results are rendered for that poll, every single vote in the list is validated. A user is only allowed to vote if its wallet had more than 0 NDX tokens at the poll's block number. The balance is queried in the [Indexed Governance Subgraph](https://thegraph.com/explorer/subgraph/indexed-finance/indexed-governance/) via the following graphQL query:

```
{
  tokenHolder(
    id: {lower_case_user_address},
    block:{number: 11891558}
  ) {
    tokenBalance
  }
}
```

### Results Interface
- Poll question
- Description (if any)
- Results for each option (pie chart)
- Total NDX used votes
- Option to open the list of voter receipts
- When the user submits their choice(s), they are required to [sign a typed message](https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4) with the poll ID and their selection.

## Database

We store our data in [3box](https://docs.3box.io/) which is a distributed database suitable for the client-side. 
3box can store data that are specific to wallet address which can then be accessed from multiple platforms. It also contains a thread mechanism that enables the storage of data that's available for any user. One can think of this as an immutable linked list, for which any user with enough permissions can write.
This project uses 3 types of threads to store its data.

The **poll thread**, which is a list of all the polls made of poll objects. This thread is unique for the entire project, meaning that there's only one. As soon as a poll is created, regardless of the starting conditions, a new entry is created.

### Poll Object
```
 {
        "id": str,                  // 17 rand char
        "title": str,
        "description": str,         // <= 400 chars 
        "options": [],	            // array of strings
        "multipleOption": boolean,
        "blockNumber": int,         // or null
        "startDate": str,           // date format dd/mm/yy HH:mm (or null)
        "endDate": str,             // date format dd/mm/yy HH:mm
        "voting-thread": str,
}
```

The **vote thread**. There's one of this for each poll. This contains all the votes for a particular poll and is made up of vote objects. Once a user submits a vote, a new vote object is created and appended in this specific thread. For rendering results, all of the posts in this thread are validated.

### Vote Object
```
{
    "wallet": str,    // hash
    "balance": float, // walled balence in the poll block
    "options": [],
    "signature": str, // hash 
    "message": str    // message signed by the user
}
```

An **initial conditions threads**, which also contains one entry per poll. This thread is unique for the entire platform. An entry is only made for this thread once a poll starting condition has been met (whatever it is). This is needed as a way to handle the start date / ETH block number duality. This is needed as a way to ensure consistency due to the start date / ETH block number duality. 

### Starting Condition Object
```
{
    "id": str,
    "startDate": str,	// date format dd/mm/yy HH:mm
    "blockNumber": int	
}
```

# Contributing

Feel free to make any contribution via pull requests :) 

Most of the high-level functionality of the platform is performed in the `src/api` module, so you may be able to adapt the entire project for different use cases via the modification of only this module, and the configurations at `src/api/env.ts`  

# License
GNU.
