import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

export const selectPollList = (state: RootState) => state.polls || initialState;

export const selectCurrentPoll = createSelector(
	[selectPollList],
	(polls) => polls.currentPoll
)

export const selectLoading = createSelector(
	[selectPollList],
	(polls) => polls.loading
)

export const selectShowResults = createSelector(
	[selectPollList],
	(polls) => polls.showResults
)

export const selectShowVotes = createSelector(
	[selectPollList],
	(polls) => polls.showVotes
)

export const selectConnectingWallet = createSelector(
	[selectPollList],
	(polls) => polls.connectingWallet
)

export const selectConnectingDB = createSelector(
	[selectPollList],
	(polls) => polls.connectingDB
)

export const selectFectchingVoted = createSelector(
	[selectPollList],
	(polls) => polls.fectchingVoted
)

export const selectFectchingVotes = createSelector(
	[selectPollList],
	(polls) => polls.fectchingVotes
)

export const selectWallet = createSelector(
	[selectPollList],
	(polls) => polls.wallet
)

export const selectVoted = createSelector(
	[selectPollList],
	(polls) => polls.voted
)

export const selectVoting = createSelector(
	[selectPollList],
	(polls) => polls.voting
)











