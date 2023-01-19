import React from 'react';

import {
  getSaltongPageLayout,
  SaltongPageContent,
} from '../../components/saltong/SaltongPageContent';
import { langServerSideProps } from '../../utils/lang';
import { NextPageWithLayout } from '../_app';

const SaltongMiniPage: NextPageWithLayout = () => (
  <SaltongPageContent mode="mini" />
);

SaltongMiniPage.getLayout = getSaltongPageLayout('mini');

export const getServerSideProps = langServerSideProps;

export default SaltongMiniPage;
