import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
declare const generate: (fileSchemas: Map<FileLocation, Schema>, options: AllOptions) => Map<FileLocation, string>;
export { generate };
