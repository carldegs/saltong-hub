export interface SaltongStatistics {
  winStreak: number;
  wins: number;
  turnWins: number[];
  lastPlayedId: string;
  isLastGameSolved: boolean;
}

export interface UserData {
  uid: string;
  saltongMainStats: SaltongStatistics;
  saltongMaxStats: SaltongStatistics;
  saltongMiniStats: SaltongStatistics;
}
