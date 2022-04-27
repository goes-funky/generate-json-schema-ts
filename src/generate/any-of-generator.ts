import { Schema } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const anyOfGenerator: TypeGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo,
): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.anyOf || schema.anyOf.length === 0) {
    return;
  }

  const elements: string[] = [];
  schema.anyOf.forEach((elementSchema: Schema) => {
    const elementLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: elementSchema,
    };
    const elementContent = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);

    if (elementContent) {
      elements.push(elementContent);
    }
  });

  if (!elements.length) {
    return;
  }

  const output = `(${elements.join(' | ')})`;

  if (locatedSchema.typeName) {
    return `export type ${locatedSchema.typeName} = ${output};`;
  }

  return output;
};

export { anyOfGenerator };
