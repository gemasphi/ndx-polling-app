import React, { useEffect} from 'react';
import { Skeleton, Divider, Typography, Form, Button } from 'antd';
import RadioOrCheckbox from '../components/RadioOrCheckbox'
import PollHeader from '../components/PollHeader'
import { useSelector, useDispatch } from 'react-redux';
import { selectVoting, selectCurrentPoll, selectLoading, selectConnectingDB } from 'features/polls/selectors';
import { usePollsSlice } from 'features/polls';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';
import { useBoxDB} from 'app/3box'
import {ResponsiveCol, BackgroundWrapper} from 'app/components/PageWrappers';


const { Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


interface ParamTypes{
  id: string
}

export function PollVote() {
	const { id } = useParams<ParamTypes>();
	const context = useWeb3React<Web3Provider>()
  	const { library, account } = context
	const voting = useSelector(selectVoting);
	const loading = useSelector(selectLoading);
  	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const { actions } = usePollsSlice();
	const { space } = useBoxDB();
	const connectingDB = useSelector(selectConnectingDB);

	const { t } = useTranslation();

	const poll = useSelector(selectCurrentPoll);
	useEffect(() => {
    	dispatch(actions.getPoll({space, id}));
  	}, [])


	const valuesToOptions = (poll, values) => 
		values.map(value => poll.options[value]).join(", ") 

  	const buildSignMessage = (account, title, answer) => 
  		(`Account:"${account}"\n Poll: "${title}"\n Answer: "${answer}"`)

	const onFinish = (values, poll) => {
		if (library && account){
			const data = {
				wallet: account,
				options: values.vote 
			}

			const message = buildSignMessage(account, poll.title, valuesToOptions(poll, values.vote))
			library.getSigner(account)
				.signMessage(message)
				.then((signature: any) => {
	  				dispatch(actions.setPoll({id: poll.id, space, data: {...data, signature, message}}));
				})
				.catch((error: any) => {
				})
		}
  	};

	return (
		<>
		<ResponsiveCol>
            <BackgroundWrapper>
				<Skeleton loading={loading}>
				{poll &&
					(<>
					<PollHeader {...poll} noMargin text={t(...messages.voteHeader())}/>
					<Text type="secondary" style={{ fontSize: 12, marginBottom: 16}}> 
						{

							(!poll.started) ? 
								t(...messages.notStarted())
								: 
								(poll.multipleOption ? t(...messages.selectAll()) : t(...messages.selectOne()))
						} 
					</Text>
						<Form
						  {...layout}
						  form={form}
						  onFinish={(values) => onFinish(values, poll)}
						>
							<Form.Item name="vote" rules={[{ required: true, message: t(...messages.voteRule()) }]}>
								<RadioOrCheckbox 
									options={poll.options} 
									multipleChoice={poll.multipleOption}
									form={form}
									started={poll.started}
								/>
							</Form.Item>

							{
								poll.started && 
									(<>
										<Divider />
										<Form.Item >
											<Button loading={voting || connectingDB} type="primary" htmlType="submit"> 
												{connectingDB ? t(...messages.connecting3box()) : t(...messages.submitVote())}
											</Button>
							      		</Form.Item>
						      		</>)
						    }
						</Form>
					</>)
				}
				</Skeleton>
		 	</BackgroundWrapper>
         </ResponsiveCol>
		</>
	  );
	}
