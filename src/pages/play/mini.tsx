import React from 'react';

import {
  getSaltongPageLayout,
  SaltongPageContent,
} from '../../components/saltong/SaltongPageContent';
import { NextPageWithLayout } from '../_app';

const SaltongMiniPage: NextPageWithLayout = () => (
  <SaltongPageContent mode="mini" />
);

SaltongMiniPage.getLayout = getSaltongPageLayout('mini');

export default SaltongMiniPage;
