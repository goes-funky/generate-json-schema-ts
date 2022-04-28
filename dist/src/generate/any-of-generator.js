"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyOfGenerator = void 0;
const type_generator_1 = require("./type-generator");
const anyOfGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    if (!schema.anyOf || schema.anyOf.length === 0) {
        return;
    }
    const elements = [];
    schema.anyOf.forEach((elementSchema) => {
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
    const output = `(${elements.join(' | ')})`;
    if (locatedSchema.typeName) {
        return `export type ${locatedSchema.typeName} = ${output};`;
    }
    return output;
};
exports.anyOfGenerator = anyOfGenerator;
