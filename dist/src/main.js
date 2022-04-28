"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const files_1 = require("./files");
const generate_1 = require("./generate");
const options_1 = require("./options");
const schema_1 = require("./schema");
const main = (options) => {
    const allOptions = (0, options_1.createOptions)(options);
    return (Promise.resolve()
        // TODO source files exist if required
        .then(() => (0, files_1.clean)(allOptions))
        .then(() => (0, files_1.read)(allOptions))
        .then((fileContents) => (0, schema_1.parse)(fileContents))
        .then((fileSchemas) => (0, generate_1.generate)(fileSchemas, allOptions))
        // TODO check no extant files or can overwrite
        .then((filesContent) => (0, files_1.write)(filesContent, allOptions))
        .catch(console.error));
};
exports.main = main;
