"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NitroModules = void 0;
var NitroModules = {
    createHybridObject: jest.fn(function () { return ({
        getAll: jest.fn(function () { return Promise.resolve([]); }),
    }); }),
};
exports.NitroModules = NitroModules;
