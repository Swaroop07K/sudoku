
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellPosition {
  row: number;
  col: number;
}

export interface HintResponse {
  row: number;
  col: number;
  value: number;
  explanation: string;
}

export type SudokuGrid = (number | null)[][];
