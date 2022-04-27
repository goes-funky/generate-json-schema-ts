"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
var file_generator_1 = require("./file-generator");
var id_locations_1 = require("./id-locations");
var generate = function (fileSchemas, options) {
    var idFileLocations = id_locations_1.idLocations(fileSchemas);
    var fileContent = new Map();
    var inputInfo = {
        idFileLocations: idFileLocations,
        options: options,
    };
    fileSchemas.forEach(function (schema, fileLocation) {
        var locatedSchema = {
            fileLocation: fileLocation,
            schema: schema,
        };
        var generated = file_generator_1.fileGenerator(locatedSchema, inputInfo);
        fileContent.set(fileLocation, generated);
    });
    return fileContent;
};
exports.generate = generate;
