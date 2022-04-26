"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeGenerator = void 0;
var util_1 = require("../util");
var all_of_generator_1 = require("./all-of-generator");
var any_of_generator_1 = require("./any-of-generator");
var basic_generator_1 = require("./basic-generator");
var constant_generator_1 = require("./constant-generator");
var enum_generator_1 = require("./enum-generator");
var one_of_generator_1 = require("./one-of-generator");
var reference_generator_1 = require("./reference-generator");
var typeGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    var types = [];
    types.push(constant_generator_1.constantGenerator(locatedSchema, gatheredInfo, inputInfo));
    types.push(reference_generator_1.referenceGenerator(locatedSchema, gatheredInfo, inputInfo));
    types.push(enum_generator_1.enumGenerator(locatedSchema, gatheredInfo, inputInfo));
    types.push(basic_generator_1.basicGenerator(locatedSchema, gatheredInfo, inputInfo));
    types.push(all_of_generator_1.allOfGenerator(locatedSchema, gatheredInfo, inputInfo));
    types.push(any_of_generator_1.anyOfGenerator(locatedSchema, gatheredInfo, inputInfo));
    types.push(one_of_generator_1.oneOfGenerator(locatedSchema, gatheredInfo, inputInfo));
    var filteredLines = util_1.filtered(types);
    if (filteredLines.length === 0) {
        return inputInfo.options.ts.untyped;
    }
    return filteredLines.join('\n& ');
};
exports.typeGenerator = typeGenerator;
