/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { format } from 'date-fns';
import {
  collection,
  doc,
  FirestoreDataConverter,
  runTransaction,
} from 'firebase/firestore';
import chunk from 'lodash/chunk';
import { useCallback, useMemo, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { SALTONG_DATA } from '../../constants/saltong';
import { firestore, FirestoreData } from '../../lib/firebase';
import { checkIfGameOver, checkIfSolved } from '../../utils/saltong';
import { getPhTime, getYesterdayDateId } from '../../utils/time';
import { SaltongStatistics } from '../user/types';
import {
  userStatisticDoc,
  userStatisticsConverter,
} from '../user/useUserStatistics';
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

  // TODO: Handle endDate, isStartedFromArchive and isSolvedFromArchive
  const updateGame = useCallback(
    async (history: LetterData[][], userStatisticId?: string) => {
      setIsUpdating(true);

      const gameRef = saltongGameDoc(mode, dateId, uid);
      const userStatRef = (
        userStatisticId
          ? userStatisticDoc(userStatisticId)!
          : doc(collection(firestore, 'gameStatistics'))
      ).withConverter(userStatisticsConverter);

      if (!gameRef || !uid || !dateId) {
        return;
      }

      await runTransaction(firestore, async (transaction) => {
        const gameSnap = await transaction.get(gameRef);
        const userStatSnap = await transaction.get<SaltongStatistics>(
          userStatRef as any
        );

        const isSolved = checkIfSolved(history);
        const isGameOver = checkIfGameOver(history, mode);

        const todayDateId = format(getPhTime(), 'yyyy-MM-dd');
        const isCurrGame = dateId === todayDateId;

        if (!gameSnap.exists()) {
          transaction.set(gameRef, {
            uid,
            dateId,
            history,
            startDate: new Date().getTime(),
            isSolved,
            solvedOnTime: isSolved && isCurrGame,
            ...(isSolved || isGameOver
              ? { endDate: new Date().getTime() }
              : {}),
          });
        } else {
          transaction.set(
            gameRef,
            {
              history,
              isSolved,
              ...(isSolved || isGameOver
                ? { endDate: new Date().getTime() }
                : {}),
            },
            { merge: true }
          );
        }

        if (isSolved || isGameOver) {
          if (!userStatSnap.exists()) {
            transaction.set<Omit<SaltongStatistics, keyof FirestoreData>>(
              userStatRef,
              {
                wins: +isSolved,
                gamesPlayed: 1,
                turnWins: [...Array(SALTONG_DATA[mode].wordLen).keys()].map(
                  (i) => (isSolved && i === history?.length - 1 ? 1 : 0)
                ),
                lastPlayedId: isCurrGame ? dateId : '',
                isLastGameSolved: isCurrGame && isSolved,
                winStreak: +(isCurrGame && isSolved),
                uid,
                type: mode,
              }
            );
          } else {
            const stat = userStatSnap.data();
            const turnWins = isSolved
              ? stat.turnWins.map((numWins, i) =>
                  i + 1 === history.length ? numWins + 1 : numWins
                )
              : stat.turnWins;

            let winStreak = stat.winStreak;

            if (isCurrGame) {
              const yesterdayDateId = getYesterdayDateId(todayDateId);
              const isLastGamePlayedYesterday =
                yesterdayDateId === stat.lastPlayedId;

              if (
                isSolved &&
                isLastGamePlayedYesterday &&
                stat.isLastGameSolved
              ) {
                winStreak += 1;
              } else {
                winStreak = 0;
              }
            }

            transaction.set(
              userStatRef,
              {
                wins: stat.wins + +isSolved,
                gamesPlayed: stat.gamesPlayed + 1,
                turnWins,
                lastPlayedId: isCurrGame ? dateId : stat.lastPlayedId,
                isLastGameSolved: isCurrGame ? isSolved : stat.isLastGameSolved,
                winStreak,
              },
              {
                merge: true,
              }
            );
          }
        }
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
