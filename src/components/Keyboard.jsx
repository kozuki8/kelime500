import { useEffect, useRef, useState } from "react";

const ROWS = [
  ["e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  ["ENTER", "z", "c", "v", "b", "n", "m", "ö", "ç", "BACKSPACE"],
];

const COLOR_OPTIONS = [
  { value: "correct", label: "Yeşil", color: "#538d4e" },
  { value: "present", label: "Sarı", color: "#b59f3b" },
  { value: "absent", label: "Kırmızı", color: "#c94c4c" },
  { value: null, label: "Sıfırla", color: "#888888" },
];

export default function Keyboard({
  onLetter,
  onEnter,
  onBackspace,
  confirmedAbsentLetters,
  mode = "daily",
}) {
  const storageKey = `kelime500-keyboard-colors-${mode}`;

  const [manualColors, setManualColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });

  const [menu, setMenu] = useState(null);
  const longPressTimer = useRef(null);
  const longPressed = useRef(false);
  const menuRef = useRef(null);

  useEffect(() => {
    try {
      setManualColors(
        JSON.parse(localStorage.getItem(storageKey)) || {}
      );
    } catch {
      setManualColors({});
    }
    setMenu(null);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(manualColors));
  }, [manualColors, storageKey]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(null);
      }
    };

    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  const handleClick = (key) => {
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }

    if (key === "ENTER") return onEnter();
    if (key === "BACKSPACE") return onBackspace();

    onLetter(key);
  };

  const openMenu = (event, key) => {
    if (key === "ENTER" || key === "BACKSPACE") return;

    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();

    setMenu({
      key,
      x: Math.min(rect.left, window.innerWidth - 180),
      y: Math.max(8, rect.top - 175),
    });
  };

  const startLongPress = (event, key) => {
    if (event.pointerType === "mouse") return;
    if (key === "ENTER" || key === "BACKSPACE") return;

    longPressed.current = false;
    const target = event.currentTarget;

    clearTimeout(longPressTimer.current);

    longPressTimer.current = setTimeout(() => {
      longPressed.current = true;

      const rect = target.getBoundingClientRect();

      setMenu({
        key,
        x: Math.max(8, Math.min(rect.left, window.innerWidth - 180)),
        y: Math.max(8, rect.top - 175),
      });
    }, 500);
  };

  const cancelLongPress = () => {
    clearTimeout(longPressTimer.current);
  };

  const changeColor = (key, color) => {
    setManualColors((previous) => {
      const updated = { ...previous };

      if (color === null) {
        delete updated[key];
      } else {
        updated[key] = color;
      }

      return updated;
    });

    setMenu(null);
  };

  return (
    <>
      <div className="keyboard">
        {ROWS.map((row, i) => (
          <div className="keyboard-row" key={i}>
            {row.map((key) => {
              const isSpecial =
                key === "ENTER" || key === "BACKSPACE";

              const isConfirmedAbsent =
                !isSpecial &&
                confirmedAbsentLetters?.has(key);

              const colorClass = isSpecial
                ? ""
                : manualColors[key] || "";

              const label =
                key === "BACKSPACE"
                  ? "⌫"
                  : key === "ENTER"
                  ? "GİR"
                  : key.toLocaleUpperCase("tr-TR");

              return (
                <button
                  type="button"
                  key={key}
                  className={`key ${
                    isSpecial ? "key-special" : ""
                  } ${colorClass}`}
                  onClick={() => handleClick(key)}
                  onContextMenu={(event) => openMenu(event, key)}
                  onPointerDown={(event) =>
                    startLongPress(event, key)
                  }
                  onPointerUp={cancelLongPress}
                  onPointerLeave={cancelLongPress}
                  onPointerCancel={cancelLongPress}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {menu && (
        <div
          ref={menuRef}
          className="keyboard-color-menu"
          style={{
            position: "fixed",
            left: menu.x,
            top: menu.y,
            zIndex: 1000,
          }}
        >
          <div className="keyboard-color-title">
            {menu.key.toLocaleUpperCase("tr-TR")} harfi
          </div>

          {COLOR_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.label}
              className="keyboard-color-option"
              onClick={() =>
                changeColor(menu.key, option.value)
              }
            >
              <span
                className="keyboard-color-dot"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
