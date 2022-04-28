"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const walk_1 = require("./walk");
const read = (options) => {
    return new Promise((resolve, reject) => {
        const sourceDir = options.files.source.dir;
        const absoluteDir = path.isAbsolute(sourceDir)
            ? sourceDir
            : path.resolve(options.files.cwd || process.cwd(), sourceDir);
        const filesPromise = options.files.source.recursive
            ? (0, walk_1.filesRecursive)(absoluteDir)
            : (0, walk_1.files)(absoluteDir);
        const filesContent = new Map();
        const addContentPromise = (file) => readContent(file, options)
            .then((content) => {
            filesContent.set(toFileLocation(file), content);
        })
            .catch(reject);
        filesPromise
            .then((files) => files.map(addContentPromise))
            .then((promises) => Promise.all(promises))
            .then(() => resolve(filesContent))
            .catch(reject);
    });
};
exports.read = read;
const readContent = (file, options) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, { encoding: options.files.source.encoding }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
const toFileLocation = (file) => {
    const dir = path.dirname(file);
    const fileNameWithExt = path.basename(file);
    const fileName = fileNameWithExt.substring(0, fileNameWithExt.indexOf('.'));
    return {
        dir,
        fileName,
    };
};
