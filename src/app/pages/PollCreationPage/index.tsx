import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography} from 'antd';
import { CreationForm } from './CreationForm';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { DefaultPageWrapper } from 'app/components/PageWrappers';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';

const { Title } = Typography;

export function PollCreationPage() {
  const context = useWeb3React<Web3Provider>();
  const { account } = context
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