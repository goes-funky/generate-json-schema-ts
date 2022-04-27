"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumGenerator = void 0;
var util_1 = require("../util");
var enumGenerator = function (locatedSchema) {
    var schema = locatedSchema.schema;
    if (!schema.enum || schema.enum.size === 0) {
        return undefined;
    }
    if (!schema.type || schema.type.size != 1 || !schema.type.has('string')) {
        throw new Error('Only enums with type string are supported');
    }
    if (locatedSchema.typeName) {
        var values_1 = Array.from(schema.enum).map(function (primitive) { return util_1.classify(primitive) + " = '" + primitive + "'"; });
        var output_1 = "{" + values_1.join(', ') + "}";
        return "export enum " + locatedSchema.typeName + " " + output_1 + ";\n";
    }
    var values = Array.from(schema.enum).map(function (primitive) { return "'" + primitive + "'"; });
    var output = values.join(' | ');
    return "(" + output + ")";
};
exports.enumGenerator = enumGenerator;
