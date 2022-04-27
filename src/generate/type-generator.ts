import { allOfGenerator } from "./all-of-generator";
import { anyOfGenerator } from "./any-of-generator";
import { basicGenerator } from "./basic-generator";
import { constantGenerator } from "./constant-generator";
import { enumGenerator } from "./enum-generator";
import { oneOfGenerator } from "./one-of-generator";
import { referenceGenerator } from "./reference-generator";
import {
  LocatedSchema,
  SchemaGatheredInfo,
  SchemaInputInfo,
  TypeGenerator,
} from "./TypeGenerator";

const generators: TypeGenerator[] = [
  constantGenerator,
  referenceGenerator,
  enumGenerator,
  basicGenerator,
  allOfGenerator,
  anyOfGenerator,
  oneOfGenerator,
];

const typeGenerator: TypeGenerator = (
  locatedSchema: LocatedSchema,
  gatheredInfo: SchemaGatheredInfo,
  inputInfo: SchemaInputInfo
): string | undefined => {
  for (var generator of generators) {
    const output = generator(locatedSchema, gatheredInfo, inputInfo);
    if (output) {
      return output;
    }
  }

  return "unknown";
};

export { typeGenerator };
