// Türkiye'de yaygın kullanılan Q-klavye (QWERTY tabanlı) düzeni
const ROWS = [
  ["e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  ["ENTER", "z", "c", "v", "b", "n", "m", "ö", "ç", "BACKSPACE"],
];
// Not: ilk satıra q/w koymadım çünkü Türkçe kelimelerde neredeyse hiç
// kullanılmıyorlar; istersen ["q","w","e","r","t","y","u","ı","o","p","ğ","ü"]
// olarak değiştirebilirsin.

export default function Keyboard({ onLetter, onEnter, onBackspace, confirmedAbsentLetters }) {
  const handleClick = (key) => {
    if (key === "ENTER") return onEnter();
    if (key === "BACKSPACE") return onBackspace();
    onLetter(key);
  };

  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div className="keyboard-row" key={i}>
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            const isConfirmedAbsent =
              !isSpecial && confirmedAbsentLetters && confirmedAbsentLetters.has(key);
            const label =
              key === "BACKSPACE"
                ? "⌫"
                : key === "ENTER"
                ? "GİR"
                : key.toLocaleUpperCase("tr-TR");
            return (
              <button
                key={key}
                className={`key ${isSpecial ? "key-special" : ""} ${
                  isConfirmedAbsent ? "absent" : ""
                }`}
                onClick={() => handleClick(key)}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
