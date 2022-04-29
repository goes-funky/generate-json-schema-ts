import { OptionalFieldPattern } from '../options';
import { Schema } from '../schema';
import { typeGenerator } from './type-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const objectGenerator: TypeGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo,
): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.type || !schema.type.has('object')) {
    return;
  }

  try {
    const properties = propertiesGenerator(locatedSchema, gatheredInfo, inputInfo);

    const output = properties.join('; ');

    if (locatedSchema.typeName) {
      return `export class ${locatedSchema.typeName} {${output}};\n`;
    }

    return `{${output}}`;
  } catch (err) {
    throw new Error(`generate object ${JSON.stringify(locatedSchema)}: ${err}`);
  }
};

const propertiesGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo,
): string[] => {
  const schema = locatedSchema.schema;
  const hasProperties = schema.properties && schema.properties.size;
  if (!schema || (!hasProperties && !schema.additionalProperties)) {
    return [];
  }

  const properties: string[] = [];

  if (schema.properties) {
    schema.properties.forEach((propertySchema, name) => {
      const output = propertyGenerator(locatedSchema, gatheredInfo, inputInfo, name, propertySchema);
      if (output) {
        properties.push(output);
      }
    });
  }

  if (schema.additionalProperties) {
    const propertyLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: schema.additionalProperties,
    };

    const type = typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
    if (!type) {
      throw new Error('unsupported type for additionalProperties');
    }

    properties.push(`[key: string]: ${type}`);
  }

  return properties;
};

const propertyGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo,
  name: string,
  propertySchema: Schema,
): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.type) {
    return;
  }

  const propertyLocatedSchema: LocatedSchema = {
    fileLocation: locatedSchema.fileLocation,
    schema: propertySchema,
  };

  const type: string | undefined = typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
  if (!type) {
    throw new Error(`unable to generate type for property ${name}`);
  }

  const safeName = name.includes('-') ? `'${name}'` : name;

  if (schema.required && schema.required.has(name)) {
    return `${safeName}: ${type}`;
  }

  switch (inputInfo.options.ts.optionalFields) {
    case OptionalFieldPattern.QUESTION:
      return `${safeName}?: ${type}`;
    case OptionalFieldPattern.PIPE_UNDEFINED:
      return `${safeName}: ${type} | undefined`;
  }
};

export { objectGenerator };
