import React, { useEffect, useRef, useState } from "react";
import { useSpellChecker } from "../hooks/useSpellChecker";
import SpellCheckerPreview from "./BrowserPreview";

const InfoMatrixComment = () => {
  const { isSpellCheckEnabled, setIsSpellCheckEnabled } = useSpellChecker({
    initialEnabled: true,
  });

  const [texts, setTexts] = useState([
    "Ths is a comnent with errrors.",
    "Anothr example with spel mistakes.",
  ]);

  const textareaRefs = useRef([]);
  const previewRefs = useRef([]);

  const handlePreviewChange = (index) => {
    if (previewRefs.current[index]) {
      const html = previewRefs.current[index].innerHTML;
      const updatedTexts = [...texts];
      updatedTexts[index] = html.replace(/<br>/g, "\n");
      setTexts(updatedTexts);
    }
  };

  const handleTextChange = (index, event) => {
    const updatedTexts = [...texts];
    updatedTexts[index] = event.target.value;
    setTexts(updatedTexts);
  };

  const addNewComment = () => {
    setTexts([...texts, ""]);
  };

  useEffect(() => {
    if (isSpellCheckEnabled) {
      textareaRefs.current.forEach((ref) => {
        if (ref) {
          ref.focus();
          ref.blur();
        }
      });

      previewRefs.current.forEach((ref) => {
        if (ref) {
          ref.focus();
          ref.blur();
        }
      });
    }
  }, [isSpellCheckEnabled]);

  useEffect(() => {
    previewRefs.current.forEach((ref, index) => {
      if (ref) {
        const handleInput = () => handlePreviewChange(index);
        ref.addEventListener("input", handleInput);
        return () => {
          ref.removeEventListener("input", handleInput);
        };
      }
    });
  }, [texts]);

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
        <button onClick={addNewComment}>+ Add Comment</button>
      </div>

      {texts.map((text, index) => (
        <div key={index} className="spell-checker-textarea-container">
          <textarea
            ref={(el) => (textareaRefs.current[index] = el)}
            className="spell-checker-textarea"
            spellCheck={isSpellCheckEnabled}
            lang="en"
            value={text}
            onChange={(e) => handleTextChange(index, e)}
            placeholder="Enter your comment..."
          />
          <SpellCheckerPreview
            text={text}
            isSpellCheckEnabled={isSpellCheckEnabled}
            onTextChange={(newText) => {
              const updatedTexts = [...texts];
              updatedTexts[index] = newText;
              setTexts(updatedTexts);
            }}
            previewRef={(el) => (previewRefs.current[index] = el)}
          />
        </div>
      ))}
    </div>
  );
};

export default InfoMatrixComment;
