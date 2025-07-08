import React, { useEffect, useRef } from "react";
import { useSpellChecker } from "../hooks/useSpellChecker";

const InfoMatrixComment = () => {
  const { text, handleChange, isSpellCheckEnabled, setIsSpellCheckEnabled } =
    useSpellChecker({
      initialText: "Ths is a comnent with errrors.",
      initialEnabled: true,
    });

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isSpellCheckEnabled && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.blur();
    }
  }, [isSpellCheckEnabled]);

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
          ref={textareaRef}
          className="spell-checker-textarea"
          spellCheck={isSpellCheckEnabled}
          lang="en"
          value={text}
          onChange={handleChange}
          placeholder="Enter your comment..."
        />
      </div>

      <SpellCheckerPreview
            text={text}
            isSpellCheckEnabled={isSpellCheckEnabled}
            onTextChange={(newText) => {
              const updatedTexts = [...texts];
              updatedTexts[index] = newText;
              setTexts(updatedTexts);
            }}
          />
    </div>
  );
};

export default InfoMatrixComment;
