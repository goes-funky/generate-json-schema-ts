"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constantGenerator = void 0;
var constantGenerator = function (locatedSchema) {
    var constant = locatedSchema.schema.const;
    if (constant === undefined) {
        return undefined;
    }
    return (typeof constant === 'string')
        ? "'" + constant + "'"
        : "" + constant;
};
exports.constantGenerator = constantGenerator;
