import React, { useState } from "react";
import SpellChecker from "./components/SpellChecker";
import InfoMatrixComment from "./components/InfoMatrixComment";
import "./App.css";

function App() {
  const [comment, setComment] = useState("Ths is a comnent with errrors.");

  return (
    <div className="App">
      <h1>Spell Checkers Comparison</h1>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          padding: "1rem",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <h2>Custom Spell Checker</h2>
          <SpellChecker />
        </div>

        <div
          style={{
            width: "50%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <h2>Native Browser Spell Checker</h2>
          <InfoMatrixComment onCommentChange={setComment} comment={comment} />
        </div>
      </div>
    </div>
  );
}

export default App;
