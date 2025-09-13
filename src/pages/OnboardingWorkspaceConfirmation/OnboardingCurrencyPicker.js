"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useOnyx_1 = require("@hooks/useOnyx");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function OnboardingCurrencyPicker({ label, value, errorText, style, onInputChange, onBlur }) {
    const didOpenCurrencySelector = (0, react_1.useRef)(false);
    const isFocused = (0, native_1.useIsFocused)();
    const [draftValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_WORKSPACE_DETAILS_FORM_DRAFT, { canBeMissing: true });
    // eslint-disable-next-line rulesdir/prefer-early-return
    (0, react_1.useEffect)(() => {
        if (draftValues?.currency) {
            onInputChange?.(draftValues.currency);
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [draftValues?.currency]);
    (0, react_1.useEffect)(() => {
        if (!isFocused || !didOpenCurrencySelector.current) {
            return;
        }
        didOpenCurrencySelector.current = false;
        onBlur?.();
    }, [isFocused, onBlur]);
    return (<MenuItemWithTopDescription_1.default shouldShowRightIcon title={value ? `${value} - ${(0, CurrencyUtils_1.getCurrencySymbol)(value)}` : undefined} description={label} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} style={style} onPress={() => {
            didOpenCurrencySelector.current = true;
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORKSPACE_CURRENCY.getRoute(Navigation_1.default.getActiveRoute()));
        }}/>);
}
OnboardingCurrencyPicker.displayName = 'OnboardingCurrencyPicker';
exports.default = OnboardingCurrencyPicker;
