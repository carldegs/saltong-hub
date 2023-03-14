import { SALTONG_DATA } from '../constants/saltong';
import { LetterData, LetterStatus, SaltongMode } from '../models/saltong/types';

export const checkIfSolved = (history: LetterData[][]) =>
  !history.at(-1)?.some(([, status]) => status !== LetterStatus.correct) &&
  history.length > 0;

export const checkIfGameOver = (history: LetterData[][], mode: SaltongMode) =>
  history.length === SALTONG_DATA[mode].maxTurns;
