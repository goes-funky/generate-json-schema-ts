"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filteredJoin = exports.filtered = void 0;
const filtered = (values) => values.filter((_) => _);
exports.filtered = filtered;
const filteredJoin = (values, joiner) => values.filter((_) => _).join(joiner ? joiner : '');
exports.filteredJoin = filteredJoin;
