import { FirestoreData } from '../../lib/firebase';
import { SaltongMode } from '../saltong/types';

export interface SaltongStatistics extends FirestoreData {
  winStreak: number;
  wins: number;
  gamesPlayed: number;
  turnWins: number[];
  lastPlayedId: string;
  isLastGameSolved: boolean;
  uid: string;
  type: SaltongMode;
}

export type FirestoreSaltongStatistics = Omit<
  SaltongStatistics,
  'turnWins' | keyof FirestoreData
> & {
  turnWins: string;
};
