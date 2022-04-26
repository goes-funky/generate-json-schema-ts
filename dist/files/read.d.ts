import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';
declare const read: (options: AllOptions) => Promise<Map<FileLocation, string>>;
export { read };
