import { useEffect } from "react";
import useWordGame from "../hooks/useWordGame";
import Board from "./Board";
import Keyboard from "./Keyboard";

const TURKISH_LETTER_REGEX = /^[a-zçğıöşü]$/i;

export default function Game({ mode, onBack }) {
  const {
    guesses,
    currentGuess,
    gameStatus,
    message,
    confirmedAbsentLetters,
    shakeRow,
    wordLength,
    maxGuesses,
    answer,
    canRestart,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
  } = useWordGame(mode);

  // Fiziksel klavye desteği
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Enter") {
        submitGuess();
      } else if (e.key === "Backspace") {
        removeLetter();
      } else if (TURKISH_LETTER_REGEX.test(e.key)) {
        addLetter(e.key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addLetter, removeLetter, submitGuess]);

  return (
    <div className="app">
      <header className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Ana Sayfa
        </button>
        <h1>{mode === "daily" ? "Günlük Kelime" : "Sınırsız Mod"}</h1>
      </header>

      <main className="app-main">
        {message && <div className="toast">{message}</div>}

        {gameStatus !== "playing" && (
          <div className={`result-banner ${gameStatus}`}>
            {gameStatus === "won"
              ? "🎉 Tebrikler, bildin!"
              : `😔 Kaybettin. Kelime: ${answer.toLocaleUpperCase("tr-TR")}`}

            {canRestart ? (
              <button className="reset-button" onClick={resetGame}>
                Yeni Oyun
              </button>
            ) : (
              <span className="daily-note">Yarın yeni bir kelime seni bekliyor!</span>
            )}
          </div>
        )}

        <Board
          key={answer}
          guesses={guesses}
          currentGuess={currentGuess}
          wordLength={wordLength}
          maxGuesses={maxGuesses}
          shakeRow={shakeRow}
        />
      </main>

      <footer className="app-footer">
        <Keyboard
          onLetter={addLetter}
          onEnter={submitGuess}
          onBackspace={removeLetter}
          confirmedAbsentLetters={confirmedAbsentLetters}
        />
      </footer>
    </div>
  );
}
