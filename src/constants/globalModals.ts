import { BugBeetle, HandWaving, Lifebuoy } from 'phosphor-react';
import React from 'react';

const ReportIssuesModal = React.lazy(
  () => import('../components/globalModals/ReportIssuesModal')
);
const AboutModal = React.lazy(
  () => import('../components/globalModals/AboutModal')
);
const ContributeModal = React.lazy(
  () => import('../components/globalModals/ContributeModal')
);

export const GLOBAL_MODALS_DATA = [
  {
    icon: BugBeetle,
    header: 'Report Issues',
    subheader: 'Report bugs and missing words',
    color: 'teal',
    hash: 'report',
  },
  {
    icon: HandWaving,
    header: 'About',
    subheader: 'More info about Saltong Hub',
    color: 'red',
    hash: 'about',
  },
  {
    icon: Lifebuoy,
    header: 'Contribute',
    subheader: 'Help keep the site running!',
    color: 'purple',
    hash: 'contribute',
  },
];

export const GLOBAL_MODALS = {
  report: ReportIssuesModal,
  about: AboutModal,
  contribute: ContributeModal,
  // privacy: PrivacyPolicyModal,
};
