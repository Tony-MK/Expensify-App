"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expensicons = jest.requireActual('../Expensicons');
module.exports = Object.keys(Expensicons).reduce((acc, curr) => {
    // We set the name of the anonymous mock function here so we can dynamically build the list of mocks and access the
    // "name" property to use in accessibility hints for element querying
    const fn = () => '';
    Object.defineProperty(fn, 'name', { value: curr });
    acc[curr] = fn;
    return acc;
}, {});
