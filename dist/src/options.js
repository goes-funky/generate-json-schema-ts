"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOptions = exports.DEFAULT_OPTIONS = exports.UntypedType = exports.OptionalFieldPattern = void 0;
var UntypedType;
(function (UntypedType) {
    UntypedType["ANY"] = "any";
    UntypedType["NEVER"] = "never";
    UntypedType["UNDEFINED"] = "undefined";
    UntypedType["UNKNOWN"] = "unknown";
})(UntypedType || (UntypedType = {}));
exports.UntypedType = UntypedType;
var OptionalFieldPattern;
(function (OptionalFieldPattern) {
    OptionalFieldPattern["QUESTION"] = "fieldName?";
    OptionalFieldPattern["PIPE_UNDEFINED"] = "Type | undefined";
})(OptionalFieldPattern || (OptionalFieldPattern = {}));
exports.OptionalFieldPattern = OptionalFieldPattern;
const DEFAULT_OPTIONS = {
    files: {
        source: {
            dir: 'src/schemas',
            encoding: 'utf-8',
            recursive: true,
        },
        destination: {
            dir: 'src/generated',
            preClean: false,
            indexFiles: true,
        },
    },
    ts: {
        optionalFields: OptionalFieldPattern.QUESTION,
        untyped: UntypedType.UNKNOWN,
    },
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
const createOptions = (options) => {
    return {
        files: {
            ...DEFAULT_OPTIONS.files,
            ...options.files,
            source: {
                ...DEFAULT_OPTIONS.files.source,
                ...options.files?.source,
            },
            destination: {
                ...DEFAULT_OPTIONS.files.destination,
                ...options.files?.destination,
            },
        },
        ts: {
            ...DEFAULT_OPTIONS.ts,
            ...options.ts,
        },
    };
};
exports.createOptions = createOptions;
