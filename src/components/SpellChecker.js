import React from "react";
import "../components/SpellChecker.css";
import {
  useCustomSpellChecker,
  useSpellChecker,
} from "../hooks/useSpellChecker";

export default function SpellChecker() {
  const {
    text,
    setText,
    isSpellCheckEnabled,
    setIsSpellCheckEnabled,
    contextMenu,
    setContextMenu,
    handleRightClick,
  } = useSpellChecker({
    initialText: "Ths is a comnent with errrors.",
    initialEnabled: true,
  });

  const { applySuggestion, ignoreWord, highlightText, suggestions } =
    useCustomSpellChecker({
      text,
      setText,
      contextMenu,
      setContextMenu,
      handleRightClick,
      isSpellCheckEnabled,
    });

  return (
    <div className="spell-checker-container">
      <div className="spell-checker-header">
        <div className="spell-checker-checkbox">
          <input
            type="checkbox"
            checked={isSpellCheckEnabled}
            onChange={() => setIsSpellCheckEnabled(!isSpellCheckEnabled)}
          />
          <span>Enable Spell Checker</span>
        </div>
      </div>

      <div className="spell-checker-textarea-container">
        <textarea
          className="spell-checker-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your comment..."
        />
      </div>

      <div className="spell-checker-preview">
        <h4>Preview</h4>
        <div>{highlightText(text)}</div>
      </div>

      {contextMenu && (
        <ul
          className="spell-suggestions"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: "fixed",
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <li
                key={i}
                className="suggestion"
                onClick={() => applySuggestion(s)}
              >
                {s}
              </li>
            ))
          ) : (
            <li className="no-suggestions">No suggestions</li>
          )}
          <li className="ignore" onClick={ignoreWord}>
            <span>Ignore</span>
          </li>
        </ul>
      )}
    </div>
  );
}
