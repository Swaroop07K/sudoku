
import React, { useState, useEffect, useCallback } from 'react';
import { SudokuGrid, CellPosition, Difficulty, HintResponse } from './types';
import { generatePuzzle, isValid } from './utils/sudokuLogic';
import { getGeminiHint } from './services/geminiService';

const App: React.FC = () => {
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([]);
  const [solution, setSolution] = useState<SudokuGrid>([]);
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [loadingHint, setLoadingHint] = useState(false);
  const [hint, setHint] = useState<HintResponse | null>(null);
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const puzzle = generatePuzzle(diff);
    setGrid(puzzle.grid.map(row => [...row]));
    setInitialGrid(puzzle.grid.map(row => [...row]));
    setSolution(puzzle.solution);
    setSelected(null);
    setHint(null);
    setGameWon(false);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] === null) {
      setSelected({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selected || gameWon) return;
    const { row, col } = selected;
    
    const newGrid = [...grid.map(r => [...r])];
    newGrid[row][col] = num;
    setGrid(newGrid);

    // Check win condition
    const isComplete = newGrid.every((r, ri) => 
      r.every((cell, ci) => cell === solution[ri][ci])
    );
    if (isComplete) setGameWon(true);
  };

  const requestHint = async () => {
    setLoadingHint(true);
    setHint(null);
    try {
      const result = await getGeminiHint(grid);
      setHint(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHint(false);
    }
  };

  const isError = (row: number, col: number) => {
    const val = grid[row][col];
    if (val === null || initialGrid[row][col] !== null) return false;
    
    // Check if it matches solution
    return val !== solution[row][col];
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Sudoku AI</h1>
        <p className="text-slate-500 font-medium">Minimal design, Maximum intelligence</p>
      </header>

      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-200">
        <div className="grid grid-cols-9 aspect-square border-4 border-slate-800">
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => {
              const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
              const isInitial = initialGrid[rowIndex][colIndex] !== null;
              const hasError = isError(rowIndex, colIndex);
              const isHinted = hint?.row === rowIndex && hint?.col === colIndex;

              let cellClasses = "flex items-center justify-center text-xl font-bold cursor-pointer transition-colors border select-none h-full ";
              
              // Borders for 3x3 grid logic
              if (colIndex % 3 === 2 && colIndex !== 8) cellClasses += "border-r-4 border-r-slate-800 ";
              else cellClasses += "border-slate-200 ";
              
              if (rowIndex % 3 === 2 && rowIndex !== 8) cellClasses += "border-b-4 border-b-slate-800 ";

              if (isInitial) cellClasses += "text-slate-800 bg-slate-50 ";
              else cellClasses += "text-blue-600 bg-white ";

              if (isSelected) cellClasses += "bg-blue-100 ring-2 ring-blue-400 z-10 ";
              if (hasError) cellClasses += "bg-red-50 text-red-600 ";
              if (isHinted) cellClasses += "bg-yellow-100 ring-2 ring-yellow-400 z-10 ";

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cellClasses}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== null ? cell : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* Controls */}
        <div className="grid grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="aspect-square flex items-center justify-center bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 active:scale-95 transition-all shadow-md"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => startNewGame()} 
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition shadow-lg active:scale-95"
          >
            New Game
          </button>
          
          <select 
            value={difficulty} 
            onChange={(e) => {
              const d = e.target.value as Difficulty;
              setDifficulty(d);
              startNewGame(d);
            }}
            className="px-4 py-2 bg-white border border-slate-300 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button 
            onClick={requestHint}
            disabled={loadingHint || gameWon}
            className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingHint ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : "💡 Get AI Hint"}
          </button>
        </div>

        {hint && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm animate-fade-in">
            <h3 className="text-yellow-800 font-bold flex items-center gap-2">
              <span>🧠 AI Hint:</span>
            </h3>
            <p className="text-yellow-700">{hint.explanation}</p>
          </div>
        )}

        {gameWon && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-bounce text-center font-bold">
            🎉 Congratulations! You solved the puzzle!
          </div>
        )}
      </div>

      <footer className="mt-12 text-slate-400 text-sm">
        Click a cell to select, then click a number below.
      </footer>
    </div>
  );
};

export default App;
