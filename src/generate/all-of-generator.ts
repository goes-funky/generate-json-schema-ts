import { Schema } from '../schema';
import { typeGenerator } from './type-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const allOfGenerator: TypeGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo,
): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.allOf || schema.allOf.length === 0) {
    return undefined;
  }
  const elements: string[] = [];
  schema.allOf.forEach((elementSchema: Schema) => {
    const elementLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: elementSchema,
    };

    const elementContent: string | undefined = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);

    if (elementContent) {
      elements.push(elementContent);
    }
  });

  if (!elements.length) {
    return;
  }

  const output = `(${elements.join(' & ')})`;

  if (!locatedSchema.typeName) {
    return output;
  }

  return `export type ${locatedSchema.typeName} = ${output};`;
};

export { allOfGenerator };
