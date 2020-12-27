import { Options } from '../../Options';
import { TS, TupleTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { generateDefinitions, generateImports, generator } from './generate';

const tupleGenerator: TSGenerator<TupleTS> = {
  root: (ts: TupleTS, options: Options, location: SchemaLocation): string => {
    const references: Set<string> = new Set();
    const definition: string = tupleGenerator.definition(ts, options, location.file, references);
    const imports: string = generateImports(references);
    const definitions: string = generateDefinitions(ts, options, references);
    return `${imports}'\n\nexport ${definition}\n${definitions}`;
  },
  definition: (ts: TupleTS, options: Options, definitionId: string, references: Set<string>): string => {
    const inlined: string = tupleGenerator.inline(ts, options, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: TupleTS, options: Options, references: Set<string>): string => {
    const elementTypes: string[] = ts.elementTypes
      .map((ts: TS) => generator(ts.tsType))
      /* eslint-disable @typescript-eslint/no-explicit-any */
      .map((generator: TSGenerator<any>) => generator.inline(ts, options, references))
      .filter((_) => _ !== undefined);
    const joined: string = elementTypes.join(', ');
    return `[${joined}]`;
  }
};

export {
  tupleGenerator
};
