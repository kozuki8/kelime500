
export default function HowToPlayModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Nasıl Oynanır?</h2>

        <ol className="how-to-play-list">
          <li>
            5 harfli gizli kelimeyi 8 hak içinde bulmaya çalış.
          </li>

          <li>
            Her tahminden sonra satırın yanındaki 3 kutucuk,
            tahminindeki harflerin gerçek durumunu gösterir:

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
            Sistem hangi harflerin doğru olduğunu doğrudan göstermez.
            Tahmin satırlarındaki harflere tıklayarak kendi notlarını
            oluşturabilirsin.
          </li>

          <li>
            Klavyedeki harflerin üzerine sağ tıklayarak
            <span className="legend-box correct"></span>
            yeşil,
            <span className="legend-box present"></span>
            sarı veya
            <span className="legend-box absent"></span>
            kırmızı renk verebilirsin.
            Rengi kaldırmak için "Sıfırla" seçeneğini kullan.
            Telefonda aynı menüyü açmak için harfe uzun bas.
          </li>

          <li>
            <strong>Günlük Kelime:</strong> Herkes için o gün aynı
            kelime belirlenir. Günde bir kez oynayabilirsin.
          </li>

          <li>
            <strong>Sınırsız Mod:</strong> İstediğin kadar oyna.
            Her yeni oyunda rastgele bir kelime gelir.
          </li>
        </ol>
      </div>
    </div>
  );
}
