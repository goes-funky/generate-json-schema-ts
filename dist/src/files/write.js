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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var write = function (filesContent, options) {
    var promises = [];
    return new Promise(function (resolve, reject) {
        var cwd = options.files.cwd || process.cwd();
        var rootSourceDir = path.resolve(cwd, options.files.source.dir);
        var rootDestinationDir = path.resolve(cwd, options.files.destination.dir);
        var folderFiles = new Map();
        filesContent.forEach(function (content, fileLocation) {
            var relativeDir = path.relative(rootSourceDir, fileLocation.dir);
            var absoluteDir = path.resolve(rootDestinationDir, relativeDir);
            var absoluteFile = path.resolve(absoluteDir, fileLocation.fileName) + '.ts';
            var promise = writeContent(content, absoluteFile);
            var files = folderFiles.get(absoluteDir);
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
            .then(function () { return resolve(); })
            .catch(reject);
    });
};
exports.write = write;
var createIndexFiles = function (folderFiles) {
    return new Promise(function (resolve, reject) {
        var promises = [];
        Array.from(folderFiles.entries()).forEach(function (_a) {
            var folder = _a[0], files = _a[1];
            var indexFileName = folder + "/index.ts";
            var contentLines = [];
            Array.from(files)
                .sort()
                .forEach(function (file) {
                var line = "export * from './" + file + "';";
                contentLines.push(line);
            });
            var content = contentLines.join('\n');
            promises.push(writeContent(content, indexFileName));
        });
        Promise.all(promises)
            .then(function () { return resolve(); })
            .catch(reject);
    });
};
var writeContent = function (content, absoluteFile) {
    return new Promise(function (resolve, reject) {
        mkdirs(absoluteFile)
            .then(function () {
            fs.writeFile(absoluteFile, content, function (err) {
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
var mkdirs = function (absoluteFile) {
    return new Promise(function (resolve, reject) {
        var dir = absoluteFile.substring(0, absoluteFile.lastIndexOf(path.sep));
        fs.mkdir(dir, { recursive: true }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
