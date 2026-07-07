export default function Tile({ letter, isActive, status, onClick }) {
  const stateClass = status ? status : letter ? "filled" : "empty";
  const displayLetter = letter ? letter.toLocaleUpperCase("tr-TR") : "";

  return (
    <div
      className={`tile ${stateClass} ${isActive ? "active" : ""} ${
        onClick ? "clickable" : ""
      }`}
      onClick={onClick}
    >
      {displayLetter}
    </div>
  );
}
