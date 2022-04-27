"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var parse = function (files) {
    var schemas = new Map();
    files.forEach(function (content, fileLocation) {
        var rawSchema = JSON.parse(content);
        var schema = parseSchema(rawSchema);
        schemas.set(fileLocation, schema);
    });
    return schemas;
};
exports.parse = parse;
var parseSchema = function (rawSchema) {
    var type = parseType(rawSchema.type);
    var _enum = parseEnum(rawSchema.enum);
    var items = parseItems(rawSchema.items);
    var additionalItems = parseAdditional(rawSchema.additionalItems);
    var allOf = parseArray(rawSchema.allOf);
    var anyOf = parseArray(rawSchema.anyOf);
    var oneOf = parseArray(rawSchema.oneOf);
    var properties = parseRecord(rawSchema.properties);
    var additionalProperties = parseAdditional(rawSchema.additionalProperties);
    var required = parseRequired(rawSchema.required);
    var defs = parseRecord(rawSchema.$defs);
    var definitions = parseRecord(rawSchema.definitions);
    if (defs && definitions) {
        defs === null || defs === void 0 ? void 0 : defs.forEach(function (schema, key) {
            definitions === null || definitions === void 0 ? void 0 : definitions.set(key, schema);
        });
    }
    return __assign(__assign({}, rawSchema), { type: type, enum: _enum, items: items,
        additionalItems: additionalItems,
        allOf: allOf,
        anyOf: anyOf,
        oneOf: oneOf,
        properties: properties,
        additionalProperties: additionalProperties,
        required: required, definitions: definitions ? definitions : defs });
};
var parseType = function (type) {
    if (!type) {
        return undefined;
    }
    if (typeof type === 'string') {
        var set = new Set();
        set.add(type);
        return set;
    }
    else {
        return new Set(type);
    }
};
var parseEnum = function (_enum) {
    if (!_enum) {
        return undefined;
    }
    return new Set(_enum);
};
var parseItems = function (items) {
    if (!items) {
        return undefined;
    }
    if (Array.isArray(items)) {
        return items.map(parseSchema);
    }
    return parseSchema(items);
};
var parseAdditional = function (additional) {
    if (!additional) {
        return additional;
    }
    return parseSchema(additional);
};
var parseArray = function (array) {
    if (!array) {
        return undefined;
    }
    return array.map(parseSchema);
};
var parseRecord = function (record) {
    if (!record) {
        return undefined;
    }
    var parsed = new Map();
    for (var key in record) {
        var rawSchema = record[key];
        var schema = parseSchema(rawSchema);
        parsed.set(key, schema);
    }
    return parsed;
};
var parseRequired = function (required) {
    if (!required) {
        return undefined;
    }
    return new Set(required);
};
