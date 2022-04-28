"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allOfGenerator = void 0;
const type_generator_1 = require("./type-generator");
const allOfGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    if (!schema.allOf || schema.allOf.length === 0) {
        return undefined;
    }
    const elements = [];
    schema.allOf.forEach((elementSchema) => {
        const elementLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: elementSchema,
        };
        const elementContent = (0, type_generator_1.typeGenerator)(elementLocatedSchema, gatheredInfo, inputInfo);
        if (elementContent) {
            elements.push(elementContent);
        }
    });
    if (!elements.length) {
        return;
    }
    const output = `(${elements.join(' & ')})`;
    if (!locatedSchema.typeName) {
        return output;
    }
    return `export type ${locatedSchema.typeName} = ${output};`;
};
exports.allOfGenerator = allOfGenerator;
