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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var READ_OPTIONS = { withFileTypes: true };
var flatten = function (previous, current) { return previous.concat(current); };
var files = function (dir) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dir, READ_OPTIONS, function (err, files) {
            if (err) {
                reject(err);
            }
            else if (!files || files.length === 0) {
                resolve([]);
            }
            else {
                var resolveSubPath = function (file) { return path.resolve(dir, file.name); };
                var subFiles = files.filter(function (file) { return file.isFile(); }).map(resolveSubPath);
                resolve(subFiles);
            }
        });
    });
};
exports.files = files;
var filesRecursive = function (dir) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dir, READ_OPTIONS, function (err, files) {
            if (err) {
                reject(err);
            }
            else if (!files || files.length === 0) {
                resolve([]);
            }
            else {
                var resolveSubPath = function (file) { return path.resolve(dir, file.name); };
                var subFiles_1 = files.filter(function (file) { return file.isFile(); }).map(resolveSubPath);
                var subDirs = files.filter(function (file) { return file.isDirectory(); }).map(resolveSubPath);
                if (subDirs.length === 0) {
                    resolve(subFiles_1);
                }
                else {
                    Promise.all(subDirs.map(filesRecursive))
                        .then(function (subDirFiles) { return subDirFiles.reduce(flatten, []); })
                        .then(function (allSubDirFiles) { return subFiles_1.concat(allSubDirFiles); })
                        .then(resolve)
                        .catch(reject);
                }
            }
        });
    });
};
exports.filesRecursive = filesRecursive;
