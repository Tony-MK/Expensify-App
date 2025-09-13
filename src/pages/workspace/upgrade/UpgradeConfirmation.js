"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmationPage_1 = require("@components/ConfirmationPage");
var RenderHTML_1 = require("@components/RenderHTML");
var Text_1 = require("@components/Text");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ROUTES_1 = require("@src/ROUTES");
function UpgradeConfirmation(_a) {
    var policyName = _a.policyName, onConfirmUpgrade = _a.onConfirmUpgrade, isCategorizing = _a.isCategorizing, isTravelUpgrade = _a.isTravelUpgrade;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var _b = (0, react_1.useState)(''), subscriptionLink = _b[0], setSubscriptionLink = _b[1];
    var updateSubscriptionLink = (0, react_1.useCallback)(function () {
        var backTo = Navigation_1.default.getActiveRoute();
        setSubscriptionLink("".concat(environmentURL, "/").concat(ROUTES_1.default.SETTINGS_SUBSCRIPTION.getRoute(backTo)));
    }, [environmentURL]);
    (0, react_1.useEffect)(function () {
        Navigation_1.default.isNavigationReady().then(function () { return updateSubscriptionLink(); });
    }, [updateSubscriptionLink]);
    var description = (0, react_1.useMemo)(function () {
        if (isCategorizing) {
            return <Text_1.default style={[styles.textAlignCenter, styles.w100]}>{translate('workspace.upgrade.completed.categorizeMessage')}</Text_1.default>;
        }
        if (isTravelUpgrade) {
            return <Text_1.default style={[styles.textAlignCenter, styles.w100]}>{translate('workspace.upgrade.completed.travelMessage')}</Text_1.default>;
        }
        return (<react_native_1.View style={[styles.renderHTML, styles.w100]}>
                <RenderHTML_1.default html={translate('workspace.upgrade.completed.successMessage', { policyName: policyName, subscriptionLink: subscriptionLink })}/>
            </react_native_1.View>);
    }, [isCategorizing, isTravelUpgrade, policyName, styles.renderHTML, styles.textAlignCenter, styles.w100, translate, subscriptionLink]);
    return (<ConfirmationPage_1.default heading={translate('workspace.upgrade.completed.headline')} descriptionComponent={description} shouldShowButton onButtonPress={onConfirmUpgrade} buttonText={translate('workspace.upgrade.completed.gotIt')} containerStyle={styles.h100}/>);
}
exports.default = UpgradeConfirmation;
