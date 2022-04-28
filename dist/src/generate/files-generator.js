"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const file_generator_1 = require("./file-generator");
const id_locations_1 = require("./id-locations");
const generate = (fileSchemas, options) => {
    const idFileLocations = (0, id_locations_1.idLocations)(fileSchemas);
    const fileContent = new Map();
    const inputInfo = {
        idFileLocations,
        options,
    };
    fileSchemas.forEach((schema, fileLocation) => {
        const locatedSchema = {
            fileLocation,
            schema,
        };
        const generated = (0, file_generator_1.fileGenerator)(locatedSchema, inputInfo);
        fileContent.set(fileLocation, generated);
    });
    return fileContent;
};
exports.generate = generate;
