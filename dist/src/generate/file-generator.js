"use strict";
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
const path = __importStar(require("path"));
const util_1 = require("../util");
const strings_1 = require("../util/strings");
const OneOf_generator_1 = require("./OneOf-generator");
const type_generator_1 = require("./type-generator");
const fileGenerator = (locatedSchema, inputInfo) => {
    try {
        const header = `// Code generated from ${locatedSchema.fileLocation.fileName} DO NOT EDIT.`;
        const references = {
            schema: new Map(),
        };
        const gatheredInfo = {
            namedSchemas: new Map(),
            references,
            oneOfTypes: new Set(),
        };
        const schemaContent = schemaContentGenerator(locatedSchema, gatheredInfo, inputInfo);
        const definitions = mapGenerator(locatedSchema.fileLocation, locatedSchema.schema.definitions, gatheredInfo, inputInfo);
        const named = namedGenerator(locatedSchema.fileLocation, gatheredInfo, inputInfo);
        const imports = importsGenerator(locatedSchema.fileLocation, references);
        const oneOfs = oneOfTypesGenerator(gatheredInfo.oneOfTypes);
        return (0, util_1.filteredJoin)([header, imports, schemaContent, named, definitions, oneOfs], '\n\n') + '\n';
    }
    catch (err) {
        throw new Error(`fileGenerator: ${locatedSchema.fileLocation.dir}/${locatedSchema.fileLocation.fileName}: ${err}`);
    }
};
exports.fileGenerator = fileGenerator;
const schemaContentGenerator = (locatedSchema, gatheredInfo, inputInfo, schemaName) => {
    const typeName = typeNameGenerator(schemaName || locatedSchema.fileLocation.fileName);
    const output = (0, type_generator_1.typeGenerator)({
        ...locatedSchema,
        typeName: typeName,
    }, gatheredInfo, inputInfo);
    if (output == 'unknown') {
        return;
    }
    return output;
};
const importsGenerator = (fileLocation, references) => {
    if (references.schema.size === 0) {
        return undefined;
    }
    const content = [];
    content.push(importMapGenerator(fileLocation, references.schema));
    const defined = (0, util_1.filtered)(content);
    return defined.join('\n');
};
const importMapGenerator = (fileLocation, references) => {
    if (references.size === 0) {
        return undefined;
    }
    const imports = [];
    references.forEach((names, referenceFileLocation) => {
        if (names.size > 0) {
            const combinedNames = Array.from(names).sort().join(', ');
            const importPath = tsPathGenerator(path.normalize(path.relative(fileLocation.dir, referenceFileLocation.dir)));
            const file = referenceFileLocation.fileName.length === 0 ? '' : `/${referenceFileLocation.fileName}`;
            imports.push(`import { ${combinedNames} } from '${importPath}${file}';`);
        }
    });
    return imports.join('\n');
};
const namedGenerator = (fileLocation, gatheredInfo, inputInfo) => {
    if (gatheredInfo.namedSchemas.size === 0) {
        return undefined;
    }
    const content = [];
    /* eslint-disable no-constant-condition */
    while (true) {
        const map = gatheredInfo.namedSchemas;
        gatheredInfo = {
            ...gatheredInfo,
            namedSchemas: new Map(),
        };
        const mapContent = mapGenerator(fileLocation, map, gatheredInfo, inputInfo);
        if (mapContent) {
            content.push(mapContent);
        }
        else {
            return content.length === 0 ? undefined : content.join('\n');
        }
    }
};
const oneOfTypesGenerator = (typeCounts) => {
    if (typeCounts.size === 0) {
        return undefined;
    }
    const oneOfTypeLines = [];
    typeCounts.forEach((typeCount) => {
        const oneOfType = (0, OneOf_generator_1.OneOfNGenerator)(typeCount);
        if (oneOfType) {
            oneOfTypeLines.push(oneOfType);
        }
    });
    return oneOfTypeLines.join('\n');
};
const mapGenerator = (fileLocation, map, gatheredInfo, inputInfo) => {
    if (!map || map.size === 0) {
        return undefined;
    }
    const content = [];
    map.forEach((namedSchema, name) => {
        const namedLocatedSchema = {
            fileLocation,
            schema: namedSchema,
        };
        const schemaContent = schemaContentGenerator(namedLocatedSchema, gatheredInfo, inputInfo, name);
        if (schemaContent) {
            content.push(schemaContent);
        }
    });
    return content.join('\n');
};
const typeNameGenerator = (fileName) => {
    return (0, strings_1.classify)(fileName);
    // const usableChars: string = fileName.replace(/[^a-zA-Z0-9_]/g, "");
    // return usableChars.length > 0 && usableChars.match(/^[a-zA-Z_]/)
    //   ? usableChars
    //   : "_" + usableChars;
};
const tsPathGenerator = (relativePath) => relativePath.startsWith('.') ? relativePath : '.' + path.sep + relativePath;
