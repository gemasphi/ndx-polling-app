/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import { GlobalStyle } from '../styles/global-styles';
import { selectConnectingWallet } from 'features/polls/selectors';
import { PollCreationPage } from './pages/PollCreationPage/Loadable';
import ConnectedHeader from './Header';
import { PollListPage } from './pages/PollListPage/Loadable';
import { PollPage } from './pages/PollPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Layout } from 'antd';
import {history} from 'app/history';
import { useSelector } from 'react-redux';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { useEagerConnect, useInactiveListener } from 'app/metamask'



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
            <Route component={NotFoundPage} />
          </Switch>
          )
        }
      </Layout>
      <GlobalStyle />
    </Router>
  );
}