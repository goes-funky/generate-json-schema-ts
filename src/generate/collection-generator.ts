import { Schema } from "../schema";
import {
  LocatedSchema,
  SchemaGatheredInfo,
  SchemaInputInfo,
  TypeGenerator,
} from "./TypeGenerator";
import { typeGenerator } from "./type-generator";

const collectionGenerator: TypeGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo
): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (
    !schema.type ||
    !schema.type.has("array") ||
    !schema.items ||
    Array.isArray(schema.items)
  ) {
    return;
  }

  const itemsLocatedSchema: LocatedSchema = {
    fileLocation: locatedSchema.fileLocation,
    schema: schema.items,
  };
  const elementType = typeGenerator(
    itemsLocatedSchema,
    gatheredInfo,
    inputInfo
  );
  if (!elementType) {
    throw new Error(`invalid items`);
  }

  const output = schema.uniqueItems
    ? `Set<${elementType}>`
    : `${elementType}[]`;

  if (locatedSchema.typeName) {
    return `export type ${locatedSchema.typeName} = ${output};`;
  }

  return output;
};

export { collectionGenerator };
