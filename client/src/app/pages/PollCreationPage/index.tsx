import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import {Grid, Layout, Menu, Typography, Col, Divider} from 'antd';
import { CreationForm } from './CreationForm';
import styled from 'styled-components/macro';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import {DefaultPageWrapper} from 'app/components/PageWrappers';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

export function PollCreationPage() {
  const context = useWeb3React<Web3Provider>();
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(...messages.title())}</title>
        <meta
          name="description"
          content="Poll Creation Page"
        />
      </Helmet>
      <DefaultPageWrapper title={t(...messages.title())}>
        {(account) ? <CreationForm /> : <Title style={{textAlign: "center"}} level={5}> {t(...messages.connectWalletToCreate())} </Title>}
      </DefaultPageWrapper>
    </>
  );
}