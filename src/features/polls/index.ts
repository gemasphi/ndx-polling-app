import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Saga } from './saga';
import { Polls, Vote } from './types';


export const initialState: Polls = {
	list: [],
	loading: false,
  showResults: false,
  showVotes: false,
  fectchingVoted: false,
  voted: undefined,
  currentPoll: undefined,
  wallet: undefined,
  connectingWallet: false,
  connectingDB: false,
  voting: false,
  fectchingVotes: false,
  box: undefined,
  space: undefined,
};


const slice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    resetCurrentPoll: (state) =>{
      state.currentPoll = undefined
      state.voted = undefined
    },
    setWallet: (state, action: PayloadAction<any>) => {
      state.wallet = action.payload;    
      state.voted = undefined  
    },
    setConnectingDB: (state, action: PayloadAction<any>) => { 
      state.connectingDB = action.payload;
    },
    setConnectingWallet: (state, action: PayloadAction<any>) => {
      state.connectingWallet = action.payload;      
    },
    setShowVotes: (state, action: PayloadAction<any>) => {
      state.showVotes = action.payload;      
    },
    getPolls: (state, action: PayloadAction<any>) => {
      state.loading = true;      
    },
    getPollsSuccess: (state, action: PayloadAction<any>) => {
      state.list = action.payload;
      state.loading = false;
    },
    getPollsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
    },
    getPoll: (state, action: PayloadAction<any>) => {
      state.loading = true;      
    },
    getPollResults: (state, action: PayloadAction<any>) => {
      state.loading = true;      
    },
    getPollResultsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;      
      state.currentPoll = action.payload
    },
    getPollVotes: (state, action: PayloadAction<any>) => {
      state.fectchingVotes = true;      
    },
    getPollVotesSuccess: (state, action: {payload: Array<Vote>}) => {
      state.currentPoll && (
        state.currentPoll = {
          ...state.currentPoll,
          votes: action.payload
        })

      state.fectchingVotes = false;      
    },
    getPollSuccess: (state, action: PayloadAction<any>) => {
      state.currentPoll = action.payload
      state.loading = false;
    },
    getPollFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
    },
    setCurrentPoll: (state, action: PayloadAction<any>) => {
      state.currentPoll = action.payload
    },
    setPoll: (state, action: PayloadAction<any>) => {
      state.voting = true;
    },
    setPollSuccess: (state, action: PayloadAction<any>) => {
      state.currentPoll = action.payload
      state.voted = true;
      state.voting = false;
    },
    setPollFailure: (state, action: PayloadAction<any>) => {
      state.voting = false;
    },
    setShowResults : (state, action: PayloadAction<any>) => {
      state.showResults = action.payload;
    },
    resetShowResults : (state, action: PayloadAction<any>) => {
      state.showResults = action.payload;
    },
    getPollVoted: (state, action: PayloadAction<any>) => {
      state.fectchingVoted = true;
    },
    getPollVotedSuccess: (state, action: PayloadAction<any>) => {
      state.voted = action.payload.voted;
      state.fectchingVoted = false;   
    },
    createPoll: (state, action: PayloadAction<any>) => {
      state.loading = true;      
    },
    createPollSuccess: (state, {payload}) => {
      state.loading = false;
    },
    createPollFailure: (state, {payload}) => {
      state.loading = false;
    },
    updateShowResults: (state) => {
      state.showResults = (state.wallet === undefined 
        || (state.currentPoll && state.currentPoll.finished) 
        || !!state.voted)
    }
  },
});

export const { actions: Actions } = slice;

export const usePollsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: Saga });
  return { actions: slice.actions };
};