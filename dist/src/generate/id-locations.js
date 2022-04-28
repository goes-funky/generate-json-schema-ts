"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idLocations = void 0;
const idLocations = (fileSchemas) => {
    let idLocations = new Map();
    fileSchemas.forEach((schema, fileLocation) => {
        const id = schema.$id;
        if (id) {
            idLocations = idLocations.set(id, fileLocation);
        }
    });
    return idLocations;
};
exports.idLocations = idLocations;
