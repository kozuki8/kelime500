export default function HowToPlayModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>Nasıl Oynanır?</h2>

        <ol className="how-to-play-list">
          <li>5 harfli gizli kelimeyi 8 hak içinde bulmaya çalış.</li>

          <li>
            Harflerin kendisi renklenmez — ama her tahminden sonra satırın
            yanında 3 kutucuk gerçek sonucu gösterir:
            <ul>
              <li>
                <span className="legend-box correct"></span>
                Doğru pozisyondaki harf sayısı
              </li>
              <li>
                <span className="legend-box present"></span>
                Kelimede var ama yanlış pozisyondaki harf sayısı
              </li>
              <li>
                <span className="legend-box absent"></span>
                Kelimede hiç olmayan harf sayısı
              </li>
            </ul>
          </li>

          <li>
            Hangi harfin doğru olduğunu sistem söylemez — ama tahtadaki
            harflere tıklayarak kendi notlarını (kırmızı → sarı → yeşil)
            işaretleyebilirsin.
          </li>

          <li>
            Bir tahminin tüm harfleri kelimede yoksa, o harfler otomatik
            olarak hem tahtada hem klavyede kırmızı gösterilir.
          </li>

          <li>
            <strong>Günlük Kelime:</strong> Herkes için o gün aynı kelime,
            günde bir kez oynanır.
          </li>

          <li>
            <strong>Sınırsız Mod:</strong> İstediğin kadar oyna, her yeni
            oyunda rastgele bir kelime gelir.
          </li>
        </ol>
      </div>
    </div>
  );
}
