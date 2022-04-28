"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tupleGenerator = void 0;
const type_generator_1 = require("./type-generator");
const tupleGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('array') || !schema.items || !Array.isArray(schema.items)) {
        return undefined;
    }
    const elementTypesContent = [];
    schema.items.forEach((elementSchema) => {
        const elementLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: elementSchema,
        };
        const content = (0, type_generator_1.typeGenerator)(elementLocatedSchema, gatheredInfo, inputInfo);
        if (content) {
            elementTypesContent.push(content);
        }
    });
    if (schema.additionalItems !== false) {
        const lastTypeParts = [];
        lastTypeParts.push('...');
        const valueType = schema.additionalItems
            ? (0, type_generator_1.typeGenerator)({
                fileLocation: locatedSchema.fileLocation,
                schema: schema.additionalItems,
            }, gatheredInfo, inputInfo)
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
    const joined = elementTypesContent.join(', ');
    return `[${joined}]`;
};
exports.tupleGenerator = tupleGenerator;
