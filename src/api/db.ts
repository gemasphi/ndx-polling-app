import uniqid from 'uniqid';
import exc from "api/customExceptions";
import {POLL_LIST_ADDR, POLL_STAR_COND_ADDR} from "api/env";
import Box from "3box";
import voting from "api/voting"; 


export async function getThreadPosts(space, addr, authMandatory=false) {
  let posts
  if(space==null){
    if(authMandatory === true){
      throw new exc.AuthMandatoryButSpaceIsFalse()
    } else {
      let thread = await Box.getThreadByAddress(addr)
      posts = thread.map((x) => {
        return JSON.parse(x.message)
      }).reverse()
    }
  } else {
    let thread = await space.joinThreadByAddress(addr)
    posts = await thread.getPosts()
    posts = posts.map((x) => {
      return JSON.parse(x.message)
    }).reverse()
  }
  return posts
}

export async function castPoll(space, pollPayload, commitStartCond=false) {
    const id = uniqid()
    
    // Init vote list
    const votingThread = await space.joinThread('poll/' + id + '/votes')
    const dummyVote = {
      'title': 'Dummy vote to kickstart the thread',
    }
    votingThread.post(JSON.stringify(dummyVote))

    // Save poll
    pollPayload['voting-thread'] = votingThread.address
    pollPayload['id'] = id    
    const payloadAsStr = JSON.stringify(pollPayload);   // JSON.parse(str)
    
    const pollListThread = await space.joinThreadByAddress(POLL_LIST_ADDR)
    await pollListThread.post(payloadAsStr)

    if(commitStartCond){
      commitPollConditions(space, pollPayload['id'], pollPayload['startDate'], pollPayload['blockNumber'])
    }

    return pollPayload
}

export async function castVote(space, pollId, vote){
  const poll = await getSpecificPoll(space, pollId);
  
  // Save new vote
  const voteAsStr = JSON.stringify(vote);
  const votingThread = await space.joinThreadByAddress(poll['voting-thread']);
  await votingThread.post(voteAsStr)
}

export async function commitPollConditions(space, id, startDate, blockNumber){
  if(space == null){
    return
  }
  const voteAsStr = JSON.stringify({
    id,
    startDate,
    blockNumber
  });
  const votingThread = await space.joinThreadByAddress(POLL_STAR_COND_ADDR);
  await votingThread.post(voteAsStr)
}

export async function getStartConditions(space, pollId){
  let polls = await getThreadPosts(space, POLL_STAR_COND_ADDR)
  polls = polls.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});   // Index by ID
  if(pollId in polls){
    return polls[pollId]
  } else {
    return null
  }
}

export async function listPolls(space) {
    let polls = await getThreadPosts(space, POLL_LIST_ADDR)
    return polls
}

export  async function listPollsByIndex(space) {
  let polls = await listPolls(space)
  polls = polls.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});   // Index by ID
  return polls
}

export async function listVotes(web3, space, pollId) {
    const poll = await getSpecificPoll(space, pollId)
    let votes = await getThreadPosts(space, poll['voting-thread'])
    if (votes.length > 1){votes.pop()} else {votes = []}
    votes = await voting.verifyVotes(web3, votes)
    return votes
}

export  async function getSpecificPoll(space, id) {
    const polls = await listPollsByIndex(space);
    if(id in polls){
      return polls[id];
    }
    else {
      throw new exc.InvalidID()
    }
}

export async function checkIfAlreadyVoted(web3, space, id, wallet) {
  const votes = await listVotes(web3, space, id)
  const voters = votes.map((x) => {
    return x['wallet']
  }) 
  return voters.includes(wallet)
}
