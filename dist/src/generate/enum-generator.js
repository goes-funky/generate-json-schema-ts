"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumGenerator = void 0;
const util_1 = require("../util");
const enumGenerator = (locatedSchema) => {
    const schema = locatedSchema.schema;
    if (!schema.enum || schema.enum.size === 0) {
        return undefined;
    }
    if (!schema.type || schema.type.size != 1 || !schema.type.has('string')) {
        throw new Error('Only enums with type string are supported');
    }
    if (locatedSchema.typeName) {
        const values = Array.from(schema.enum).map((primitive) => `${getEnumKey(primitive)} = '${primitive}'`);
        const output = `{${values.join(', ')}}`;
        return `export enum ${locatedSchema.typeName} ${output};\n`;
    }
    const values = Array.from(schema.enum).map((primitive) => `'${primitive}'`);
    const output = values.join(' | ');
    return `(${output})`;
};
exports.enumGenerator = enumGenerator;
const getEnumKey = (str) => {
    const specialCharacterLabel = specialCharacterEnumLabel[str];
    return specialCharacterLabel ? normalize(specialCharacterLabel) : normalize(str);
};
const normalize = (str) => {
    str = str.replace(/[(\[\]{}()<>.]/g, '_');
    return (0, util_1.classify)((0, util_1.underscore)(str));
};
const specialCharacterEnumLabel = {
    '!': 'IsNot',
    '=': 'Equals',
    '-': 'Between',
    '<': 'LessThan',
    '>': 'GreaterThan',
    '_%': 'StartsWith',
    '%_': 'EndsWith',
    '%_%': 'Contains',
    '!%_%': 'NotContains',
};
