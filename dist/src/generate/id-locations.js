"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idLocations = void 0;
var idLocations = function (fileSchemas) {
    var idLocations = new Map();
    fileSchemas.forEach(function (schema, fileLocation) {
        var id = schema.$id;
        if (id) {
            idLocations = idLocations.set(id, fileLocation);
        }
    });
    return idLocations;
};
exports.idLocations = idLocations;
