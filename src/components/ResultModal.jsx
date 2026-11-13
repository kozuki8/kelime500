
export default function ResultModal({
  status,
  answer,
  guessCount,
  onClose,
  onPlayAgain,
}) {
  if (status !== "won" && status !== "lost") {
    return null;
  }

  const won = status === "won";

  return (
    <div className="result-overlay">
      <div
        className="result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <div className="result-icon">
          {won ? "🏆" : "💡"}
        </div>

        <h2
          id="result-title"
          className={won ? "result-win" : "result-lose"}
        >
          {won ? "Tebrikler!" : "Oyun Bitti!"}
        </h2>

        <p className="result-message">
          {won
            ? "Kelimeyi doğru tahmin ettin!"
            : "Bu sefer kelimeyi bulamadın."}
        </p>

        <div className="result-answer-box">
          <span>Doğru kelime</span>
          <strong>
            {answer?.toLocaleUpperCase("tr-TR")}
          </strong>
        </div>

        {won && (
          <p className="result-count">
            {guessCount} tahminde bildin!
          </p>
        )}

        <div className="result-buttons">
          {onPlayAgain && (
            <button
              className="result-again-button"
              onClick={onPlayAgain}
            >
              Yeniden Oyna
            </button>
          )}

          <button
            className="result-close-button"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
