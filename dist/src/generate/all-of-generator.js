"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allOfGenerator = void 0;
var type_generator_1 = require("./type-generator");
var allOfGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.allOf || schema.allOf.length === 0) {
        return undefined;
    }
    var elements = [];
    schema.allOf.forEach(function (elementSchema) {
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
    var output = "(" + elements.join(" & ") + ")";
    if (!locatedSchema.typeName) {
        return output;
    }
    return "export type " + locatedSchema.typeName + " = " + output + ";";
};
exports.allOfGenerator = allOfGenerator;
