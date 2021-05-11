import { call, put, all, takeLatest } from 'redux-saga/effects';
import { Actions as actions } from '.';
import api from "api/index";
import {forwardTo} from 'app/history';
import { message } from 'antd';

function* getPolls(action) {
   	try {
      	const polls = yield call(api.getPolls, action.payload.space);
		yield put(actions.getPollsSuccess(polls));
   	} catch (e) {
   		e.userMessage && message.error(e.userMessage);
		yield put(actions.getPollsFailure({}));
	}
}

function* getPoll(action) {
   	try {
      	const poll = yield call(api.getPoll, action.payload.space, action.payload.id);
		yield put(actions.getPollSuccess(poll));
		yield put(actions.setShowVotes(false));
   	} catch (e) {
   		e.userMessage && message.error(e.userMessage);
		yield put(actions.getPollFailure({}));
	}
}

function* getPollVoted(action) {
   	try {
      	const voted = yield call(api.getPollVoted, action.payload.space, action.payload.id, action.payload.wallet);
		yield put(actions.getPollVotedSuccess({voted}));
   	} catch (e) {
   		e.userMessage && message.error(e.userMessage);
		yield put(actions.getPollFailure({}));
	}
}

function* getPollResults(action) {
   	try {
      	const poll = yield call(api.getPollResults, action.payload.space, action.payload.id);
		yield put(actions.getPollResultsSuccess(poll));
		yield put(actions.setShowVotes(false));
   	} catch (e) {
   		e.userMessage && message.error(e.userMessage);
		yield put(actions.getPollFailure({}));
	}
}

function* getPollVotes(action) {
   	try {
      	let poll = yield call(api.getPollVotes, action.payload.space, action.payload.id);
		yield put(actions.getPollVotesSuccess(poll));
		yield put(actions.setShowVotes(true));
   	} catch (e) {
   		e.userMessage && message.error(e.userMessage);
		yield put(actions.getPollFailure({}));
	}
}

function* setPoll(action) {
   	try {
      	const poll = yield call(api.setPoll, action.payload.space, action.payload.id, action.payload.data);
		yield put(actions.setPollSuccess(poll));
		message.success("Vote Successful!");
		yield put(actions.updateShowResults());
   	} catch (e) {
   		e.userMessage && message.error(e.userMessage);
		yield put(actions.setPollFailure({}));
	}
}


function* createPoll(action) {
   	try {
      	const poll = yield call(api.createPoll, action.payload.space, action.payload.poll);
		yield put(actions.createPollSuccess(poll));
		yield put(actions.resetCurrentPoll());
		message.success("Poll Created!");
		yield call(forwardTo, `/poll/${poll.id}`);

   	} catch (e) {
		e.userMessage && message.error(e.userMessage);
		yield put(actions.createPollFailure({}));
	}
}


function* updateShowResults(action){
	yield put(actions.updateShowResults());
}

export function* Saga() {
	yield all([
		takeLatest(actions.getPolls.type, getPolls),
		takeLatest(actions.getPoll.type, getPoll),
		takeLatest(actions.getPollResults.type, getPollResults),
		takeLatest(actions.getPollVotes.type, getPollVotes),
		takeLatest(actions.setPoll.type, setPoll),
		takeLatest(actions.getPollVoted.type, getPollVoted),
		takeLatest(actions.createPoll.type, createPoll),
		takeLatest(actions.setWallet.type, updateShowResults),
		takeLatest(actions.getPollSuccess.type, updateShowResults),
		takeLatest(actions.getPollVotedSuccess.type, updateShowResults),
		takeLatest(actions.getPolls.type, updateShowResults),
		takeLatest(actions.createPollSuccess.type, updateShowResults),
		takeLatest(actions.resetCurrentPoll.type, updateShowResults),
	]);
}
