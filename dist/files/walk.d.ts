declare const files: (dir: string) => Promise<string[]>;
declare const filesRecursive: (dir: string) => Promise<string[]>;
export { files, filesRecursive };
