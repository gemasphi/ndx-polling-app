/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, Router, Link, Redirect } from 'react-router-dom';

import { GlobalStyle } from '../styles/global-styles';

import { PollCreationPage } from './pages/PollCreationPage/Loadable';
import ConnectedHeader from './Header';
import { PollListPage } from './pages/PollListPage/Loadable';
import { PollPage } from './pages/PollPage/Loadable';
import styled from 'styled-components/macro';

//import { Signin } from './pages/Signin/Loadable';
import { useTranslation } from 'react-i18next';
import { Layout, Menu, Typography, Col} from 'antd';
import {history} from 'app/history';
import { useSelector, useDispatch } from 'react-redux';
import { usePollsSlice } from 'features/polls';
import { selectConnectingWallet } from 'features/polls/selectors';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { useEagerConnect, useInactiveListener, injected } from 'app/metamask'


const { Header, Footer, Sider, Content } = Layout;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;


export function App() {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager)
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = usePollsSlice();
  const connectingHeader = useSelector(selectConnectingWallet);

  return (
    <Router history={history}>
      <Helmet
        titleTemplate="%s"
        defaultTitle="NDX Polling"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="NDX Polling Website" />
      </Helmet>
      <Layout style={{ minHeight: '100vh' }}>
        <ConnectedHeader/>
        {(connectingHeader) ?   (<LoadingWrapper>
                 <LoadingIndicator />
                </LoadingWrapper>) : (
          <Switch>
            <Route
              exact
              path="/"
              render={() =>  <Redirect to={process.env.PUBLIC_URL + '/poll-create'} />}
            />
            <Route 
              exact 
              path={process.env.PUBLIC_URL + '/poll-create'} 
              component={PollCreationPage} 
            />
            <Route 
              exact 
              path={process.env.PUBLIC_URL + '/poll-list'} 
              component={PollListPage} 
            />
            <Route 
              path={process.env.PUBLIC_URL + '/poll/:id'} 
              component={PollPage} 
            />
          </Switch>
          )
        }
      </Layout>
      <GlobalStyle />
    </Router>
  );
}
/*
         
          <Route 
            path={process.env.PUBLIC_URL + '/signin'} 
            component={Signin} 
          />
*/