"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOfGenerator = void 0;
const util_1 = require("../util");
const type_generator_1 = require("./type-generator");
const oneOfGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    if (!schema.oneOf || schema.oneOf.length === 0) {
        return undefined;
    }
    const lines = [];
    schema.oneOf.forEach((elementSchema) => {
        const elementLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: elementSchema,
        };
        const elementContent = (0, type_generator_1.typeGenerator)(elementLocatedSchema, gatheredInfo, inputInfo);
        lines.push(elementContent);
    });
    const filteredLines = (0, util_1.filtered)(lines);
    if (filteredLines.length === 0) {
        return undefined;
    }
    else if (filteredLines.length === 1) {
        return filteredLines[0];
    }
    else {
        gatheredInfo.oneOfTypes.add(filteredLines.length);
        const typeName = `OneOf_${filteredLines.length}`;
        const combinedTypeNames = filteredLines.join(', ');
        return `${typeName}<${combinedTypeNames}>`;
    }
};
exports.oneOfGenerator = oneOfGenerator;
