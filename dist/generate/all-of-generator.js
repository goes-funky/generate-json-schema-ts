"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allOfGenerator = void 0;
var type_generator_1 = require("./type-generator");
var util_1 = require("../util");
var allOfGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.allOf || schema.allOf.length === 0) {
        return undefined;
    }
    var lines = [];
    schema.allOf.forEach(function (elementSchema) {
        var elementLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: elementSchema
        };
        var elementContent = type_generator_1.typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
        lines.push(elementContent);
    });
    var filteredLines = util_1.filtered(lines);
    if (filteredLines.length === 0) {
        return undefined;
    }
    return filteredLines.join('\n& ');
};
exports.allOfGenerator = allOfGenerator;
