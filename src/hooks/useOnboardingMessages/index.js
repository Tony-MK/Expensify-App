"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useOnboardingMessages;
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const OnboardingFlow_1 = require("@libs/actions/Welcome/OnboardingFlow");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function useOnboardingMessages() {
    const { preferredLocale } = (0, useLocalize_1.default)();
    const [hasIntroSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true, selector: (introSelected) => !!introSelected?.choice });
    const onboardingMessages = (0, react_1.useMemo)(() => (0, OnboardingFlow_1.getOnboardingMessages)(hasIntroSelected, preferredLocale), [hasIntroSelected, preferredLocale]);
    return onboardingMessages;
}
