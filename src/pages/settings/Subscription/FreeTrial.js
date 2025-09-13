"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Badge_1 = require("@components/Badge");
const Button_1 = require("@components/Button");
const Expensicons_1 = require("@components/Icon/Expensicons");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function FreeTrial({ badgeStyles, pressable = false, addSpacing = false, success = true, inARow = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [firstDayFreeTrial] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL, { canBeMissing: true });
    const [lastDayFreeTrial] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, { canBeMissing: true });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [freeTrialText, setFreeTrialText] = (0, react_1.useState)(undefined);
    const { isOffline } = (0, useNetwork_1.default)();
    (0, react_1.useEffect)(() => {
        if (!privateSubscription && !isOffline) {
            return;
        }
        setFreeTrialText((0, SubscriptionUtils_1.getFreeTrialText)(policies));
    }, [isOffline, privateSubscription, policies, firstDayFreeTrial, lastDayFreeTrial]);
    if (!freeTrialText) {
        return null;
    }
    const freeTrial = pressable ? (<Button_1.default icon={Expensicons_1.Star} success={success} text={freeTrialText} iconWrapperStyles={[styles.mw100]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION.getRoute(Navigation_1.default.getActiveRoute()))}/>) : (<Badge_1.default success={success} text={freeTrialText} badgeStyles={badgeStyles}/>);
    return addSpacing ? <react_native_1.View style={inARow ? [styles.pb3, styles.w50, styles.pl1] : [styles.pb3, styles.ph5]}>{freeTrial}</react_native_1.View> : freeTrial;
}
FreeTrial.displayName = 'FreeTrial';
exports.default = FreeTrial;
