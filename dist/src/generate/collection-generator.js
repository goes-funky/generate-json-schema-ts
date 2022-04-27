"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionGenerator = void 0;
var type_generator_1 = require("./type-generator");
var collectionGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('array') || !schema.items || Array.isArray(schema.items)) {
        return;
    }
    var itemsLocatedSchema = {
        fileLocation: locatedSchema.fileLocation,
        schema: schema.items,
    };
    var elementType = type_generator_1.typeGenerator(itemsLocatedSchema, gatheredInfo, inputInfo);
    if (!elementType) {
        throw new Error("invalid items");
    }
    var output = schema.uniqueItems ? "Set<" + elementType + ">" : elementType + "[]";
    if (locatedSchema.typeName) {
        return "export type " + locatedSchema.typeName + " = " + output + ";";
    }
    return output;
};
exports.collectionGenerator = collectionGenerator;
