import React, { useReducer, useEffect } from "react";

const initialState = {
  cells: ["", "", "", "", ""],
  currentIndex: 0, 
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CHAR": {
      const newCells = [...state.cells];
      if (
        state.currentIndex === state.cells.length - 1 &&
        newCells[state.currentIndex] !== ""
      ) {
        return state;
      }
      newCells[state.currentIndex] = action.payload;

      // 計算下一個索引位置
      const nextIndex = Math.min(
        state.currentIndex + 1,
        state.cells.length - 1
      );

      return {
        ...state,
        cells: newCells,
        currentIndex: nextIndex,
      };
    }

    case "BACKSPACE": {
      const newCells = [...state.cells];

      if (newCells[state.currentIndex] === "" && state.currentIndex > 0) {
        const prevIndex = Math.max(state.currentIndex - 1, 0);
        newCells[prevIndex] = ""; 

        return {
          ...state,
          cells: newCells,
          currentIndex: prevIndex,
        };
      } else {
        newCells[state.currentIndex] = "";

        return {
          ...state,
          cells: newCells,
          currentIndex: state.currentIndex,
        };
      }
    }
    default:
      return state;
  }
}

//畫面功能

function WorldGrid() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        dispatch({ type: "BACKSPACE" });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        dispatch({ type: "SET_CHAR", payload: e.key.toUpperCase() });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex space-x-1">
          {state.cells.map((cell, index) => (
            <div
              key={index}
              className="w-12 h-12 border border-gray-300 flex items-center justify-center text-lg font-semibold"
            >
              {cell}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WorldGrid;
