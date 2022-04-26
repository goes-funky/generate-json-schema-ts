"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyOfGenerator = void 0;
var util_1 = require("../util");
var type_generator_1 = require("./type-generator");
var anyOfGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.anyOf || schema.anyOf.length === 0) {
        return undefined;
    }
    var lines = [];
    schema.anyOf.forEach(function (elementSchema) {
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
    else if (filteredLines.length === 1) {
        return filteredLines[0];
    }
    else {
        return '(' + filteredLines.join('\n| ') + ')';
    }
};
exports.anyOfGenerator = anyOfGenerator;
