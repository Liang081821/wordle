import { useReducer, useEffect } from "react";
import { initialState, reducer } from "./wordleReducer";
import fetchAnswer from "./fireBase";

function WordleGrid() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        dispatch({ type: "SET_CHAR", payload: e.key.toUpperCase() });
      } else if (e.key === "Enter") {
        dispatch({ type: "MOVE_ROW" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    console.log("3");
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const initializeAnswer = async () => {
      try {
        const randomAnswer = await fetchAnswer();
        dispatch({ type: "SET_ANSWER", payload: randomAnswer });
      } catch (error) {
        console.error("Error fetching answer: ", error);
      }
    };
    initializeAnswer();
  }, []);

  useEffect(() => {
  const lastGuess = state.guesses[state.guesses.length - 1];

  const handleGameEnd = async () => {
    if (lastGuess === state.answer && state.guesses.length > 0) {
      const timer = setTimeout(async () => {
        alert("你成功了");
        dispatch({ type: "RESET_GAME" });
        try {
          const randomAnswer = await fetchAnswer();
          dispatch({ type: "SET_ANSWER", payload: randomAnswer });
        } catch (error) {
          console.error("獲取答案失敗", error);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (state.guesses.length === 6) {
      const timer = setTimeout(async () => {
        alert("你失敗了");
        dispatch({ type: "RESET_GAME" });
        try {
          const randomAnswer = await fetchAnswer();
          dispatch({ type: "SET_ANSWER", payload: randomAnswer });
        } catch (error) {
          console.error("獲取答案失敗", error);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  };

  handleGameEnd();
}, [state.currentGuess, state.guesses, state.answer]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {state.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-1 mb-1">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-12 h-12 border border-gray-300  flex items-center justify-center text-lg font-semibold ${state.colors[rowIndex][cellIndex]}`}
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
