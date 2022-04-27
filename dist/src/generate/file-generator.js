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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileGenerator = void 0;
var path = __importStar(require("path"));
var util_1 = require("../util");
var strings_1 = require("../util/strings");
var OneOf_generator_1 = require("./OneOf-generator");
var type_generator_1 = require("./type-generator");
var fileGenerator = function (locatedSchema, inputInfo) {
    try {
        var header = "// Code generated from " + locatedSchema.fileLocation.fileName + " DO NOT EDIT.";
        var references = {
            schema: new Map(),
        };
        var gatheredInfo = {
            namedSchemas: new Map(),
            references: references,
            oneOfTypes: new Set(),
        };
        var schemaContent = schemaContentGenerator(locatedSchema, gatheredInfo, inputInfo);
        var definitions = mapGenerator(locatedSchema.fileLocation, locatedSchema.schema.definitions, gatheredInfo, inputInfo);
        var named = namedGenerator(locatedSchema.fileLocation, gatheredInfo, inputInfo);
        var imports = importsGenerator(locatedSchema.fileLocation, references);
        var oneOfs = oneOfTypesGenerator(gatheredInfo.oneOfTypes);
        return (util_1.filteredJoin([header, imports, schemaContent, named, definitions, oneOfs], '\n\n') + '\n');
    }
    catch (err) {
        throw new Error("fileGenerator: " + locatedSchema.fileLocation.dir + "/" + locatedSchema.fileLocation.fileName + ": " + err);
    }
};
exports.fileGenerator = fileGenerator;
var schemaContentGenerator = function (locatedSchema, gatheredInfo, inputInfo, schemaName) {
    var typeName = typeNameGenerator(schemaName || locatedSchema.fileLocation.fileName);
    var output = type_generator_1.typeGenerator(__assign(__assign({}, locatedSchema), { typeName: typeName }), gatheredInfo, inputInfo);
    if (output == 'unknown') {
        return;
    }
    return output;
};
var importsGenerator = function (fileLocation, references) {
    if (references.schema.size === 0) {
        return undefined;
    }
    var content = [];
    content.push(importMapGenerator(fileLocation, references.schema));
    var defined = util_1.filtered(content);
    return defined.join('\n');
};
var importMapGenerator = function (fileLocation, references) {
    if (references.size === 0) {
        return undefined;
    }
    var imports = [];
    references.forEach(function (names, referenceFileLocation) {
        if (names.size > 0) {
            var combinedNames = Array.from(names).sort().join(', ');
            var importPath = tsPathGenerator(path.normalize(path.relative(fileLocation.dir, referenceFileLocation.dir)));
            var file = referenceFileLocation.fileName.length === 0 ? '' : "/" + referenceFileLocation.fileName;
            imports.push("import { " + combinedNames + " } from '" + importPath + file + "';");
        }
    });
    return imports.join('\n');
};
var namedGenerator = function (fileLocation, gatheredInfo, inputInfo) {
    if (gatheredInfo.namedSchemas.size === 0) {
        return undefined;
    }
    var content = [];
    while (true) {
        var map = gatheredInfo.namedSchemas;
        gatheredInfo = __assign(__assign({}, gatheredInfo), { namedSchemas: new Map() });
        var mapContent = mapGenerator(fileLocation, map, gatheredInfo, inputInfo);
        if (mapContent) {
            content.push(mapContent);
        }
        else {
            return content.length === 0 ? undefined : content.join('\n');
        }
    }
};
var oneOfTypesGenerator = function (typeCounts) {
    if (typeCounts.size === 0) {
        return undefined;
    }
    var oneOfTypeLines = [];
    typeCounts.forEach(function (typeCount) {
        var oneOfType = OneOf_generator_1.OneOfNGenerator(typeCount);
        if (oneOfType) {
            oneOfTypeLines.push(oneOfType);
        }
    });
    return oneOfTypeLines.join('\n');
};
var mapGenerator = function (fileLocation, map, gatheredInfo, inputInfo) {
    if (!map || map.size === 0) {
        return undefined;
    }
    var content = [];
    map.forEach(function (namedSchema, name) {
        var namedLocatedSchema = {
            fileLocation: fileLocation,
            schema: namedSchema,
        };
        var schemaContent = schemaContentGenerator(namedLocatedSchema, gatheredInfo, inputInfo, name);
        if (schemaContent) {
            content.push(schemaContent);
        }
    });
    return content.join('\n');
};
var typeNameGenerator = function (fileName) {
    return strings_1.classify(fileName);
};
var tsPathGenerator = function (relativePath) {
    return relativePath.startsWith('.') ? relativePath : '.' + path.sep + relativePath;
};
