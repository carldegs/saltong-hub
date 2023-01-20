import Head from 'next/head';
import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { AccountPerks } from '../components/home/AccountPerks';
import { GameSelection } from '../components/home/GameSelection';
import { UserDashboard } from '../components/home/UserDashboard';
import { auth } from '../lib/firebase';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const hasSignedInUser = useMemo(() => user && !user.isAnonymous, [user]);

  return (
    <>
      <Head>
        <title>Saltong Hub</title>
        <meta name="description" content="The place for Filipino word games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameSelection />
      {!hasSignedInUser && !loading && <AccountPerks />}
      {(hasSignedInUser || (!hasSignedInUser && loading)) && <UserDashboard />}
    </>
  );
}
