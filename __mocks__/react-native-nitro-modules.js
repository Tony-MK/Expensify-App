"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NitroModules = void 0;
const NitroModules = {
    createHybridObject: jest.fn(() => ({
        getAll: jest.fn(() => Promise.resolve([])),
    })),
};
exports.NitroModules = NitroModules;
