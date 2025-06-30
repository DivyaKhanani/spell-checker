import { useState, useEffect, useRef, Fragment } from "react";
import Typo from "typo-js";

interface SpellCheckerState {
  text: string;
  setText: (text: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isSpellCheckEnabled: boolean;
  setIsSpellCheckEnabled: (enabled: boolean) => void;
}

interface CustomSpellCheckerProps {
  typo: Typo | null;
  text: string;
  setText: (text: string) => void;
  contextMenu: null | { word: string; x: number; y: number };
  setContextMenu: React.Dispatch<
    React.SetStateAction<null | { word: string; x: number; y: number }>
  >;
  isSpellCheckEnabled: boolean;
}

interface CustomSpellCheckerState {
  misspelled: string[];
  ignoredWords: string[];
  suggestions: string[];
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  applySuggestion: (word: string, suggestion: string) => void;
  ignoreWord: (word: string) => void;
  highlightText: (text: string) => string;
}

export const useSpellChecker = ({
  initialText = "",
  initialEnabled = true,
}: {
  initialText?: string;
  initialEnabled?: boolean;
} = {}): Pick<
  SpellCheckerState,
  | "text"
  | "setText"
  | "handleChange"
  | "isSpellCheckEnabled"
  | "setIsSpellCheckEnabled"
> => {
  const [text, setText] = useState(initialText);
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] =
    useState(initialEnabled);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return {
    text,
    setText,
    handleChange,
    isSpellCheckEnabled,
    setIsSpellCheckEnabled,
  };
};

export const useCustomSpellChecker = ({
  text,
  setText,
  isSpellCheckEnabled,
}: CustomSpellCheckerProps) => {
  const [contextMenu, setContextMenu] = useState<null | {
    word: string;
    x: number;
    y: number;
  }>(null);

  const handleRightClick = (word: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    const cleanWord = word.replace(/[^\\w']/g, "").toLowerCase(); // Clean the word
    if (!typo || ignoredWords.includes(cleanWord)) return; // Don't show if word is ignored

    // Check if word is misspelled
    if (!typo.check(cleanWord)) {
      setContextMenu({ word, x: e.clientX, y: e.clientY });
      // Load suggestions immediately
      const sugg = typo.suggest(cleanWord);
      setSuggestions(sugg);
    }
  };

  const [misspelled, setMisspelled] = useState<string[]>([]);
  const [ignoredWords, setIgnoredWords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typo, setTypo] = useState<Typo | null>(null);

  useEffect(() => {
    async function loadDict() {
      try {
        const aff = await fetch("/dictionaries/en_US/en_US.aff").then((res) =>
          res.text()
        );
        const dic = await fetch("/dictionaries/en_US/en_US.dic").then((res) =>
          res.text()
        );
        // @ts-ignore
        setTypo(new Typo("en_US", aff, dic));

        console.log("Dictionary loaded successfully");
      } catch (error) {
        console.error("Error loading dictionary:", error);
        const typo = new Typo("");
        setTypo(typo);
      }
    }
    loadDict();
  }, []);

  useEffect(() => {
    if (contextMenu && typo) {
      const cleanWord = contextMenu.word.replace(/[^\w']/g, "");
      const sugg = typo.suggest(cleanWord);
      setSuggestions(sugg);
    }
  }, [contextMenu, typo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu) {
        const menuElement = document.querySelector(".spell-suggestions");
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setContextMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const spellCheckEffect = () => {
    if (!typo || !isSpellCheckEnabled || !text) {
      setMisspelled([]);
      return;
    }

    try {
      const words = text.split(/\s+/);
      const incorrectWords = words.filter((word) => {
        const cleanWord = word.replace(/[^\w']/g, "");
        return (
          cleanWord &&
          !ignoredWords.includes(cleanWord.toLowerCase()) &&
          !typo.check(cleanWord)
        );
      });
      setMisspelled(incorrectWords);
    } catch (error) {
      console.error("Error checking spelling:", error);
      setMisspelled([]);
    }
  };

  useEffect(spellCheckEffect, [text, typo, ignoredWords, isSpellCheckEnabled]);

  const applySuggestion = (selectedWord: string) => {
    if (!contextMenu || !text) return;

    const pattern = new RegExp(`\\b${contextMenu.word}\\b`, "gi");
    const updated = text.replace(pattern, selectedWord);
    setText(updated);
    setContextMenu(null);
  };

  const ignoreWord = () => {
    if (!contextMenu?.word) return;

    const normalizedWord = contextMenu.word.toLowerCase();
    if (!ignoredWords.includes(normalizedWord)) {
      setIgnoredWords([...ignoredWords, normalizedWord]);
    }
    setContextMenu(null);
  };

  const highlightText = (inputText: string) => {
    if (!inputText) return null;

    const words = inputText.split(/(\s+)/); // Corrected regex

    return (
      <Fragment>
        {words.map((word: string, index: number) => {
          if (!word.trim()) return word;

          const cleanWord = word.replace(/[^\w']/g, "");
          const isMisspelled =
            misspelled.includes(cleanWord) &&
            !ignoredWords.includes(cleanWord.toLowerCase());

          return (
            <span
              key={index}
              className={isMisspelled ? "misspelled" : ""}
              title={isMisspelled ? "Click to see suggestions" : ""}
            >
              {isMisspelled ? (
                <span onClick={(e) => handleRightClick(word, e)}>{word}</span>
              ) : (
                word
              )}
            </span>
          );
        })}
      </Fragment>
    );
  };

  return {
    misspelled,
    ignoredWords,
    suggestions,
    setSuggestions,
    applySuggestion,
    ignoreWord,
    highlightText,
    contextMenu,
    setContextMenu,
  };
};
