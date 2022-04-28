#!/usr/bin/env node

import console from "console";
import { main } from "../src";

if (process.argv.length != 4) {
  console.error(`Usage: ts-node scripts/generate.ts INPUT_PATH OUTPUT_PATH`);
}

const inPath = process.argv[2];
const outPath = process.argv[3];

main({
  files: {
    source: {
      dir: inPath,
    },
    destination: {
      dir: outPath,
    },
  },
});
