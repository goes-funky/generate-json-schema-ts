"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levenshtein = exports.capitalize = exports.underscore = exports.classify = exports.camelize = exports.dasherize = exports.decamelize = void 0;
var STRING_DASHERIZE_REGEXP = /[ _]/g;
var STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
var STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;
var STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
var STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;
function decamelize(str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}
exports.decamelize = decamelize;
function dasherize(str) {
    return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}
exports.dasherize = dasherize;
function camelize(str) {
    return str
        .replace(STRING_CAMELIZE_REGEXP, function (_match, _separator, chr) {
        return chr ? chr.toUpperCase() : '';
    })
        .replace(/^([A-Z])/, function (match) { return match.toLowerCase(); });
}
exports.camelize = camelize;
function classify(str) {
    return str
        .split('.')
        .map(function (part) { return capitalize(camelize(part)); })
        .join('.');
}
exports.classify = classify;
function underscore(str) {
    return str
        .replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2')
        .replace(STRING_UNDERSCORE_REGEXP_2, '_')
        .toLowerCase();
}
exports.underscore = underscore;
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
function levenshtein(a, b) {
    if (a.length == 0) {
        return b.length;
    }
    if (b.length == 0) {
        return a.length;
    }
    var matrix = [];
    for (var i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (var j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (var i = 1; i <= b.length; i++) {
        for (var j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
exports.levenshtein = levenshtein;
