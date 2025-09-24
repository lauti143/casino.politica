export interface GameStats {
  gamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  biggestWin: number;
}

export interface SlotSymbol {
  id: string;
  symbol: string;
  multiplier: number;
}

export interface BlackjackCard {
  suit: string;
  value: string;
  numValue: number;
}

export interface RouletteNumber {
  number: number;
  color: 'red' | 'black' | 'green';
}