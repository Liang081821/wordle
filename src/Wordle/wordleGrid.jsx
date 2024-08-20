import React, { useReducer, useEffect } from "react";
import { initialState, reducer } from "./wordleReducer";

function WordleGrid() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        dispatch({ type: "SET_CHAR", payload: e.key.toUpperCase() });
      } else if (e.key === "Enter") {
        const isCurrentRowFull = state.rows[state.currentRow].every(
          (cell) => cell !== ""
        );

        if (isCurrentRowFull) {
          dispatch({ type: "MOVE_ROW" });
        } else {
          console.log("當前行尚未填滿");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);

  useEffect(() => {
    const lastGuess = state.guesses[state.guesses.length - 1];
    if (lastGuess === state.answer && state.guesses.length > 0) {
      const timer = setTimeout(() => {
        alert("你成功了");
        dispatch({ type: "RESET_GAME" });
      }, 100);
      return () => clearTimeout(timer);
    } else if (state.guesses.length === 6) {
      const timer = setTimeout(() => {
        alert("你失敗了");
        dispatch({ type: "RESET_GAME" });
      }, 100);
    }
  }, [state.currentGuess, state.guesses, state.answer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {state.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1 mb-1">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-12 h-12 border border-gray-300 flex items-center justify-center text-lg font-semibold ${state.colors[rowIndex][cellIndex]}`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default WordleGrid;

