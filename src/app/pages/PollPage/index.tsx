import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout, Typography} from 'antd';
import styled from 'styled-components/macro';
import { PollResults } from './PollResults';
import { PollVote } from './PollVote';
import { usePollsSlice } from 'features/polls';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectWallet,
   selectVoted, 
   selectFectchingVoted, 
   selectShowResults, 
   selectConnectingWallet 
 } from 'features/polls/selectors';
import LoadingIndicator from 'app/components/LoadingIndicator';
import {ResponsiveContent} from 'app/components/PageWrappers';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';
import { useBoxDB} from 'app/3box'

const { Content } = Layout;
const { Title } = Typography;

export const FormWrapper = styled(Content)`
  padding: 24;
  background: #fff;
`;

interface ParamTypes{
  id: string
}
const LoadingWrapper = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function PollPage() {
  const context = useWeb3React<Web3Provider>();
  const { space } = useBoxDB();
  const { account,  active } = context
  const { id } = useParams<ParamTypes>();
  const dispatch = useDispatch();
  const { actions } = usePollsSlice();
  const fetchingVoted = useSelector(selectFectchingVoted);
  const showResults = useSelector(selectShowResults);
  const wallet = useSelector(selectWallet);
  const connectingWallet = useSelector(selectConnectingWallet);
  const voted = useSelector(selectVoted);
  const [showLoading, setShowLoading] = useState<boolean | undefined>(true);

  const { t } = useTranslation();


  useEffect(() => {
    if (wallet !== undefined){
      dispatch(actions.getPollVoted({id, space, wallet: account}));
    } else {
      setShowLoading(false);
    }
  }, [wallet])

  useEffect(() => {
    if ((active || connectingWallet) && !fetchingVoted && voted === undefined){
      setShowLoading(true);
      dispatch(actions.getPollVoted({id, space, wallet: account}));
    }
  }, [active, connectingWallet])

  useEffect(() => {
    if (voted !== undefined){
      setShowLoading(false);
    }
  }, [voted])



  return (
    <>
      <Helmet>
        <title>Poll</title>
        <meta
          name="description"
          content="Page for a Specific Poll"
        />
      </Helmet>
      <ResponsiveContent>
          {showLoading ? (<>
                <LoadingWrapper>
                 <LoadingIndicator />
                </LoadingWrapper>
              </>)
            :
             (showResults ? (<>
              <Title level={2}> {t(...messages.pollResults())} </Title>
              <PollResults/> 
              </>) : 
              (<>
                <Title level={2}> {t(...messages.pollVote())} </Title>
                <PollVote />
              </>))
          }
      </ResponsiveContent>
    </>
  );
}