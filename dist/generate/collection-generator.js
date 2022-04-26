"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionGenerator = void 0;
var util_1 = require("../util");
var type_generator_1 = require("./type-generator");
var collectionGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('array') || !schema.items || Array.isArray(schema.items)) {
        return undefined;
    }
    var itemsLocatedSchema = {
        fileLocation: locatedSchema.fileLocation,
        schema: schema.items
    };
    var inlinedElementType = type_generator_1.typeGenerator(itemsLocatedSchema, gatheredInfo, inputInfo);
    if (!inlinedElementType) {
        return undefined;
    }
    var isSet = schema.uniqueItems ? true : false;
    var prefix = (isSet) ? 'Set<' : undefined;
    var suffix = (isSet) ? '>' : '[]';
    return util_1.filteredJoin([prefix, inlinedElementType, suffix]);
};
exports.collectionGenerator = collectionGenerator;
