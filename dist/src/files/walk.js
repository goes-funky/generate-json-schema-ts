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
exports.filesRecursive = exports.files = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const READ_OPTIONS = { withFileTypes: true };
const flatten = (previous, current) => previous.concat(current);
const files = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, READ_OPTIONS, (err, files) => {
            if (err) {
                reject(err);
            }
            else if (!files || files.length === 0) {
                resolve([]);
            }
            else {
                const resolveSubPath = (file) => path.resolve(dir, file.name);
                const subFiles = files.filter((file) => file.isFile()).map(resolveSubPath);
                resolve(subFiles);
            }
        });
    });
};
exports.files = files;
const filesRecursive = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, READ_OPTIONS, (err, files) => {
            if (err) {
                reject(err);
            }
            else if (!files || files.length === 0) {
                resolve([]);
            }
            else {
                const resolveSubPath = (file) => path.resolve(dir, file.name);
                const subFiles = files.filter((file) => file.isFile()).map(resolveSubPath);
                const subDirs = files.filter((file) => file.isDirectory()).map(resolveSubPath);
                if (subDirs.length === 0) {
                    resolve(subFiles);
                }
                else {
                    Promise.all(subDirs.map(filesRecursive))
                        .then((subDirFiles) => subDirFiles.reduce(flatten, []))
                        .then((allSubDirFiles) => subFiles.concat(allSubDirFiles))
                        .then(resolve)
                        .catch(reject);
                }
            }
        });
    });
};
exports.filesRecursive = filesRecursive;
