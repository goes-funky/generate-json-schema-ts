"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var generate_1 = require("./generate");
var options_1 = require("./options");
var files_1 = require("./files");
var schema_1 = require("./schema");
var main = function (options) {
    var allOptions = options_1.createOptions(options);
    return (Promise.resolve()
        .then(function () { return files_1.clean(allOptions); })
        .then(function () { return files_1.read(allOptions); })
        .then(function (fileContents) { return schema_1.parse(fileContents); })
        .then(function (fileSchemas) { return generate_1.generate(fileSchemas, allOptions); })
        .then(function (filesContent) { return files_1.write(filesContent, allOptions); })
        .catch(console.error));
};
exports.main = main;
