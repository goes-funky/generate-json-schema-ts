"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicGenerator = void 0;
var collection_generator_1 = require("./collection-generator");
var object_generator_1 = require("./object-generator");
var tuple_generator_1 = require("./tuple-generator");
var primitiveTypes = new Map(Object.entries({
    null: "null",
    boolean: "boolean",
    integer: "number",
    number: "number",
    string: "string",
}));
var primitiveGenerator = function (locatedSchema) {
    var schemaTypes = locatedSchema.schema.type;
    if (!schemaTypes || schemaTypes.size === 0) {
        return undefined;
    }
    var tsTypesSet = new Set();
    for (var _i = 0, _a = Array.from(schemaTypes); _i < _a.length; _i++) {
        var schemaType = _a[_i];
        var tsType = primitiveTypes.get(schemaType);
        if (tsType) {
            tsTypesSet.add(tsType);
        }
    }
    if (!tsTypesSet.size) {
        return;
    }
    var tsTypes = Array.from(tsTypesSet);
    if (tsTypes.length == 1) {
        return tsTypes[0];
    }
    return "(" + tsTypes.join(" | ") + ")";
};
var generators = [
    collection_generator_1.collectionGenerator,
    tuple_generator_1.tupleGenerator,
    object_generator_1.objectGenerator,
];
var basicGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schemaTypes = locatedSchema.schema.type;
    if (!schemaTypes || schemaTypes.size === 0) {
        return;
    }
    var tsTypesSet = new Set();
    for (var _i = 0, generators_1 = generators; _i < generators_1.length; _i++) {
        var generator = generators_1[_i];
        var output = generator(locatedSchema, gatheredInfo, inputInfo);
        if (output) {
            tsTypesSet.add(output);
        }
    }
    if (!tsTypesSet.size) {
        var output = primitiveGenerator(locatedSchema, gatheredInfo, inputInfo);
        if (output) {
            tsTypesSet.add(output);
        }
    }
    if (!tsTypesSet.size) {
        return;
    }
    var tsTypes = Array.from(tsTypesSet);
    if (tsTypes.length == 1) {
        return tsTypes[0];
    }
    return tsTypes.join(" | ");
};
exports.basicGenerator = basicGenerator;
