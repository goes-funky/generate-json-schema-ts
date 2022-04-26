"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicGenerator = void 0;
var collection_generator_1 = require("./collection-generator");
var object_generator_1 = require("./object-generator");
var tuple_generator_1 = require("./tuple-generator");
var PRIMITIVE_TYPES = new Map();
PRIMITIVE_TYPES.set('null', 'null');
PRIMITIVE_TYPES.set('boolean', 'boolean');
PRIMITIVE_TYPES.set('integer', 'number');
PRIMITIVE_TYPES.set('number', 'number');
PRIMITIVE_TYPES.set('string', 'string');
var basicGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schemaTypes = locatedSchema.schema.type;
    if (!schemaTypes || schemaTypes.size === 0) {
        return undefined;
    }
    var tsTypesSet = new Set();
    PRIMITIVE_TYPES.forEach(function (tsType, schemaType) {
        if (schemaTypes.has(schemaType)) {
            tsTypesSet.add(tsType);
        }
    });
    var tsTypes = Array.from(tsTypesSet);
    var collectionType = collection_generator_1.collectionGenerator(locatedSchema, gatheredInfo, inputInfo);
    var tupleType = tuple_generator_1.tupleGenerator(locatedSchema, gatheredInfo, inputInfo);
    var objectType = object_generator_1.objectGenerator(locatedSchema, gatheredInfo, inputInfo);
    if (collectionType) {
        tsTypes.push(collectionType);
    }
    if (tupleType) {
        tsTypes.push(tupleType);
    }
    if (objectType) {
        tsTypes.push(objectType);
    }
    if (tsTypes.length === 0) {
        return undefined;
    }
    if (tsTypes.length === 1) {
        return tsTypes[0];
    }
    return "(" + tsTypes.join(' | ') + ")";
};
exports.basicGenerator = basicGenerator;
