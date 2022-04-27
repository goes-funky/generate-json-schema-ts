"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectGenerator = void 0;
var options_1 = require("../options");
var type_generator_1 = require("./type-generator");
var objectGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('object')) {
        return;
    }
    try {
        var properties = propertiesGenerator(locatedSchema, gatheredInfo, inputInfo);
        var output = properties.join('; ');
        if (locatedSchema.typeName) {
            return "export class " + locatedSchema.typeName + " {" + output + "};\n";
        }
        return "{" + output + "}";
    }
    catch (err) {
        throw new Error("generate object " + JSON.stringify(locatedSchema) + ": " + err);
    }
};
exports.objectGenerator = objectGenerator;
var propertiesGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    var hasProperties = schema.properties && schema.properties.size;
    if (!schema || (!hasProperties && !schema.additionalProperties)) {
        return [];
    }
    var properties = [];
    if (schema.properties) {
        schema.properties.forEach(function (propertySchema, name) {
            var output = propertyGenerator(locatedSchema, gatheredInfo, inputInfo, name, propertySchema);
            if (output) {
                properties.push(output);
            }
        });
    }
    if (schema.additionalProperties) {
        var propertyLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: schema.additionalProperties,
        };
        var type = type_generator_1.typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
        if (!type) {
            throw new Error("unsupported type for additionalProperties");
        }
        properties.push("[key: string]: " + type);
    }
    return properties;
};
var propertyGenerator = function (locatedSchema, gatheredInfo, inputInfo, name, propertySchema) {
    var schema = locatedSchema.schema;
    if (!schema.type) {
        return;
    }
    var propertyLocatedSchema = {
        fileLocation: locatedSchema.fileLocation,
        schema: propertySchema,
    };
    var type = type_generator_1.typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
    if (!type) {
        throw new Error("unable to generate type for property " + name);
    }
    if (schema.required && schema.required.has(name)) {
        return "'" + name + "': " + type;
    }
    switch (inputInfo.options.ts.optionalFields) {
        case options_1.OptionalFieldPattern.QUESTION:
            return "'" + name + "'?: " + type;
        case options_1.OptionalFieldPattern.PIPE_UNDEFINED:
            return "'" + name + "': " + type + " | undefined";
    }
};
