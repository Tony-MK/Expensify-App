"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useNetwork;
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useNetwork({ onReconnect = () => { } } = {}) {
    const callback = (0, react_1.useRef)(onReconnect);
    // eslint-disable-next-line react-compiler/react-compiler
    callback.current = onReconnect;
    const [network] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NETWORK, {
        selector: (networkData) => {
            if (!networkData) {
                return { ...CONST_1.default.DEFAULT_NETWORK_DATA, networkStatus: CONST_1.default.NETWORK.NETWORK_STATUS.UNKNOWN };
            }
            return {
                isOffline: networkData.isOffline,
                networkStatus: networkData.networkStatus,
                lastOfflineAt: networkData.lastOfflineAt,
            };
        },
        canBeMissing: true,
    });
    // Extract values with proper defaults
    const isOffline = network?.isOffline ?? false;
    const networkStatus = network?.networkStatus;
    const lastOfflineAt = network?.lastOfflineAt;
    const prevOfflineStatusRef = (0, react_1.useRef)(isOffline);
    (0, react_1.useEffect)(() => {
        // If we were offline before and now we are not offline then we just reconnected
        const didReconnect = prevOfflineStatusRef.current && !isOffline;
        if (!didReconnect) {
            return;
        }
        callback.current();
    }, [isOffline]);
    (0, react_1.useEffect)(() => {
        // Used to store previous prop values to compare on next render
        prevOfflineStatusRef.current = isOffline;
    }, [isOffline]);
    // If the network status is undefined, we don't treat it as offline. Otherwise, we utilize the isOffline prop.
    return { isOffline: networkStatus === CONST_1.default.NETWORK.NETWORK_STATUS.UNKNOWN ? false : isOffline, lastOfflineAt };
}
