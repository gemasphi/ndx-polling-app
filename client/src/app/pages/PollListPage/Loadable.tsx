/**
 * Asynchronously loads the component for PollCreationPage
 */

import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styled from 'styled-components/macro';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PollListPage = lazyLoad(
  () => import('./index'),
  module => module.PollListPage,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
