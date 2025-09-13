"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useOnboardingMessages;
var react_1 = require("react");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function useOnboardingMessages() {
    var preferredLocale = (0, useLocalize_1.default)().preferredLocale;
    var hasIntroSelected = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true, selector: function (introSelected) { return !!(introSelected === null || introSelected === void 0 ? void 0 : introSelected.choice); } })[0];
    var onboardingMessages = (0, react_1.useMemo)(function () { return (0, OnboardingFlow_1.getOnboardingMessages)(hasIntroSelected, preferredLocale); }, [hasIntroSelected, preferredLocale]);
    return onboardingMessages;
}
