"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parse = (files) => {
    const schemas = new Map();
    files.forEach((content, fileLocation) => {
        const rawSchema = JSON.parse(content);
        const schema = parseSchema(rawSchema);
        schemas.set(fileLocation, schema);
    });
    return schemas;
};
exports.parse = parse;
const parseSchema = (rawSchema) => {
    const type = parseType(rawSchema.type);
    const _enum = parseEnum(rawSchema.enum);
    const items = parseItems(rawSchema.items);
    const additionalItems = parseAdditional(rawSchema.additionalItems);
    const allOf = parseArray(rawSchema.allOf);
    const anyOf = parseArray(rawSchema.anyOf);
    const oneOf = parseArray(rawSchema.oneOf);
    const properties = parseRecord(rawSchema.properties);
    const additionalProperties = parseAdditional(rawSchema.additionalProperties);
    const required = parseRequired(rawSchema.required);
    const defs = parseRecord(rawSchema.$defs);
    const definitions = parseRecord(rawSchema.definitions);
    if (defs && definitions) {
        defs?.forEach((schema, key) => {
            definitions?.set(key, schema);
        });
    }
    return {
        ...rawSchema,
        type,
        enum: _enum,
        items,
        additionalItems,
        allOf,
        anyOf,
        oneOf,
        properties,
        additionalProperties,
        required,
        definitions: definitions ? definitions : defs,
    };
};
const parseType = (type) => {
    if (!type) {
        return undefined;
    }
    if (typeof type === 'string') {
        const set = new Set();
        set.add(type);
        return set;
    }
    else {
        return new Set(type);
    }
};
const parseEnum = (_enum) => {
    if (!_enum) {
        return undefined;
    }
    return new Set(_enum);
};
const parseItems = (items) => {
    if (!items) {
        return undefined;
    }
    if (Array.isArray(items)) {
        return items.map(parseSchema);
    }
    return parseSchema(items);
};
const parseAdditional = (additional) => {
    if (!additional) {
        return additional;
    }
    return parseSchema(additional);
};
const parseArray = (array) => {
    if (!array) {
        return undefined;
    }
    return array.map(parseSchema);
};
const parseRecord = (record) => {
    if (!record) {
        return undefined;
    }
    const parsed = new Map();
    for (const key in record) {
        const rawSchema = record[key];
        const schema = parseSchema(rawSchema);
        parsed.set(key, schema);
    }
    return parsed;
};
const parseRequired = (required) => {
    if (!required) {
        return undefined;
    }
    return new Set(required);
};
