"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var DEFAULT_OPTIONS = {
    files: {
        source: {
            dir: 'src/schemas',
            encoding: 'utf-8',
            recursive: true
        },
        destination: {
            dir: 'src/generated',
            preClean: false,
            indexFiles: true
        }
    },
    ts: {
        optionalFields: OptionalFieldPattern.QUESTION,
        untyped: UntypedType.UNKNOWN
    }
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
var createOptions = function (options) {
    var _a, _b;
    return {
        files: __assign(__assign(__assign({}, DEFAULT_OPTIONS.files), options.files), { source: __assign(__assign({}, DEFAULT_OPTIONS.files.source), (_a = options.files) === null || _a === void 0 ? void 0 : _a.source), destination: __assign(__assign({}, DEFAULT_OPTIONS.files.destination), (_b = options.files) === null || _b === void 0 ? void 0 : _b.destination) }),
        ts: __assign(__assign({}, DEFAULT_OPTIONS.ts), options.ts)
    };
};
exports.createOptions = createOptions;
