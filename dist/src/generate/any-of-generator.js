"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyOfGenerator = void 0;
var type_generator_1 = require("./type-generator");
var anyOfGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.anyOf || schema.anyOf.length === 0) {
        return;
    }
    var elements = [];
    schema.anyOf.forEach(function (elementSchema) {
        var elementLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: elementSchema,
        };
        var elementContent = type_generator_1.typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
        if (elementContent) {
            elements.push(elementContent);
        }
    });
    if (!elements.length) {
        return;
    }
    var output = "(" + elements.join(' | ') + ")";
    if (locatedSchema.typeName) {
        return "export type " + locatedSchema.typeName + " = " + output + ";";
    }
    return output;
};
exports.anyOfGenerator = anyOfGenerator;
