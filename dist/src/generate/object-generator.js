"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectGenerator = void 0;
const options_1 = require("../options");
const type_generator_1 = require("./type-generator");
const objectGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    if (!schema.type || !schema.type.has('object')) {
        return;
    }
    try {
        const properties = propertiesGenerator(locatedSchema, gatheredInfo, inputInfo);
        const output = properties.join('; ');
        const classOrInterface = locatedSchema.isTopLevelSchema ? 'class' : 'interface';
        if (locatedSchema.typeName) {
            return `export ${classOrInterface} ${locatedSchema.typeName} {${output}};\n`;
        }
        return `{${output}}`;
    }
    catch (err) {
        throw new Error(`generate object ${JSON.stringify(locatedSchema)}: ${err}`);
    }
};
exports.objectGenerator = objectGenerator;
const propertiesGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    const hasProperties = schema.properties && schema.properties.size;
    if (!schema || (!hasProperties && !schema.additionalProperties)) {
        return [];
    }
    const properties = [];
    if (schema.properties) {
        schema.properties.forEach((propertySchema, name) => {
            const output = propertyGenerator(locatedSchema, gatheredInfo, inputInfo, name, propertySchema);
            if (output) {
                properties.push(output);
            }
        });
    }
    if (schema.additionalProperties) {
        const propertyLocatedSchema = {
            fileLocation: locatedSchema.fileLocation,
            schema: schema.additionalProperties,
        };
        const type = (0, type_generator_1.typeGenerator)(propertyLocatedSchema, gatheredInfo, inputInfo);
        if (!type) {
            throw new Error('unsupported type for additionalProperties');
        }
        properties.push(`[key: string]: ${type}`);
    }
    return properties;
};
const propertyGenerator = (locatedSchema, gatheredInfo, inputInfo, name, propertySchema) => {
    const schema = locatedSchema.schema;
    if (!schema.type) {
        return;
    }
    const propertyLocatedSchema = {
        fileLocation: locatedSchema.fileLocation,
        schema: propertySchema,
    };
    const type = (0, type_generator_1.typeGenerator)(propertyLocatedSchema, gatheredInfo, inputInfo);
    if (!type) {
        throw new Error(`unable to generate type for property ${name}`);
    }
    const safeName = name.includes('-') ? `'${name}'` : name;
    if (schema.required && schema.required.has(name)) {
        return `${safeName}: ${type}`;
    }
    switch (inputInfo.options.ts.optionalFields) {
        case options_1.OptionalFieldPattern.QUESTION:
            return `${safeName}?: ${type}`;
        case options_1.OptionalFieldPattern.PIPE_UNDEFINED:
            return `${safeName}: ${type} | undefined`;
    }
};
