"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filteredJoin = exports.filtered = void 0;
var filtered = function (values) { return values.filter(function (_) { return _; }); };
exports.filtered = filtered;
var filteredJoin = function (values, joiner) {
    return values.filter(function (_) { return _; }).join(joiner ? joiner : '');
};
exports.filteredJoin = filteredJoin;
