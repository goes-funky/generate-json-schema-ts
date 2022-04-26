import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';
declare const write: (filesContent: Map<FileLocation, string>, options: AllOptions) => Promise<void>;
export { write };
