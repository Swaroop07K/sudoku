
import { SudokuGrid } from '../types';

export const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

export const solveSudoku = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): { grid: SudokuGrid; solution: SudokuGrid } => {
  // Start with empty grid
  const solution: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Fill diagonal boxes first to ensure randomness
  const fillDiagonal = () => {
    for (let i = 0; i < 9; i += 3) {
      fillBox(i, i);
    }
  };

  const fillBox = (row: number, col: number) => {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!isUnusedInBox(row, col, num));
        solution[row + i][col + j] = num;
      }
    }
  };

  const isUnusedInBox = (rowStart: number, colStart: number, num: number) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (solution[rowStart + i][colStart + j] === num) return false;
      }
    }
    return true;
  };

  fillDiagonal();
  solveSudoku(solution);

  // Deep copy solution to create the puzzle
  const puzzle: SudokuGrid = solution.map(row => [...row]);

  // Remove elements based on difficulty
  let attempts = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      attempts--;
    }
  }

  return { grid: puzzle, solution };
};
