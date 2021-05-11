import React, {useEffect} from 'react';
import { List, Skeleton } from 'antd';
import PollItem from '../components/PollItem'
import { useSelector, useDispatch } from 'react-redux';
import { selectPollList, selectLoading } from 'features/polls/selectors';
import { Polls } from 'features/polls/types';
import { usePollsSlice } from 'features/polls';
import { useHistory } from "react-router-dom";
import { useBoxDB } from 'app/3box'

export function PollList() {
	const polls : Polls = useSelector(selectPollList);
	const loading = useSelector(selectLoading);
	const { actions } = usePollsSlice();
	const dispatch = useDispatch();
	let history = useHistory();
	const { space } = useBoxDB();

	useEffect(() => {
		dispatch(actions.getPolls({space}));
	}, [])

	const onPollClick = (poll) => {
		history.push(process.env.PUBLIC_URL + "/poll/" + poll.id)
		dispatch(actions.resetCurrentPoll())
	}

	return (	
		<Skeleton loading={loading}>
		<List
	      itemLayout="horizontal"
	      size="small"
		  pagination={{
		      onChange: page => {
		        console.log(page);
		      },
		      pageSize: 5,
	      }}
	      dataSource={polls.list}
	      renderItem={
	        (poll) => <PollItem onPollClick={onPollClick} poll={poll}/>
	      }
	    />
	    </Skeleton>
    )
}
