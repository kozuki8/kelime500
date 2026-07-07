export default function Home({ onSelectMode, onShowHowToPlay }) {
  return (
    <div className="home">
      <h1 className="home-title">Kelime500</h1>
      <p className="home-subtitle">Türkçe kelime tahmin oyunu</p>

      <div className="home-cards">
        <button className="mode-card" onClick={() => onSelectMode("daily")}>
          <span className="mode-icon">📅</span>
          <span className="mode-title">Günlük Kelime</span>
          <span className="mode-desc">Her gün yeni bir kelime, günde 1 hak</span>
        </button>

        <button className="mode-card" onClick={() => onSelectMode("unlimited")}>
          <span className="mode-icon">♾️</span>
          <span className="mode-title">Sınırsız Mod</span>
          <span className="mode-desc">İstediğin kadar oyna, her seferinde yeni kelime</span>
        </button>
      </div>

      <button className="how-to-play-link" onClick={onShowHowToPlay}>
        Nasıl Oynanır?
      </button>
    </div>
  );
}
