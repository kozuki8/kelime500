import { useState } from "react";
import Home from "./components/Home";
import Game from "./components/Game";
import HowToPlayModal from "./components/HowToPlayModal";
import "./App.css";

export default function App() {
  const [view, setView] = useState("home"); // "home" | "daily" | "unlimited"
  const [showHowTo, setShowHowTo] = useState(false);

  if (view === "home") {
    return (
      <>
        <Home onSelectMode={setView} onShowHowToPlay={() => setShowHowTo(true)} />
        {showHowTo && <HowToPlayModal onClose={() => setShowHowTo(false)} />}
      </>
    );
  }

  return <Game mode={view} onBack={() => setView("home")} />;
}
