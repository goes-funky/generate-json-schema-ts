/// <reference types="node" />
import { PartialDeep } from './types';
declare enum UntypedType {
    ANY = "any",
    NEVER = "never",
    UNDEFINED = "undefined",
    UNKNOWN = "unknown"
}
declare enum OptionalFieldPattern {
    QUESTION = "fieldName?",
    PIPE_UNDEFINED = "Type | undefined"
}
interface AllOptions {
    files: {
        cwd?: string;
        source: {
            dir: string;
            encoding: BufferEncoding;
            recursive: boolean;
        };
        destination: {
            dir: string;
            preClean: boolean;
            indexFiles: boolean;
        };
    };
    ts: {
        optionalFields: OptionalFieldPattern;
        untyped: UntypedType;
    };
}
declare type Options = PartialDeep<AllOptions>;
declare const DEFAULT_OPTIONS: AllOptions;
declare const createOptions: (options: PartialDeep<AllOptions>) => AllOptions;
export { OptionalFieldPattern, UntypedType, AllOptions, Options, DEFAULT_OPTIONS, createOptions };
