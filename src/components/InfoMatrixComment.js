import React, { useState } from "react";

const InfoMatrixComment = ({
  onCommentChange,
  comment = "Ths is a comnent with errrors.",
}) => {
  const [text, setText] = useState(comment);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setText(newValue);
    if (onCommentChange) {
      onCommentChange(newValue);
    }
  };

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(true);

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
            spellCheck={isSpellCheckEnabled}
            contentEditable={isSpellCheckEnabled}
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoMatrixComment;
