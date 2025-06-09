declare class Typo {
  constructor(
    dictionary: string,
    options?: { locale?: string; strict?: boolean }
  );

  load(dictionary: string): void;

  check(word: string): boolean;
  suggest(word: string): string[];
  add(word: string): void;
  remove(word: string): void;
}
