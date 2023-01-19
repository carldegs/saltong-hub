import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { GAME_MODE_DATA } from '../constants/gameList';
import { SALTONG_DATA } from '../constants/saltong';
import { LetterData, LetterStatus, SaltongMode } from '../models/saltong/types';
import useSaltongRound from '../models/saltong/useSaltongRound';
import { getPhTime } from '../utils/time';

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

export const useSaltong = (
  mode: SaltongMode,
  dateId = format(getPhTime(), 'yyyy-MM-dd')
) => {
  const { wordLen, maxTurns } = useMemo(() => SALTONG_DATA[mode], [mode]);
  const [rData, isFetchingRoundData, roundDataError] = useSaltongRound(
    mode,
    dateId
  );
  const roundData = useMemo(() => rData?.[0], [rData]);
  const [history, setHistory] = useState<LetterData[][]>([]);
  const [inputValue, setInputValue] = useState('');
  const letterListStatus = useMemo(
    () => getLetterListStatus(history),
    [history]
  );

  const turn = useMemo(() => history.length, [history.length]);
  const isLoading = useMemo(() => isFetchingRoundData, [isFetchingRoundData]);
  const error = useMemo(() => roundDataError, [roundDataError]);

  const solveWord = useCallback(() => {
    if (turn >= maxTurns) {
      console.error('Max turns played');
      return;
    }

    if (!roundData?.word) {
      console.error('Cannot get round data');
      return;
    }

    if (inputValue.length !== wordLen) {
      console.error(`Word must be ${wordLen} letters`);
      return;
    }

    const resp = checkAnswer(inputValue, roundData.word);

    setHistory((h) => [...h, resp]);
    setInputValue('');
  }, [inputValue, maxTurns, roundData?.word, turn, wordLen]);

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
    }),
    [
      error,
      handleInputChange,
      history,
      inputValue,
      isLoading,
      letterListStatus,
      maxTurns,
      mode,
      roundData,
      solveWord,
      turn,
      wordLen,
    ]
  );

  return data;
};
