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
exports.write = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const write = (filesContent, options) => {
    const promises = [];
    return new Promise((resolve, reject) => {
        const cwd = options.files.cwd || process.cwd();
        const rootSourceDir = path.resolve(cwd, options.files.source.dir);
        const rootDestinationDir = path.resolve(cwd, options.files.destination.dir);
        const folderFiles = new Map();
        filesContent.forEach((content, fileLocation) => {
            const relativeDir = path.relative(rootSourceDir, fileLocation.dir);
            const absoluteDir = path.resolve(rootDestinationDir, relativeDir);
            const absoluteFile = path.resolve(absoluteDir, fileLocation.fileName) + '.ts';
            const promise = writeContent(content, absoluteFile);
            let files = folderFiles.get(absoluteDir);
            if (!files) {
                files = new Set();
                folderFiles.set(absoluteDir, files);
            }
            files.add(fileLocation.fileName);
            promises.push(promise);
        });
        if (options.files.destination.indexFiles) {
            promises.push(createIndexFiles(folderFiles));
        }
        Promise.all(promises)
            .then(() => resolve())
            .catch(reject);
    });
};
exports.write = write;
const createIndexFiles = (folderFiles) => {
    return new Promise((resolve, reject) => {
        const promises = [];
        Array.from(folderFiles.entries()).forEach(([folder, files]) => {
            const indexFileName = `${folder}/index.ts`;
            const contentLines = [];
            Array.from(files)
                .sort()
                .forEach((file) => {
                const line = `export * from './${file}';`;
                contentLines.push(line);
            });
            const content = contentLines.join('\n');
            promises.push(writeContent(content, indexFileName));
        });
        Promise.all(promises)
            .then(() => resolve())
            .catch(reject);
    });
};
const writeContent = (content, absoluteFile) => {
    return new Promise((resolve, reject) => {
        mkdirs(absoluteFile)
            .then(() => {
            fs.writeFile(absoluteFile, content, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        })
            .catch(reject);
    });
};
const mkdirs = (absoluteFile) => {
    return new Promise((resolve, reject) => {
        const dir = absoluteFile.substring(0, absoluteFile.lastIndexOf(path.sep));
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
