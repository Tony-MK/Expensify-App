"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useWorkspaceAccountID(policyID) {
    const [workspaceAccountID = CONST_1.default.DEFAULT_NUMBER_ID] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { selector: (policy) => policy?.workspaceAccountID });
    return workspaceAccountID;
}
exports.default = useWorkspaceAccountID;
