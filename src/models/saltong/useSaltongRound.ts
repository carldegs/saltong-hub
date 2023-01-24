import {
  FirestoreDataConverter,
  query,
  collection,
  where,
  limit,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { firestore, FirestoreData } from '../../lib/firebase';
import { SaltongMode } from './types';

export interface SaltongRound extends FirestoreData {
  roundNum: number;
  word: string;
}

const converter: FirestoreDataConverter<SaltongRound> = {
  toFirestore({ roundNum, word }) {
    return {
      roundNum,
      word,
    };
  },
  fromFirestore(snap, options) {
    const { id, ref } = snap;
    const data = snap.data(options);
    return {
      ...(data as Omit<SaltongRound, keyof FirestoreData>),
      id,
      ref,
    };
  },
};

const getRoundCollectionName = (mode: SaltongMode) =>
  `saltong${mode.charAt(0).toUpperCase() + mode.slice(1)}Rounds`;

const useSaltongRound = (mode: SaltongMode, id?: string) =>
  useCollectionData(
    mode && id
      ? query(
          collection(firestore, getRoundCollectionName(mode)),
          limit(1),
          where('dateId', '==', id)
        ).withConverter(converter)
      : undefined
  );

export default useSaltongRound;
