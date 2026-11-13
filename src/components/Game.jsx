
import { useEffect, useState } from "react";
import useWordGame from "../hooks/useWordGame";
import Board from "./Board";
import Keyboard from "./Keyboard";
import ResultModal from "./ResultModal";

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

  const [resultDismissed, setResultDismissed] = useState(false);

  // Oyun tekrar başladığında sonuç penceresini yeniden etkinleştir
  useEffect(() => {
    if (gameStatus === "playing") {
      setResultDismissed(false);
    }
  }, [gameStatus]);

  // Fiziksel klavye desteği
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (gameStatus !== "playing") return;

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
  }, [addLetter, removeLetter, submitGuess, gameStatus]);

  const handleNewGame = () => {
    setResultDismissed(false);
    resetGame();
  };

  const gameFinished =
    gameStatus === "won" || gameStatus === "lost";

  return (
    <div className="app">
      <header className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Ana Sayfa
        </button>
        <h1>
          {mode === "daily" ? "Günlük Kelime" : "Sınırsız Mod"}
        </h1>
      </header>

      <main className="app-main">
        {message && <div className="toast">{message}</div>}

        
    <div className="game-board-layout">
      <Board
        key={answer}
        guesses={guesses}
        currentGuess={currentGuess}
        wordLength={wordLength}
        maxGuesses={maxGuesses}
        shakeRow={shakeRow}
      />
      <aside className="game-tips">
    <div className="game-tips-title">
      💡 İpucu
    </div>

    <p>
      Klavyedeki harflere <strong>sağ tıklayarak</strong>
      {" "}renklerini değiştirebilirsin.
      Telefonda harfe uzun bas!
    </p>

    <p>
      Tahmin satırlarındaki
      {" "}<strong> harflere tıklayarak</strong>
      {" "}renklerini değiştirebilirsin.
    </p>
  </aside>
</div>
   


        {gameFinished && resultDismissed && (
          <div className={`result-banner ${gameStatus}`}>
            {gameStatus === "won"
              ? "🎉 Tebrikler, bildin!"
              : `😔 Kelime: ${answer.toLocaleUpperCase("tr-TR")}`}

            {canRestart ? (
              <button
                className="reset-button"
                onClick={handleNewGame}
              >
                Yeni Oyun
              </button>
            ) : (
              <span className="daily-note">
                Yarın yeni bir kelime seni bekliyor!
              </span>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <Keyboard
          onLetter={addLetter}
          onEnter={submitGuess}
          onBackspace={removeLetter}
          confirmedAbsentLetters={confirmedAbsentLetters}
          mode={mode}
        />
      </footer>

      {gameFinished && !resultDismissed && (
        <ResultModal
          status={gameStatus}
          answer={answer}
          guessCount={guesses.length}
          onClose={() => setResultDismissed(true)}
          onPlayAgain={canRestart ? handleNewGame : undefined}
        />
      )}
    </div>
  );
}
