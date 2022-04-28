"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionGenerator = void 0;
const type_generator_1 = require("./type-generator");
const collectionGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('array') || !schema.items || Array.isArray(schema.items)) {
        return;
    }
    const itemsLocatedSchema = {
        fileLocation: locatedSchema.fileLocation,
        schema: schema.items,
    };
    const elementType = (0, type_generator_1.typeGenerator)(itemsLocatedSchema, gatheredInfo, inputInfo);
    if (!elementType) {
        throw new Error(`invalid items`);
    }
    const output = schema.uniqueItems ? `Set<${elementType}>` : `${elementType}[]`;
    if (locatedSchema.typeName) {
        return `export type ${locatedSchema.typeName} = ${output};`;
    }
    return output;
};
exports.collectionGenerator = collectionGenerator;
