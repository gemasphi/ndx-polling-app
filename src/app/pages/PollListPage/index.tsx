import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from 'antd';
import { PollList } from './PollList';
import styled from 'styled-components/macro';
import {DefaultPageWrapper} from 'app/components/PageWrappers';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';

const { Content } = Layout;

export const FormWrapper = styled(Content)`
  padding: 24;
  background: #fff;
`;

export function PollListPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t(...messages.pollListTitle())}</title>
        <meta
          name="description"
          content="Poll List Page"
        />
      </Helmet>
      <DefaultPageWrapper title={t(...messages.pollListTitle())}>
        <PollList />
      </DefaultPageWrapper>
    </>
  );
}