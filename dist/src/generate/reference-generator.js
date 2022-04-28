"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceGenerator = void 0;
const referenceGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    const schema = locatedSchema.schema;
    const ref = schema.$ref;
    if (!ref) {
        return;
    }
    const localRef = createLocalRef(ref);
    if (localRef) {
        return localRef;
    }
    const fullRef = createFullRef(ref, gatheredInfo, inputInfo);
    if (fullRef) {
        return fullRef;
    }
    const relativeRef = createRelativeRef(locatedSchema.fileLocation, ref, gatheredInfo, inputInfo);
    if (relativeRef) {
        return relativeRef;
    }
    throw new Error(`invalid $ref: ${ref}`);
};
exports.referenceGenerator = referenceGenerator;
const createLocalRef = (ref) => {
    const refNameMatch = ref.match(/^#?(?:\/definitions)?\/(.*)$/);
    if (!refNameMatch) {
        return undefined;
    }
    return refNameMatch[1];
};
const createFullRef = (ref, gatheredInfo, inputInfo) => {
    // root
    const fileLocation = inputInfo.idFileLocations.get(ref);
    if (fileLocation) {
        addExternalReference(gatheredInfo.references, fileLocation);
        return fileLocation.fileName;
    }
    // inner
    for (const [id, idFileLocation] of Array.from(inputInfo.idFileLocations)) {
        if (ref.startsWith(id)) {
            const rest = id.endsWith('#') ? ref.substring(id.length - 1) : ref.substring(id.length);
            const innerRef = createLocalRef(rest);
            if (innerRef) {
                addExternalReference(gatheredInfo.references, idFileLocation, innerRef);
            }
            return innerRef;
        }
    }
    return undefined;
};
const createRelativeRef = (fileLocation, ref, gatheredInfo, inputInfo) => {
    for (const idFileLocation of Array.from(inputInfo.idFileLocations.values())) {
        if (fileLocation.dir === idFileLocation.dir) {
            if (ref.startsWith(idFileLocation.fileName)) {
                const rest = ref.substring(idFileLocation.fileName.length);
                // root
                if (rest === '' || rest === '#') {
                    addExternalReference(gatheredInfo.references, idFileLocation);
                    return idFileLocation.fileName;
                }
                // inner
                const innerRef = createLocalRef(rest);
                if (innerRef) {
                    addExternalReference(gatheredInfo.references, idFileLocation, innerRef);
                    return innerRef;
                }
            }
        }
    }
    return;
};
const addExternalReference = (references, fileLocation, importName) => {
    let importNames = references.schema.get(fileLocation);
    if (!importNames) {
        importNames = new Set();
        references.schema.set(fileLocation, importNames);
    }
    importNames.add(importName || fileLocation.fileName);
};
