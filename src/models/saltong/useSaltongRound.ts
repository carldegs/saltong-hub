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

// const roundCollRef = (mode: SaltongMode) =>
//   collection(firestore, getRoundCollectionName(mode)).withConverter(converter);

// const roundDocRef = (mode: SaltongMode, id: string) =>
//   doc(firestore, getRoundCollectionName(mode), id).withConverter(converter);

const useSaltongRound = (mode: SaltongMode, id: string) => {
  // const docRef = useMemo(() => roundDocRef(mode, id), [id, mode]);
  // return useDocumentData(docRef);
  return useCollectionData(
    query(
      collection(firestore, getRoundCollectionName(mode)),
      limit(1),
      where('dateId', '==', id)
    ).withConverter(converter)
  );
};

export default useSaltongRound;
