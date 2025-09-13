"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRandomPolicyEmployeeList;
const falso_1 = require("@ngneat/falso");
function createRandomPolicyEmployeeList() {
    return {
        role: (0, falso_1.randWord)(),
        errors: {},
    };
}
