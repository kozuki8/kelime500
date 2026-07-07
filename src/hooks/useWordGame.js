import { useState, useEffect, useCallback, useMemo } from "react";
import hiddenWords from "../data/hiddenWords";
import guessableWords from "../data/guessableWords";

const WORD_LENGTH = 5;
const MAX_GUESSES = 8;

// Türkçe küçük harfe çevirme (İ/I - i/ı ayrımını doğru yapar)
function trLower(str) {
  return str.toLocaleLowerCase("tr-TR");
}

function pickRandomWord() {
  return hiddenWords[Math.floor(Math.random() * hiddenWords.length)];
}

function getTodayDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Herkes için aynı gün aynı kelime: tarihe göre sabit bir indeks üretir
function getWordOfTheDay() {
  const epoch = new Date(2025, 0, 1).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor((today.getTime() - epoch) / 86400000);
  const index =
    ((daysSinceEpoch % hiddenWords.length) + hiddenWords.length) % hiddenWords.length;
  return hiddenWords[index];
}

function evaluateGuess(guess, answer) {
  const result = new Array(WORD_LENGTH).fill("absent");
  const answerLetters = answer.split("");
  const guessLetters = guess.split("");
  const used = new Array(WORD_LENGTH).fill(false);

  // 1. geçiş: doğru pozisyondakiler (yeşil)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  // 2. geçiş: kelimede var ama yanlış yerde (sarı)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const idx = answerLetters.findIndex(
      (letter, j) => letter === guessLetters[i] && !used[j]
    );
    if (idx !== -1) {
      result[i] = "present";
      used[idx] = true;
    }
  }

  return result;
}

const STATUS_RANK = { absent: 0, present: 1, correct: 2 };

/**
 * @param {"daily"|"unlimited"} mode
 *  - "daily": herkes için o gün sabit kelime, günde 1 kez oynanır (yeniden başlatılamaz)
 *  - "unlimited": her "Yeni Oyun"da rastgele farklı kelime
 */
export default function useWordGame(mode = "unlimited") {
  const guessableSet = useMemo(() => new Set(guessableWords), []);
  const todayString = useMemo(() => getTodayDateString(), []);

  // Günlük modda tarih değişirse (gün döndüğünde) farklı bir depolama anahtarı kullanılır,
  // böylece önceki günün ilerlemesiyle çakışmaz.
  const storageKey =
    mode === "daily" ? `word500-daily-${todayString}` : "word500-unlimited";

  const [answer, setAnswer] = useState(() => {
    if (mode === "daily") {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
        if (saved && saved.date === todayString && saved.answer) {
          return saved.answer;
        }
      } catch (e) {
        // yoksay
      }
      return getWordOfTheDay();
    }
    return pickRandomWord();
  });

  const [guesses, setGuesses] = useState([]); // [{ word, result }]
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing"); // playing | won | lost
  const [message, setMessage] = useState("");
  const [keyStatuses, setKeyStatuses] = useState({});
  const [shakeRow, setShakeRow] = useState(false);

  // Tüm harfleri kelimede olmayan (tamamen kırmızı) tahminlerden toplanan harfler.
  // Bu harflerin kesin olarak kelimede olmadığı biliniyor, klavyede otomatik kırmızı gösterilir.
  const confirmedAbsentLetters = useMemo(() => {
    const set = new Set();
    guesses.forEach(({ word, result }) => {
      if (result.every((s) => s === "absent")) {
        word.split("").forEach((letter) => set.add(letter));
      }
    });
    return set;
  }, [guesses]);

  // Kayıtlı oyunu yükle (aynı anahtar + aynı gün + aynı kelime için)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && saved.date === todayString && saved.answer === answer) {
        setGuesses(saved.guesses || []);
        setGameStatus(saved.gameStatus || "playing");
        setKeyStatuses(saved.keyStatuses || {});
        setCurrentGuess(saved.currentGuess || "");
      }
    } catch (e) {
      // localStorage okunamadıysa sessizce devam et
    }
    // storageKey değiştiğinde (örn. mod değişince) yeniden yükle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Oyun durumunu kaydet (yazılmakta olan harfler dahil)
  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        date: todayString,
        answer,
        guesses,
        gameStatus,
        keyStatuses,
        currentGuess,
      })
    );
  }, [storageKey, todayString, answer, guesses, gameStatus, keyStatuses, currentGuess]);

  // Mesajı bir süre sonra otomatik temizle
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 1800);
    return () => clearTimeout(t);
  }, [message]);

  const updateKeyStatuses = useCallback((word, result) => {
    setKeyStatuses((prev) => {
      const next = { ...prev };
      word.split("").forEach((letter, i) => {
        const newStatus = result[i];
        if (!next[letter] || STATUS_RANK[newStatus] > STATUS_RANK[next[letter]]) {
          next[letter] = newStatus;
        }
      });
      return next;
    });
  }, []);

  const addLetter = useCallback(
    (letter) => {
      if (gameStatus !== "playing") return;
      setCurrentGuess((prev) =>
        prev.length < WORD_LENGTH ? prev + trLower(letter) : prev
      );
    },
    [gameStatus]
  );

  const removeLetter = useCallback(() => {
    if (gameStatus !== "playing") return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus]);

  const triggerShake = useCallback(() => {
    setShakeRow(true);
    setTimeout(() => setShakeRow(false), 500);
  }, []);

  const submitGuess = useCallback(() => {
    if (gameStatus !== "playing") return;

    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Kelime 5 harfli olmalı");
      triggerShake();
      return;
    }

    if (!guessableSet.has(currentGuess)) {
      setMessage("Bu kelime listede yok");
      triggerShake();
      return;
    }

    const result = evaluateGuess(currentGuess, answer);
    updateKeyStatuses(currentGuess, result);

    const newGuesses = [...guesses, { word: currentGuess, result }];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === answer) {
      setGameStatus("won");
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus("lost");
    }
  }, [currentGuess, gameStatus, guesses, guessableSet, updateKeyStatuses, triggerShake, answer]);

  // Günlük modda kelime değiştirilemez — o gün için sabittir
  const canRestart = mode === "unlimited";

  const resetGame = useCallback(() => {
    if (!canRestart) return;
    setAnswer(pickRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setKeyStatuses({});
    setMessage("");
  }, [canRestart]);

  return {
    mode,
    answer,
    guesses,
    currentGuess,
    gameStatus,
    message,
    keyStatuses,
    confirmedAbsentLetters,
    shakeRow,
    wordLength: WORD_LENGTH,
    maxGuesses: MAX_GUESSES,
    canRestart,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
  };
}
