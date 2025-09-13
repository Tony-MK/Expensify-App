"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useLoadingBarVisibility;
const types_1 = require("@libs/API/types");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useNetwork_1 = require("./useNetwork");
const useOnyx_1 = require("./useOnyx");
// Commands that should trigger the LoadingBar to show
const RELEVANT_COMMANDS = new Set([types_1.WRITE_COMMANDS.OPEN_APP, types_1.WRITE_COMMANDS.RECONNECT_APP, types_1.WRITE_COMMANDS.OPEN_REPORT, types_1.WRITE_COMMANDS.READ_NEWEST_ACTION]);
/**
 * Hook that determines whether LoadingBar should be visible based on active queue requests
 * Shows LoadingBar when any of the RELEVANT_COMMANDS are being processed
 */
function useLoadingBarVisibility() {
    const [persistedRequests] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSISTED_REQUESTS, { canBeMissing: false });
    const [ongoingRequests] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    // Don't show loading bar if currently offline
    if (isOffline) {
        return false;
    }
    const hasPersistedRequests = !!persistedRequests?.some((request) => RELEVANT_COMMANDS.has(request.command) && !request.initiatedOffline);
    const hasOngoingRequests = !!ongoingRequests && RELEVANT_COMMANDS.has(ongoingRequests?.command);
    return hasPersistedRequests || hasOngoingRequests;
}
