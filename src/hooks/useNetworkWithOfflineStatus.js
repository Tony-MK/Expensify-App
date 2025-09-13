"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useNetworkWithOfflineStatus;
const react_1 = require("react");
const useLocalize_1 = require("./useLocalize");
const useNetwork_1 = require("./useNetwork");
const usePrevious_1 = require("./usePrevious");
function useNetworkWithOfflineStatus() {
    const { isOffline, lastOfflineAt: lastOfflineAtFromOnyx } = (0, useNetwork_1.default)();
    const prevIsOffline = (0, usePrevious_1.default)(isOffline);
    const { getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    // The last time/date the user went/was offline. If the user was never offline, it is set to undefined.
    const lastOfflineAt = (0, react_1.useRef)(isOffline ? getLocalDateFromDatetime(lastOfflineAtFromOnyx) : undefined);
    // The last time/date the user went/was online. If the user was never online, it is set to undefined.
    const lastOnlineAt = (0, react_1.useRef)(isOffline ? undefined : getLocalDateFromDatetime());
    (0, react_1.useEffect)(() => {
        // If the user has just gone offline (was online before but is now offline), update `lastOfflineAt` with the current local date/time.
        if (isOffline && !prevIsOffline) {
            lastOfflineAt.current = getLocalDateFromDatetime();
        }
        // If the user has just come back online (was offline before but is now online), update `lastOnlineAt` with the current local date/time.
        if (!isOffline && prevIsOffline) {
            lastOnlineAt.current = getLocalDateFromDatetime();
        }
    }, [isOffline, getLocalDateFromDatetime, prevIsOffline]);
    return { isOffline, lastOfflineAt, lastOnlineAt };
}
