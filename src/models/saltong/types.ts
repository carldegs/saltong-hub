export interface SaltongRound {
  gameId: number;
  word: string;
}

export interface SaltongGame {
  roundId: string;
  userId: string;
}

export type SaltongMode = 'mini' | 'max' | 'main';

export enum LetterStatus {
  none = -2,
  wrong,
  wrongSpot,
  correct,
}

export type LetterData = [string, LetterStatus];
