import { take, call, put, all, select, takeLatest } from 'redux-saga/effects';
import { Actions as actions } from '.';
import api from "api";
import {history, forwardTo} from 'app/history';
import { message } from 'antd';

function* getPolls(action) {
   	try {
      	const polls = yield call(api.getPolls);
		yield put(actions.getPollsSuccess(polls));
   	} catch (e) {
   		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.getPollsFailure({}));
	}
}

function* getPoll(action) {
   	try {
      	const poll = yield call(api.getPoll, action.payload.id);
		yield put(actions.getPollSuccess(poll));
		yield put(actions.setShowVotes(false));
   	} catch (e) {
   		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.getPollFailure({}));
	}
}

function* getPollVoted(action) {
   	try {
      	const poll = yield call(api.getPollVoted, action.payload.id, action.payload.wallet);
		yield put(actions.getPollVotedSuccess(poll));
   	} catch (e) {
   		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.getPollFailure({}));
	}
}

function* getPollResults(action) {
   	try {
      	const poll = yield call(api.getPollResults, action.payload.id);
		yield put(actions.getPollSuccess(poll));
		yield put(actions.setShowVotes(false));
   	} catch (e) {
   		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.getPollFailure({}));
	}
}

function* getPollVotes(action) {
   	try {
      	let poll = yield call(api.getPollVotes, action.payload);
		yield put(actions.getPollVotesSuccess(poll));
		yield put(actions.setShowVotes(true));
   	} catch (e) {
   		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.getPollFailure({}));
	}
}

function* setPoll(action) {
   	try {
      	const poll = yield call(api.setPoll, action.payload.id, action.payload.data);
		yield put(actions.setPollSuccess(poll));
		message.success("Vote Successful!");
		yield put(actions.updateShowResults());
		//yield call(forwardTo, '/poll-list');
   	} catch (e) {
   		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.setPollFailure({}));
	}
}


function* createPoll(action) {
   	try {
		//await new Promise(resolve => setTimeout(resolve, 1)); // 3 sec
		console.log(action);
      	const poll = yield call(api.createPoll, action.payload);
		yield put(actions.createPollSuccess(poll));
		yield put(actions.resetCurrentPoll());
		message.success("Poll Created!");
		yield call(forwardTo, `/poll/${poll.id}`);

   	} catch (e) {
		e.response.data.message && message.error(e.response.data.message);
		yield put(actions.createPollFailure({}));
	}
}


function* updateShowResults(action){
	/*
	let showResults = false;
	if (action.type == actions.getPolls.type || action.type == actions.createPoll.type){
		yield put(actions.resetShowResults(false));
	}
	else if (action.type == actions.setWallet.type){
		showResults = action.payload === undefined
	} else if(action.type == actions.getPollSuccess.type) {
		showResults = action.payload.finished
	} else if(action.type == actions.getPollVotedSuccess.type) {
		showResults = action.payload.voted
	}
	*/
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
