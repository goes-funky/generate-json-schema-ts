"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceGenerator = void 0;
var referenceGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var schema = locatedSchema.schema;
    var ref = schema.$ref;
    if (!ref) {
        return;
    }
    var localRef = createLocalRef(ref);
    if (localRef) {
        return localRef;
    }
    var fullRef = createFullRef(ref, gatheredInfo, inputInfo);
    if (fullRef) {
        return fullRef;
    }
    var relativeRef = createRelativeRef(locatedSchema.fileLocation, ref, gatheredInfo, inputInfo);
    if (relativeRef) {
        return relativeRef;
    }
    throw new Error("invalid $ref: " + ref);
};
exports.referenceGenerator = referenceGenerator;
var createLocalRef = function (ref) {
    var refNameMatch = ref.match(/^#?(?:\/definitions)?\/(.*)$/);
    if (!refNameMatch) {
        return undefined;
    }
    return refNameMatch[1];
};
var createFullRef = function (ref, gatheredInfo, inputInfo) {
    var fileLocation = inputInfo.idFileLocations.get(ref);
    if (fileLocation) {
        addExternalReference(gatheredInfo.references, fileLocation);
        return fileLocation.fileName;
    }
    for (var _i = 0, _a = Array.from(inputInfo.idFileLocations); _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], idFileLocation = _b[1];
        if (ref.startsWith(id)) {
            var rest = id.endsWith("#")
                ? ref.substring(id.length - 1)
                : ref.substring(id.length);
            var innerRef = createLocalRef(rest);
            if (innerRef) {
                addExternalReference(gatheredInfo.references, idFileLocation, innerRef);
            }
            return innerRef;
        }
    }
    return undefined;
};
var createRelativeRef = function (fileLocation, ref, gatheredInfo, inputInfo) {
    for (var _i = 0, _a = Array.from(inputInfo.idFileLocations.values()); _i < _a.length; _i++) {
        var idFileLocation = _a[_i];
        if (fileLocation.dir === idFileLocation.dir) {
            if (ref.startsWith(idFileLocation.fileName)) {
                var rest = ref.substring(idFileLocation.fileName.length);
                if (rest === "" || rest === "#") {
                    addExternalReference(gatheredInfo.references, idFileLocation);
                    return idFileLocation.fileName;
                }
                var innerRef = createLocalRef(rest);
                if (innerRef) {
                    addExternalReference(gatheredInfo.references, idFileLocation, innerRef);
                    return innerRef;
                }
            }
        }
    }
    return;
};
var addExternalReference = function (references, fileLocation, importName) {
    var importNames = references.schema.get(fileLocation);
    if (!importNames) {
        importNames = new Set();
        references.schema.set(fileLocation, importNames);
    }
    importNames.add(importName || fileLocation.fileName);
};
