import React, { useEffect, useRef } from "react";
import { useSpellChecker } from "../hooks/useSpellChecker";

const InfoMatrixComment = () => {
  // Use shared hook
  const { text, setText, handleChange, isSpellCheckEnabled, setIsSpellCheckEnabled } =
    useSpellChecker({
      initialText: "Ths is a comnent with errrors.",
      initialEnabled: true,
    });

  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  // Handle preview content changes
  const handlePreviewChange = () => {
    if (previewRef.current) {
      const html = previewRef.current.innerHTML;
      // Remove <br> tags and replace with newlines
      const text = html.replace(/<br>/g, '\n');
      setText(text);
    }
  };

  useEffect(() => {
    if (isSpellCheckEnabled) {
      // Focus and blur the textarea to trigger spell check
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.blur();
      }
      // Focus and blur the preview to trigger spell check
      if (previewRef.current) {
        previewRef.current.focus();
        previewRef.current.blur();
      }
    }
  }, [isSpellCheckEnabled]);

  // Add event listener for preview changes
  useEffect(() => {
    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.addEventListener('input', handlePreviewChange);
      return () => {
        previewElement.removeEventListener('input', handlePreviewChange);
      };
    }
  }, []);

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

      <div className="spell-checker-preview">
        <h4>Preview</h4>
        <div>
          <div
            ref={previewRef}
            spellCheck={isSpellCheckEnabled}
            contentEditable={isSpellCheckEnabled}
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
            onInput={handlePreviewChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoMatrixComment;
