import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { GAME_MODE_DATA } from '../constants/gameList';
import { SALTONG_DATA } from '../constants/saltong';
import { auth } from '../lib/firebase';
import { LetterData, LetterStatus, SaltongMode } from '../models/saltong/types';
import useSaltongGame from '../models/saltong/useSaltongGame';
import useSaltongRound from '../models/saltong/useSaltongRound';
import useUserStatistics from '../models/user/useUserStatistics';
import { checkIfGameOver, checkIfSolved } from '../utils/saltong';
import useDictionary from './useDictionary';

export const checkAnswer = (word: string, solution: string): LetterData[] => {
  const splitAnswer = word.toLowerCase().split('');

  let result: LetterData[] = splitAnswer.map((letter) => [
    letter,
    LetterStatus.wrong,
  ]);

  let checklist = solution
    .toLowerCase()
    .split('')
    .map((letter) => [letter, false]);

  result = result.map(([rLetter, rStatus], i) => {
    if (rLetter === checklist[i][0] && !checklist[i][1]) {
      checklist = Object.assign([], checklist, {
        [i]: [checklist[i], true],
      });
      return [rLetter, LetterStatus.correct];
    }

    return [rLetter, rStatus];
  });

  result = result.map(([rLetter, rStatus]) => {
    if (rStatus !== LetterStatus.correct) {
      const matchIdx = checklist.findIndex(
        ([cLetter, cUsed]) => !cUsed && cLetter === rLetter
      );

      if (matchIdx >= 0) {
        checklist = Object.assign([], checklist, {
          [matchIdx]: [checklist[matchIdx], true],
        });
        return [rLetter, LetterStatus.wrongSpot];
      }
    }

    return [rLetter, rStatus];
  });

  return result;
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export const getLetterListStatus = (history: LetterData[][]) => {
  const letters = history.flat().reduce((curr, prev) => {
    const [key, status] = prev;

    return {
      ...curr,
      [key]: status > curr[key] ? status : curr[key],
    };
  }, Object.fromEntries(LETTERS.split('').map((letter) => [letter, LetterStatus.none])) as Record<string, LetterStatus>);

  return letters;
};

export const useSaltong = (mode: SaltongMode, dateId?: string) => {
  const { wordLen, maxTurns } = useMemo(() => SALTONG_DATA[mode], [mode]);
  const [rData, isFetchingRoundData, roundDataError] = useSaltongRound(
    mode,
    dateId
  );
  const [user] = useAuthState(auth);
  const { userStats, isLoading: isFetchingStats } = useUserStatistics(
    user?.uid,
    mode
  );
  const roundData = useMemo(() => rData?.[0], [rData]);
  const [history, setHistory] = useState<LetterData[][]>([]);
  const [inputValue, setInputValue] = useState('');
  const {
    gameData,
    updateGame,
    isLoading: isFirebaseLoading,
  } = useSaltongGame(mode, dateId, !user?.isAnonymous ? user?.uid : undefined);
  // TODO: Handle unauthorized users
  // const { history = [] } = gameData || {};
  const letterListStatus = useMemo(
    () => getLetterListStatus(history),
    [history]
  );

  useEffect(() => {
    if (!history?.length && gameData?.history?.length) {
      setHistory(gameData.history);
    }
  }, [gameData?.history, gameData?.history?.length, history?.length]);

  useEffect(() => {
    setHistory([]);
  }, [dateId]);

  const [dictionary, isFetchingDictionary] = useDictionary();

  const turn = useMemo(() => history.length, [history.length]);
  const isLoading = useMemo(
    () => isFetchingRoundData || isFetchingStats,
    [isFetchingRoundData, isFetchingStats]
  );
  const isLoadingBackground = useMemo(
    () => isFetchingDictionary || isFirebaseLoading,
    [isFetchingDictionary, isFirebaseLoading]
  );
  const error = useMemo(() => roundDataError, [roundDataError]);

  const solveWord = useCallback(() => {
    if (turn >= maxTurns) {
      throw new Error('Max turns played');
    }

    if (!roundData?.word) {
      throw new Error('Cannot get round data');
    }

    if (inputValue.length !== wordLen) {
      throw new Error(`Word must be ${wordLen} letters`);
    }

    if (isFetchingDictionary) {
      throw new Error('Still fetching dictionary');
    }

    if (
      !dictionary[wordLen]?.find(
        (item) => item.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      throw new Error('Not in word list');
    }

    const resp = checkAnswer(inputValue, roundData.word);

    const newHistory = [...history, resp];
    setInputValue('');
    setHistory(newHistory);
    updateGame(newHistory, userStats?.id);

    return {
      isSolved: checkIfSolved(newHistory),
      isGameOver: checkIfGameOver(newHistory, mode),
    };
  }, [
    dictionary,
    history,
    inputValue,
    isFetchingDictionary,
    maxTurns,
    mode,
    roundData?.word,
    turn,
    updateGame,
    userStats?.id,
    wordLen,
  ]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(
        value
          .replace(/[^a-zA-Z]/gi, '')
          .toLowerCase()
          .substring(0, wordLen)
      );
    },
    [wordLen]
  );

  const data = useMemo(
    () => ({
      wordLen,
      maxTurns,
      turn,
      isLoading,
      roundData,
      gameModeData: GAME_MODE_DATA[mode],
      inputValue,
      error,
      solveWord,
      handleInputChange,
      history,
      letterListStatus,
      isLoadingBackground,
      gameData,
      userStats,
      isSolved: checkIfSolved(history),
      isGameOver: checkIfGameOver(history, mode),
    }),
    [
      error,
      gameData,
      handleInputChange,
      history,
      inputValue,
      isLoading,
      isLoadingBackground,
      letterListStatus,
      maxTurns,
      mode,
      roundData,
      solveWord,
      turn,
      userStats,
      wordLen,
    ]
  );

  return data;
};
