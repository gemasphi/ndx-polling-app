import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography } from 'antd';
import { DefaultPageWrapper } from 'app/components/PageWrappers';
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';

const { Title } = Typography;

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(...messages.notFoundTitle())}</title>
        <meta
          name="description"
          content="Page Not Found"
        />
      </Helmet>
      <DefaultPageWrapper title={t(...messages.notFoundTitle())}>
        <Title style={{textAlign: "center"}} level={5}> {t(...messages.notDescTitle())}</Title>
      </DefaultPageWrapper>
    </>
  );
}