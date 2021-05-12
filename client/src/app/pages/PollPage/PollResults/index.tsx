import React, { useState, ComponentProps, useEffect } from 'react';
import {Grid, Table, Typography, Form, Input, Button, Select, Checkbox, Col, Progress, Row, Divider, Skeleton } from 'antd';
import PollResult from '../components/PollResult'
import ResultPieChart from '../components/ResultPieChart'
import PollHeader from '../components/PollHeader'
import { Poll } from 'features/polls/types';
import { useSelector, useDispatch } from 'react-redux';
import { usePollsSlice } from 'features/polls';
import { selectLoading, selectCurrentPoll, selectShowVotes, selectFectchingVotes} from 'features/polls/selectors';
import { useParams } from 'react-router-dom';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {BackgroundWrapper} from 'app/components/PageWrappers';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';


const { Title, Paragraph, Text, Link } = Typography;

const VotesWrapper = styled(props => <Col {...props}/>)`
${({ screens }) => (screens.lg) ? `padding: 0`:`padding: 2em 0 0 0;`}`


interface ParamTypes{
  id: string
}


const { useBreakpoint } = Grid;

const colors =  [[16, 142, 233], [135, 208, 104]]
const arrayToRGB = (array) => (`rgb(${array})`)

export function PollResults() {
	const { t } = useTranslation();

	const columns = [
	  {
	    title: t(...messages.columnWallet()),
	    dataIndex: 'wallet',
	    colSpan: 1,
	    ellipsis: true,
	  },
	  {
	    title: t(...messages.columnBalance()),
	    dataIndex: 'balance',
	  },
	  {
	    title: t(...messages.columnOptions()),
	    dataIndex: 'options',
	    render: options => (options.join())
	  },
	];

	const { id } = useParams<ParamTypes>();
	const dispatch = useDispatch();
	const { actions } = usePollsSlice();
  	const poll = useSelector(selectCurrentPoll)
  	const loading = useSelector(selectLoading);
  	const showVotes = useSelector(selectShowVotes);
  	const fectchingVotes = useSelector(selectFectchingVotes);
  	const screens = useBreakpoint();

	useEffect(() => {
		dispatch(actions.getPollResults({id}));
	}, [])

	const onShowVotes = () => {
		if (poll && poll.votes == undefined){
			dispatch(actions.getPollVotes(id))
		} 
		dispatch(actions.setShowVotes(true))
	}  
	
	return (
		//Col xs={24} sm={24} md={24} lg={16}
		 <Col lg={ showVotes ? 24 : 16} md={24}>
            <BackgroundWrapper>
				<Skeleton loading={loading}>
            	{
            		(poll && poll.results) &&
				(
						<Row>
							<Col lg={showVotes ? 11 : 24} md={24}>
							{poll && <PollHeader {...poll} text={t(...messages.resultsHeader())}/>}
							<Row justify="space-around" align="middle" >
								<Col span={16}>
									{
										poll.results.map((result) => (
											<PollResult 
												{...result}
												arrayToRGB={arrayToRGB} 
												colors={colors}
												optionText={poll.options[result.option]}
											/>
										))
									}
								</Col>
								<Col offset={1} span={7}>
									<ResultPieChart 
										colors={colors} 
										arrayToRGB={arrayToRGB} 
										results={poll.results} 
										options={poll.options}
									/>
								</Col>
							</Row>
							<Row justify="space-around" align="middle" >
								<Divider />
								<Col flex="auto">
									{showVotes ?
										(<Button onClick={() => dispatch(actions.setShowVotes(false))}>
											{t(...messages.hideVotes())}
										</Button>)
										:
										(<Button onClick={() => onShowVotes()}>
											{t(...messages.showVotes())}
										</Button>)
									}
								</Col>
								<Col flex="none">
									<Text strong> {t(...messages.totalVotes())} {poll.totalNDXUsed} NDX </Text>
								</Col>
							</Row>
							</Col>
							<VotesWrapper screens={screens} lg={{span:12, offset:1}} md={24}>
							{(showVotes) && 
								<Table 
									loading={fectchingVotes}
									columns={columns} 
									dataSource={poll.votes ? poll.votes.map(vote => ({
										...vote, 
										options: vote.options.map(optionIndex => poll.options[optionIndex])
									})
									):[]} 
								/>
							}
							</VotesWrapper>
						</Row>
				)
				}
				</Skeleton>
            </BackgroundWrapper>
         </Col>
	  );
	}
