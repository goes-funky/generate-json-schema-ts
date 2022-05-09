import { Schema } from '../schema';
import { classify, underscore } from '../util';
import { LocatedSchema, TypeGenerator } from './TypeGenerator';

const enumGenerator: TypeGenerator = (locatedSchema: LocatedSchema): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.enum || schema.enum.size === 0) {
    return undefined;
  }

  if (!schema.type || schema.type.size != 1 || !schema.type.has('string')) {
    throw new Error('Only enums with type string are supported');
  }

  if (locatedSchema.typeName) {
    const values = Array.from(schema.enum).map((primitive) => `${getEnumKey(primitive as string)} = '${primitive}'`);
    const output = `{${values.join(', ')}}`;

    return `export enum ${locatedSchema.typeName} ${output};\n`;
  }

  const values = Array.from(schema.enum).map((primitive) => `'${primitive}'`);
  const output = values.join(' | ');
  return `(${output})`;
};

const getEnumKey = (str: string): string => {
  const specialCharacterLabel = specialCharacterEnumLabel[str];
  return specialCharacterLabel ? normalize(specialCharacterLabel) : normalize(str);
};

const normalize = (str: string): string => {
  str = str.replace(/[(\[\]{}()<>.]/g, '_');
  return classify(underscore(str));
};

const specialCharacterEnumLabel: Record<string, string> = {
  '!': 'IsNot',
  '=': 'Equals',
  '-': 'Between',
  '<': 'LessThan',
  '>': 'GreaterThan',
  '_%': 'StartsWith',
  '%_': 'EndsWith',
  '%_%': 'Contains',
  '!%_%': 'NotContains',
};

export { enumGenerator };
