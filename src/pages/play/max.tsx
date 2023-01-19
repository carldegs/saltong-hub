import React from 'react';

import {
  getSaltongPageLayout,
  SaltongPageContent,
} from '../../components/saltong/SaltongPageContent';
import { langServerSideProps } from '../../utils/lang';
import { NextPageWithLayout } from '../_app';

const SaltongMaxPage: NextPageWithLayout = () => (
  <SaltongPageContent mode="max" />
);

SaltongMaxPage.getLayout = getSaltongPageLayout('max');

export const getServerSideProps = langServerSideProps;

export default SaltongMaxPage;
