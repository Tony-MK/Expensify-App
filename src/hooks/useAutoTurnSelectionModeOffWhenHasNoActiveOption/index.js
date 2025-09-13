"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePrevious_1 = require("@hooks/usePrevious");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const useAutoTurnSelectionModeOffWhenHasNoActiveOption = (listItem) => {
    const hasActiveOption = listItem.some((item) => !item.isDisabled);
    const prevHasActiveOption = (0, usePrevious_1.default)(hasActiveOption);
    (0, react_1.useEffect)(() => {
        if (hasActiveOption || !prevHasActiveOption) {
            return;
        }
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, [hasActiveOption, prevHasActiveOption]);
};
exports.default = useAutoTurnSelectionModeOffWhenHasNoActiveOption;
