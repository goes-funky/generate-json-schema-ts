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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = void 0;
var path = __importStar(require("path"));
var rimraf_1 = __importDefault(require("rimraf"));
var clean = function (options) {
    return new Promise(function (resolve, reject) {
        if (!options.files.destination.preClean) {
            resolve();
        }
        else {
            var cwd = options.files.cwd || process.cwd();
            var absoluteDir = path.resolve(cwd, options.files.destination.dir);
            rmrf(absoluteDir).then(resolve).catch(reject);
        }
    });
};
exports.clean = clean;
var rmrf = function (dir) {
    return new Promise(function (resolve, reject) {
        var func = function (err) {
            if (err) {
                reject();
            }
            else {
                resolve();
            }
        };
        rimraf_1.default(dir, func);
    });
};
