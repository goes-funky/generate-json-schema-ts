import { Schema } from '.';
import { FileLocation } from '../files';
declare const parse: (files: Map<FileLocation, string>) => Map<FileLocation, Schema>;
export { parse };
