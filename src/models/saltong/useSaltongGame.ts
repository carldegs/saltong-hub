import {
  doc,
  FirestoreDataConverter,
  runTransaction,
} from 'firebase/firestore';
import chunk from 'lodash/chunk';
import { useCallback, useMemo, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { SALTONG_DATA } from '../../constants/saltong';
import { firestore, FirestoreData } from '../../lib/firebase';
import {
  FirestoreSaltongGame,
  LetterData,
  LetterStatus,
  SaltongGame,
  SaltongMode,
} from './types';

export const getGameCollectionName = (mode: SaltongMode) =>
  `saltong${mode.charAt(0).toUpperCase() + mode.slice(1)}Games`;

const getSaltongModeFromCollectionName = (colName: string) => {
  return colName
    .replace('saltong', '')
    .replace('Games', '')
    .toLowerCase() as SaltongMode;
};

export const saltongGameConverter: FirestoreDataConverter<
  Omit<SaltongGame, keyof FirestoreData>
> = {
  toFirestore({ history, ...data }) {
    return {
      history: (history as LetterData[][])
        .flat(2)
        .map((v) =>
          v === LetterStatus.none ? '#' : v === LetterStatus.wrong ? '*' : v
        )
        .join(''),
      ...data,
    };
  },
  fromFirestore(snap, options) {
    const { id, ref } = snap;
    const { history, ...data } = snap.data(options) as FirestoreSaltongGame;

    const mode = getSaltongModeFromCollectionName(ref.parent.path);

    const splitHistory = history.split('').map((v) => {
      if (isNaN(+v)) {
        if (v === '*') {
          return LetterStatus.wrong;
        }

        if (v === '#') {
          return LetterStatus.none;
        }

        return v;
      } else {
        return +v as LetterStatus;
      }
    });

    return {
      history: chunk(
        chunk(splitHistory, 2) as LetterData[],
        SALTONG_DATA[mode].wordLen
      ),
      ...data,
      id,
      ref,
    };
  },
};

export const saltongGameDoc = (
  mode: SaltongMode,
  dateId?: string,
  uid?: string
) =>
  mode && dateId && uid
    ? doc(
        firestore,
        getGameCollectionName(mode),
        `${uid}*${dateId}`
      ).withConverter(saltongGameConverter)
    : undefined;

const useSaltongGame = (mode: SaltongMode, dateId?: string, uid?: string) => {
  const [gameData, isFetchingGameData] = useDocumentData(
    saltongGameDoc(mode, dateId, uid)
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const isLoading = useMemo(
    () => isFetchingGameData || isUpdating,
    [isFetchingGameData, isUpdating]
  );

  // TODO: Handle solveDate, isStartedFromArchive and isSolvedFromArchive
  const updateGame = useCallback(
    async (history: LetterData[][]) => {
      setIsUpdating(true);

      const gameRef = saltongGameDoc(mode, dateId, uid);

      if (!gameRef || !uid || !dateId) {
        return;
      }

      await runTransaction(firestore, async (transaction) => {
        const gameSnap = await transaction.get(gameRef);

        const isSolved = !history
          .at(-1)
          ?.some(([, status]) => status !== LetterStatus.correct);

        if (!gameSnap.exists()) {
          transaction.set(gameRef, {
            uid,
            dateId,
            history,
            startDate: new Date().getTime(),
            isSolved,
          });
          // TODO: Update userData.mode.lastPlayedId and isLastGameSolved
          return;
        }

        transaction.set(
          gameRef,
          {
            history,
            isSolved,
          },
          { merge: true }
        );

        // TODO: If isSolved, update userdata statistics
      });

      setIsUpdating(false);
    },
    [dateId, mode, uid]
  );

  return {
    gameData,
    isLoading,
    updateGame,
    isUpdating,
  };
};

export default useSaltongGame;
