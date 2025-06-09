declare module "typo-js" {
  class Typo {
    [x: string]: any;
    constructor(
      dictionary: string,
      options?: {
        locale?: string;
        strict?: boolean;
      }
    );

    load(dictionary: string): void;
    add(word: string): void;
    remove(word: string): void;
    check(word: string): boolean;
    suggestions(word: string): string[];
    addDictionary(dictionary: string): void;
  }

  export default Typo;
}
