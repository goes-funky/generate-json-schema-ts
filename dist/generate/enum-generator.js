"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumGenerator = void 0;
var enumGenerator = function (locatedSchema) {
    var schema = locatedSchema.schema;
    if (!schema.enum || schema.enum.size === 0) {
        return undefined;
    }
    var enumTypes = [];
    schema.enum.forEach(function (primitive) {
        var value = (typeof primitive === 'string')
            ? "'" + primitive + "'"
            : "" + primitive;
        enumTypes.push(value);
    });
    var combined = enumTypes.join(' | ');
    return (schema.enum.size === 1)
        ? combined
        : "(" + combined + ")";
};
exports.enumGenerator = enumGenerator;
