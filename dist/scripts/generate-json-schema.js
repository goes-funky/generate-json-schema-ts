#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var console_1 = __importDefault(require("console"));
var src_1 = require("../src");
if (process.argv.length != 4) {
    console_1.default.error("Usage: ts-node scripts/generate.ts INPUT_PATH OUTPUT_PATH");
}
var inPath = process.argv[2];
var outPath = process.argv[3];
src_1.main({
    files: {
        source: {
            dir: inPath,
        },
        destination: {
            dir: outPath,
        },
    },
});
