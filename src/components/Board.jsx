import { useState } from "react";
import Tile from "./Tile";

// Tıklama sırası: işaretsiz -> kırmızı -> sarı -> yeşil -> işaretsiz
const CYCLE = [undefined, "absent", "present", "correct"];

function nextStatus(current) {
  const idx = CYCLE.indexOf(current);
  return CYCLE[(idx + 1) % CYCLE.length];
}

// Bir satırdaki gerçek yeşil/sarı/kırmızı harf sayısını hesaplar (oyunun verdiği gerçek sonuç)
function countStatuses(result) {
  const counts = { correct: 0, present: 0, absent: 0 };
  if (result) {
    result.forEach((status) => {
      counts[status] += 1;
    });
  }
  return counts;
}

function RowCounter({ result }) {
  const { correct, present, absent } = countStatuses(result);
  return (
    <div className="row-counter">
      <span className="counter-box correct">{correct}</span>
      <span className="counter-box present">{present}</span>
      <span className="counter-box absent">{absent}</span>
    </div>
  );
}

export default function Board({ guesses, currentGuess, wordLength, maxGuesses, shakeRow }) {
  // Oyuncunun kendi eliyle işaretlediği harf renkleri: { "satırIndex-harfIndex": "absent"|"present"|"correct" }
  const [manualMarks, setManualMarks] = useState({});

  const handleTileClick = (rowIndex, letterIndex) => {
    const key = `${rowIndex}-${letterIndex}`;
    setManualMarks((prev) => ({
      ...prev,
      [key]: nextStatus(prev[key]),
    }));
  };

  const rows = [];

  // Tamamlanmış tahminler
  for (let i = 0; i < guesses.length; i++) {
    const { word, result } = guesses[i];
    const isFullyAbsent = result.every((s) => s === "absent");

    rows.push(
      <div className="board-row-wrapper" key={`done-${i}`}>
        <div className="board-row">
          {word.split("").map((letter, j) => {
            const markKey = `${i}-${j}`;
            const manual = manualMarks[markKey];
            // Satırdaki tüm harfler kelimede yoksa otomatik kırmızı (oyuncu üzerine tıklayarak değiştirebilir)
            const displayStatus = isFullyAbsent ? manual || "absent" : manual;
            return (
              <Tile
                key={j}
                letter={letter}
                status={displayStatus}
                onClick={() => handleTileClick(i, j)}
              />
            );
          })}
        </div>
        <RowCounter result={result} />
      </div>
    );
  }

  // Şu an yazılmakta olan satır
  if (guesses.length < maxGuesses) {
    const letters = currentGuess.split("");
    rows.push(
      <div className="board-row-wrapper" key="current">
        <div className={`board-row ${shakeRow ? "shake" : ""}`}>
          {Array.from({ length: wordLength }).map((_, j) => (
            <Tile key={j} letter={letters[j] || ""} isActive={j === letters.length} />
          ))}
        </div>
        <RowCounter result={null} />
      </div>
    );
  }

  // Boş satırlar
  for (let i = guesses.length + 1; i < maxGuesses; i++) {
    rows.push(
      <div className="board-row-wrapper" key={`empty-${i}`}>
        <div className="board-row">
          {Array.from({ length: wordLength }).map((_, j) => (
            <Tile key={j} letter="" />
          ))}
        </div>
        <RowCounter result={null} />
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}

