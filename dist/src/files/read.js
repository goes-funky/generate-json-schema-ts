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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var walk_1 = require("./walk");
var read = function (options) {
    return new Promise(function (resolve, reject) {
        var sourceDir = options.files.source.dir;
        var absoluteDir = (path.isAbsolute(sourceDir))
            ? sourceDir
            : path.resolve(options.files.cwd || process.cwd(), sourceDir);
        var filesPromise = (options.files.source.recursive)
            ? walk_1.filesRecursive(absoluteDir)
            : walk_1.files(absoluteDir);
        var filesContent = new Map();
        var addContentPromise = function (file) { return readContent(file, options)
            .then(function (content) { filesContent.set(toFileLocation(file), content); })
            .catch(reject); };
        filesPromise
            .then(function (files) { return files.map(addContentPromise); })
            .then(function (promises) { return Promise.all(promises); })
            .then(function () { return resolve(filesContent); })
            .catch(reject);
    });
};
exports.read = read;
var readContent = function (file, options) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, { encoding: options.files.source.encoding }, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
var toFileLocation = function (file) {
    var dir = path.dirname(file);
    var fileNameWithExt = path.basename(file);
    var fileName = fileNameWithExt.substring(0, fileNameWithExt.indexOf('.'));
    return {
        dir: dir,
        fileName: fileName
    };
};
