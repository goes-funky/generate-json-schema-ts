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
const path = __importStar(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const clean = (options) => {
    return new Promise((resolve, reject) => {
        if (!options.files.destination.preClean) {
            resolve();
        }
        else {
            const cwd = options.files.cwd || process.cwd();
            const absoluteDir = path.resolve(cwd, options.files.destination.dir);
            rmrf(absoluteDir).then(resolve).catch(reject);
        }
    });
};
exports.clean = clean;
const rmrf = (dir) => {
    return new Promise((resolve, reject) => {
        const func = (err) => {
            if (err) {
                reject();
            }
            else {
                resolve();
            }
        };
        (0, rimraf_1.default)(dir, func);
    });
};
