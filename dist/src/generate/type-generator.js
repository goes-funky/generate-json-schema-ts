"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeGenerator = void 0;
var all_of_generator_1 = require("./all-of-generator");
var any_of_generator_1 = require("./any-of-generator");
var basic_generator_1 = require("./basic-generator");
var constant_generator_1 = require("./constant-generator");
var enum_generator_1 = require("./enum-generator");
var one_of_generator_1 = require("./one-of-generator");
var reference_generator_1 = require("./reference-generator");
var generators = [
    constant_generator_1.constantGenerator,
    reference_generator_1.referenceGenerator,
    enum_generator_1.enumGenerator,
    basic_generator_1.basicGenerator,
    all_of_generator_1.allOfGenerator,
    any_of_generator_1.anyOfGenerator,
    one_of_generator_1.oneOfGenerator,
];
var typeGenerator = function (locatedSchema, gatheredInfo, inputInfo) {
    for (var _i = 0, generators_1 = generators; _i < generators_1.length; _i++) {
        var generator = generators_1[_i];
        var output = generator(locatedSchema, gatheredInfo, inputInfo);
        if (output) {
            return output;
        }
    }
    return "unknown";
};
exports.typeGenerator = typeGenerator;
