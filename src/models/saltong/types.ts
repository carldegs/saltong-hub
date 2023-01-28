import { FirestoreData } from '../../lib/firebase';

export interface SaltongRound extends FirestoreData {
  roundNum: number;
  word: string;
  dateId: string;
}

export type SaltongMode = 'mini' | 'max' | 'main';

export enum LetterStatus {
  none = -2,
  wrong,
  wrongSpot,
  correct,
}

export type LetterData = [string, LetterStatus];

export interface SaltongGame extends FirestoreData {
  uid: string;
  dateId: string;
  history: LetterData[][];
  startDate: number;
  solveDate?: number;
  isSolved: boolean;
}

export type FirestoreSaltongGame = Omit<
  SaltongGame,
  'history' | keyof FirestoreData
> & {
  history: string;
};
