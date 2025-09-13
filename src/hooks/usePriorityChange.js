"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const App_1 = require("@libs/actions/App");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const usePrevious_1 = require("./usePrevious");
function usePriorityMode() {
    const [priorityMode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true });
    const [allReportsWithDraftComments] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT, { canBeMissing: true });
    const prevPriorityMode = (0, usePrevious_1.default)(priorityMode);
    (0, react_1.useEffect)(() => {
        if (!(prevPriorityMode === CONST_1.default.PRIORITY_MODE.GSD && priorityMode === CONST_1.default.PRIORITY_MODE.DEFAULT)) {
            return;
        }
        // When a user switches their priority mode away from #focus/GSD we need to call openApp
        // to fetch all their chats because #focus mode works with a subset of a user's chats.
        (0, App_1.openApp)(false, allReportsWithDraftComments);
    }, [priorityMode, allReportsWithDraftComments, prevPriorityMode]);
}
exports.default = usePriorityMode;
