import { useEffect, useRef } from "react";

const SpellCheckerPreview = ({ text, isSpellCheckEnabled, onTextChange }) => {
  const previewRef = useRef(null); 
  const handleInput = () => {
    if (previewRef.current) {
      const html = previewRef.current.innerHTML;
      const plainText = html.replace(/<br>/g, '\n');
      onTextChange(plainText);
    }
  };

  useEffect(() => {
    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.addEventListener("input", handleInput);
      return () => {
        previewElement.removeEventListener("input", handleInput);
      };
    }
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.focus();
      previewRef.current.blur();
    }
  }, [isSpellCheckEnabled]);

  return (
    <div className="spell-checker-preview">
      <h4>Preview</h4>
      <div>
        <div
          ref={previewRef}
          spellCheck={isSpellCheckEnabled}
          contentEditable={isSpellCheckEnabled}
          dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
        />
      </div>
    </div>
  );
};

export default SpellCheckerPreview;
