"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneOfNGenerator = void 0;
var SuppressNGenerator = function (suppressCount) {
    var suppressTypeArgs = [];
    for (var i = 0; i < suppressCount; i++) {
        suppressTypeArgs.push("S" + i);
    }
    var suppressType = "Suppress_" + suppressCount + "<T, " + suppressTypeArgs.join(', ') + ">";
    var excludeType = "Exclude<(keyof " + suppressTypeArgs.join(' | keyof ') + "), keyof T>";
    return "type " + suppressType + " = T & { [P in " + excludeType + "]?: never };";
};
var OneOfNGenerator = function (typeCount) {
    if (!Number.isInteger(typeCount) || typeCount < 2) {
        return undefined;
    }
    var typeArgs = [];
    for (var i = 0; i < typeCount; i++) {
        typeArgs.push("T" + i);
    }
    var pipeSepTypes = typeArgs.join(' | ');
    var firstLine = "type OneOf_" + typeCount + "<" + typeArgs.join(', ') + "> = (" + pipeSepTypes + ") extends object";
    var middleLines = [];
    var suppressCount = typeCount - 1;
    for (var i = 0; i < typeCount; i++) {
        var temp = typeArgs[i];
        typeArgs[i] = typeArgs[0];
        typeArgs[0] = temp;
        middleLines.push("Suppress_" + suppressCount + "<" + typeArgs.join(', ') + ">");
    }
    var middle = "? " + middleLines.join('\n| ');
    var lastLine = ": " + pipeSepTypes + ";";
    var suppressType = SuppressNGenerator(suppressCount);
    return [firstLine, middle, lastLine, suppressType].join('\n');
};
exports.OneOfNGenerator = OneOfNGenerator;
