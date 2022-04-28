"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeGenerator = void 0;
const all_of_generator_1 = require("./all-of-generator");
const any_of_generator_1 = require("./any-of-generator");
const basic_generator_1 = require("./basic-generator");
const constant_generator_1 = require("./constant-generator");
const enum_generator_1 = require("./enum-generator");
const one_of_generator_1 = require("./one-of-generator");
const reference_generator_1 = require("./reference-generator");
const generators = [
    constant_generator_1.constantGenerator,
    reference_generator_1.referenceGenerator,
    enum_generator_1.enumGenerator,
    basic_generator_1.basicGenerator,
    all_of_generator_1.allOfGenerator,
    any_of_generator_1.anyOfGenerator,
    one_of_generator_1.oneOfGenerator,
];
const typeGenerator = (locatedSchema, gatheredInfo, inputInfo) => {
    for (var generator of generators) {
        const output = generator(locatedSchema, gatheredInfo, inputInfo);
        if (output) {
            return output;
        }
    }
    return 'unknown';
};
exports.typeGenerator = typeGenerator;
