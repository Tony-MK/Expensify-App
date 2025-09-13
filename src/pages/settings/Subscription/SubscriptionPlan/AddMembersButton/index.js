"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function AddMembersButton() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const activePolicy = (0, usePolicy_1.default)(activePolicyID);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    if (!activePolicy || activePolicy.type === CONST_1.default.POLICY.TYPE.PERSONAL) {
        return null;
    }
    return (<Button_1.default text={translate('subscription.yourPlan.addMembers')} style={shouldUseNarrowLayout ? styles.ph5 : styles.ph8} icon={Expensicons.UserPlus} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(activePolicyID))}/>);
}
exports.default = AddMembersButton;
