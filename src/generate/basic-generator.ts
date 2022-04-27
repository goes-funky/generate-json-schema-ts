import { collectionGenerator } from './collection-generator';
import { objectGenerator } from './object-generator';
import { tupleGenerator } from './tuple-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const primitiveTypes: Map<string, string> = new Map(
  Object.entries({
    null: 'null',
    boolean: 'boolean',
    integer: 'number',
    number: 'number',
    string: 'string',
  }),
);

const primitiveGenerator: TypeGenerator = (locatedSchema: LocatedSchema): string | undefined => {
  const schemaTypes: Set<string> | undefined = locatedSchema.schema.type;
  if (!schemaTypes || schemaTypes.size === 0) {
    return undefined;
  }

  const tsTypesSet: Set<string> = new Set();
  for (const schemaType of Array.from(schemaTypes)) {
    const tsType = primitiveTypes.get(schemaType);
    if (tsType) {
      tsTypesSet.add(tsType);
    }
  }

  if (!tsTypesSet.size) {
    return;
  }

  const tsTypes = Array.from(tsTypesSet);
  if (tsTypes.length == 1) {
    return tsTypes[0];
  }

  return `(${tsTypes.join(' | ')})`;
};

const generators: TypeGenerator[] = [collectionGenerator, tupleGenerator, objectGenerator];

const basicGenerator: TypeGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo,
): string | undefined => {
  const schemaTypes: Set<string> | undefined = locatedSchema.schema.type;
  if (!schemaTypes || schemaTypes.size === 0) {
    return;
  }

  const tsTypesSet: Set<string> = new Set();
  for (const generator of generators) {
    const output = generator(locatedSchema, gatheredInfo, inputInfo);
    if (output) {
      tsTypesSet.add(output);
    }
  }

  // no complex type found, fallback on primitiveGenerator
  if (!tsTypesSet.size) {
    const output = primitiveGenerator(locatedSchema, gatheredInfo, inputInfo);
    if (output) {
      tsTypesSet.add(output);
    }
  }

  if (!tsTypesSet.size) {
    return;
  }

  const tsTypes = Array.from(tsTypesSet);

  if (tsTypes.length == 1) {
    return tsTypes[0];
  }

  return tsTypes.join(' | ');
};

export { basicGenerator };
