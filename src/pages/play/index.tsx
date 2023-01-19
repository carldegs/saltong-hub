import React from 'react';

import {
  getSaltongPageLayout,
  SaltongPageContent,
} from '../../components/saltong/SaltongPageContent';
import { langServerSideProps } from '../../utils/lang';
import { NextPageWithLayout } from '../_app';

const SaltongPage: NextPageWithLayout = () => (
  <SaltongPageContent mode="main" />
);

SaltongPage.getLayout = getSaltongPageLayout('main');

export const getServerSideProps = langServerSideProps;

export default SaltongPage;
