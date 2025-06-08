import React, { useState, useEffect, useRef } from "react";
import Typo from "typo-js";

export default function SpellChecker() {
  const [text, setText] = useState("Ths is a comnent with errrors.");
  const [typo, setTypo] = useState(null);
  const [misspelled, setMisspelled] = useState([]);
  const [ignoredWords, setIgnoredWords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(true);
  const containerRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !containerRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
    async function loadDict() {
      const aff = await fetch("/dictionaries/en_US/en_US.aff").then((res) =>
        res.text()
      );
      const dic = await fetch("/dictionaries/en_US/en_US.dic").then((res) =>
        res.text()
      );
      setTypo(new Typo("en_US", aff, dic));
    }
    loadDict();
  }, []);

  useEffect(() => {
    if (!typo || !isSpellCheckEnabled) {
      setMisspelled([]);
      return;
    }

    const words = text.split(/\s+/);
    const incorrectWords = words.filter(
      (word) => !ignoredWords.includes(word) && !typo.check(word)
    );
    setMisspelled(incorrectWords);
  }, [text, typo, ignoredWords, isSpellCheckEnabled]);

  const handleRightClick = (word, e) => {
    e.preventDefault();
    const sugg = typo.suggest(word);
    setSuggestions(sugg);
    setContextMenu({ word, x: e.clientX, y: e.clientY });
  };

  const applySuggestion = (selectedWord) => {
    const updated = text.replace(contextMenu.word, selectedWord);
    setText(updated);
    setContextMenu(null);
  };

  const ignoreWord = () => {
    setIgnoredWords([...ignoredWords, contextMenu.word]);
    setContextMenu(null);
  };

  const highlightText = () => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      if (misspelled.includes(word)) {
        return (
          <span
            key={index}
            className="misspelled"
            onClick={(e) => handleRightClick(word, e)}
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

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
        <div ref={containerRef}>
          {highlightText()}
        </div>
      </div>

      {contextMenu && (
        <ul
          className="spell-suggestions"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: "fixed"
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <li key={i} className="suggestion" onClick={() => applySuggestion(s)}>
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
