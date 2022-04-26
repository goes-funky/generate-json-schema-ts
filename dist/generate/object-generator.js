"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectGenerator = void 0;
var options_1 = require("../options");
var type_generator_1 = require("./type-generator");
var objectGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('object') || !(schema.properties || schema.additionalProperties)) {
        return undefined;
    }
    var lines = [];
    lines.push('{');
    if (schema.properties) {
        schema.properties.forEach(function (propertySchema, name) {
            var propertyLocatedSchema = {
                fileLocation: locatedSchema.fileLocation,
                schema: propertySchema
            };
            var type = type_generator_1.typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
            if (type) {
                var isRequired = ((schema.required !== undefined) && schema.required.has(name));
                var isQuestion = (!isRequired && inputInfo.options.ts.optionalFields == options_1.OptionalFieldPattern.QUESTION);
                var isPipeUndefined = (!isRequired && inputInfo.options.ts.optionalFields == options_1.OptionalFieldPattern.PIPE_UNDEFINED);
                var lineParts = [];
                lineParts.push(name);
                if (isQuestion) {
                    lineParts.push('?');
                }
                lineParts.push(": " + type);
                if (isPipeUndefined) {
                    lineParts.push(' | undefined');
                }
                lineParts.push(';');
                lines.push(lineParts.join(''));
            }
        });
    }
    if (schema.additionalProperties === false) {
        lines.push('}');
    }
    else {
        var lastLineParts = [];
        lastLineParts.push('} & Record<string, ');
        var valueType = (schema.additionalProperties)
            ? type_generator_1.typeGenerator({ fileLocation: locatedSchema.fileLocation, schema: schema.additionalProperties }, gatheredInfo, inputInfo)
            : undefined;
        if (valueType) {
            lastLineParts.push(valueType);
        }
        else {
            lastLineParts.push(inputInfo.options.ts.untyped);
        }
        lastLineParts.push('>');
        lines.push(lastLineParts.join(''));
    }
    return lines.join('\n');
};
exports.objectGenerator = objectGenerator;
