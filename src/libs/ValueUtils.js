"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstValue = exports.getReturnValue = void 0;
const getReturnValue = (value, ...p) => (typeof value === 'function' ? value(...p) : value);
exports.getReturnValue = getReturnValue;
const getFirstValue = (value) => (Array.isArray(value) ? value[0] : value);
exports.getFirstValue = getFirstValue;
