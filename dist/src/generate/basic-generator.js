"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicGenerator = void 0;
const collection_generator_1 = require("./collection-generator");
const object_generator_1 = require("./object-generator");
const tuple_generator_1 = require("./tuple-generator");
const primitiveTypes = new Map(Object.entries({
    null: 'null',
    boolean: 'boolean',
    integer: 'number',
    number: 'number',
    string: 'string',
}));
const primitiveGenerator = (locatedSchema) => {
    const schemaTypes = locatedSchema.schema.type;
    if (!schemaTypes || schemaTypes.size === 0) {
        return undefined;
    }
    const tsTypesSet = new Set();
    for (const schemaType of Array.from(schemaTypes)) {
        const tsType = primitiveTypes.get(schemaType);
        if (tsType) {
            tsTypesSet.add(tsType);
        }
    }
    if (!tsTypesSet.size) {
        return;
    }
    const tsTypes = Array.from(tsTypesSet);
    if (tsTypes.length == 1) {
        return tsTypes[0];
    }
    return `(${tsTypes.join(' | ')})`;
};
const generators = [collection_generator_1.collectionGenerator, tuple_generator_1.tupleGenerator, object_generator_1.objectGenerator];
const basicGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schemaTypes = locatedSchema.schema.type;
    if (!schemaTypes || schemaTypes.size === 0) {
        return;
    }
    const tsTypesSet = new Set();
    for (const generator of generators) {
        const output = generator(locatedSchema, gatheredInfo, inputInfo);
        if (output) {
            tsTypesSet.add(output);
        }
    }
    // no complex type found, fallback on primitiveGenerator
    if (!tsTypesSet.size) {
        const output = primitiveGenerator(locatedSchema, gatheredInfo, inputInfo);
        if (output) {
            tsTypesSet.add(output);
        }
    }
    if (!tsTypesSet.size) {
        return;
    }
    const tsTypes = Array.from(tsTypesSet);
    if (tsTypes.length == 1) {
        return tsTypes[0];
    }
    return tsTypes.join(' | ');
};
exports.basicGenerator = basicGenerator;
