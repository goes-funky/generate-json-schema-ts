import { Options } from '.';
import { clean, read, write } from './files';
import { generate } from './generate';
import { AllOptions, createOptions } from './options';
import { parse } from './schema';

const main = (options: Options): Promise<void> => {
  const allOptions: AllOptions = createOptions(options);
  return (
    Promise.resolve()
      // TODO source files exist if required
      .then(() => clean(allOptions))
      .then(() => read(allOptions))
      .then((fileContents) => parse(fileContents))
      .then((fileSchemas) => generate(fileSchemas, allOptions))
      // TODO check no extant files or can overwrite
      .then((filesContent) => write(filesContent, allOptions))
      .catch(console.error)
  );
};

export { main };
