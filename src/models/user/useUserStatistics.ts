import {
  collection,
  doc,
  FirestoreDataConverter,
  query,
  where,
} from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { firestore } from '../../lib/firebase';
import { SaltongMode } from '../saltong/types';
import { FirestoreSaltongStatistics, SaltongStatistics } from './types';

export const userStatisticsConverter: FirestoreDataConverter<SaltongStatistics> =
  {
    toFirestore({ turnWins, ...data }) {
      return {
        turnWins: (turnWins as number[]).join('*'),
        ...data,
      };
    },
    fromFirestore(snap, options) {
      const { id, ref } = snap;
      const { turnWins, ...data } = snap.data(
        options
      ) as FirestoreSaltongStatistics;

      const splitTurnWinds = turnWins.split('*').map((val) => +val);

      return {
        turnWins: splitTurnWinds,
        ...data,
        id,
        ref,
      };
    },
  };

export const userStatisticDoc = (id?: string) =>
  id
    ? doc(firestore, 'gameStatistics', id).withConverter(
        userStatisticsConverter
      )
    : undefined;

export const userStatisticQuery = (uid?: string, gameMode?: SaltongMode) =>
  uid && gameMode
    ? query(
        collection(firestore, 'gameStatistics'),
        where('uid', '==', uid),
        where('type', '==', gameMode)
      ).withConverter(userStatisticsConverter)
    : undefined;

const useUserStatistics = (uid?: string, gameMode?: SaltongMode) => {
  const [userStatsList, isFetchingUserStats] = useCollectionData(
    userStatisticQuery(uid, gameMode)
  );
  const userStats = useMemo(() => userStatsList?.[0], [userStatsList]);
  const [isUpdating] = useState(false);

  const isLoading = useMemo(
    () => isFetchingUserStats || isUpdating,
    [isFetchingUserStats, isUpdating]
  );

  return {
    userStats,
    isLoading,
  };
};

export default useUserStatistics;
