export const initialState = {
  rows: Array(6)
    .fill(null)
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentIndex: 0,
  answer: "NAOMI",
  currentGuess: "",
  guesses: [],
  colors: Array(6)
    .fill(null)
    .map(() => Array(5).fill("gray")),
};

function getColorClass(letter, index, answer) {
  if (letter === answer[index]) {
    return "bg-green-500";
  }
  if (answer.includes(letter)) {
    return "bg-yellow-500";
  }
  return "bg-gray-500";
}

export function reducer(state, action) {
  switch (action.type) {
    case "SET_CHAR": {
      const newRows = state.rows.map((row) => [...row]);
      const ifLastIndex =
        state.currentIndex === state.rows[state.currentRow].length - 1;
      const ifContent = newRows[state.currentRow][state.currentIndex] !== "";
      if (ifLastIndex && ifContent) {
        return state;
      }
      newRows[state.currentRow][state.currentIndex] = action.payload;

      const newCurrentGuess = newRows[state.currentRow].join("");

      const nextIndex = Math.min(
        state.currentIndex + 1,
        state.rows[state.currentRow].length - 1
      );

      return {
        ...state,
        rows: newRows,
        currentIndex: nextIndex,
        currentGuess: newCurrentGuess,
      };
    }

    case "BACKSPACE": {
      const newRows = state.rows.map((row) => [...row]);

      const ifCurrentIndexNull =
        newRows[state.currentRow][state.currentIndex] === "";

      if (ifCurrentIndexNull && state.currentIndex > 0) {
        const prevIndex = Math.max(state.currentIndex - 1, 0);
        newRows[state.currentRow][prevIndex] = "";

        const newCurrentGuess = newRows[state.currentRow].join("");

        return {
          ...state,
          rows: newRows,
          currentIndex: prevIndex,
          currentGuess: newCurrentGuess,
        };
      } else {
        newRows[state.currentRow][state.currentIndex] = "";
        const newCurrentGuess = newRows[state.currentRow].join("");

        return {
          ...state,
          rows: newRows,
          currentIndex: state.currentIndex,
          currentGuess: newCurrentGuess,
        };
      }
    }
    case "RESET_GAME": {
      return {
        ...initialState,
      };
    }
    case "SET_ANSWER":
      return {
        ...state,
        answer: action.payload,
      };

    case "MOVE_ROW": {
      const isCurrentRowFull = state.rows[state.currentRow].every(
        (cell) => cell !== ""
      );

      console.log("isCurrentRowFull:", isCurrentRowFull);
      console.log("CurrentGuess before change:", state.currentGuess);

      if (isCurrentRowFull) {
        const newGuesses = [...state.guesses, state.currentGuess];
        const newColors = state.colors.map((row, rowIndex) =>
          rowIndex === state.currentRow
            ? state.rows[state.currentRow].map((cell, cellIndex) =>
                getColorClass(cell, cellIndex, state.answer)
              )
            : row
        );

        console.log("NewGuesses:", newGuesses);
        console.log("NewColors:", newColors);

        return {
          ...state,
          currentRow: Math.min(state.currentRow + 1, state.rows.length - 1),
          currentIndex: 0,
          guesses: newGuesses,
          currentGuess: "",
          colors: newColors,
        };
      } else {
        console.log("當前行尚未填滿");
        // 不清空 currentGuess
        return state;
      }
    }

    default:
      return state;
  }
}
