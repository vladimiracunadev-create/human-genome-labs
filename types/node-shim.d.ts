/** Minimal Node.js declarations used by the dependency-free CLI build. */
declare module "node:fs/promises" {
  export function readFile(path: string | URL, encoding: "utf8"): Promise<string>;
}
declare module "node:path" {
  export function resolve(...paths: string[]): string;
}
interface ImportMeta { readonly dirname: string; }
declare const process: {
  readonly argv: string[];
  readonly stdout: { readonly isTTY?: boolean };
  exit(code?: number): never;
};
