"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tupleGenerator = void 0;
var type_generator_1 = require("./type-generator");
var tupleGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('array') || !schema.items || !Array.isArray(schema.items)) {
        return undefined;
    }
    var elementTypesContent = [];
    schema.items.forEach(function (elementSchema) {
        var elementLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: elementSchema
        };
        var content = type_generator_1.typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
        if (content) {
            elementTypesContent.push(content);
        }
    });
    if (schema.additionalItems !== false) {
        var lastTypeParts = [];
        lastTypeParts.push('...');
        var valueType = (schema.additionalItems)
            ? type_generator_1.typeGenerator({ fileLocation: locatedSchema.fileLocation, schema: schema.additionalItems }, gatheredInfo, inputInfo)
            : undefined;
        if (valueType) {
            lastTypeParts.push(valueType);
        }
        else {
            lastTypeParts.push(inputInfo.options.ts.untyped);
        }
        lastTypeParts.push('[]');
        elementTypesContent.push(lastTypeParts.join(''));
    }
    var joined = elementTypesContent.join(', ');
    return "[" + joined + "]";
};
exports.tupleGenerator = tupleGenerator;
