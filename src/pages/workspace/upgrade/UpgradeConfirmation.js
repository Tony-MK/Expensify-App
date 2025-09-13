"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function UpgradeConfirmation({ policyName, onConfirmUpgrade, isCategorizing, isTravelUpgrade }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const [subscriptionLink, setSubscriptionLink] = (0, react_1.useState)('');
    const updateSubscriptionLink = (0, react_1.useCallback)(() => {
        const backTo = Navigation_1.default.getActiveRoute();
        setSubscriptionLink(`${environmentURL}/${ROUTES_1.default.SETTINGS_SUBSCRIPTION.getRoute(backTo)}`);
    }, [environmentURL]);
    (0, react_1.useEffect)(() => {
        Navigation_1.default.isNavigationReady().then(() => updateSubscriptionLink());
    }, [updateSubscriptionLink]);
    const description = (0, react_1.useMemo)(() => {
        if (isCategorizing) {
            return <Text_1.default style={[styles.textAlignCenter, styles.w100]}>{translate('workspace.upgrade.completed.categorizeMessage')}</Text_1.default>;
        }
        if (isTravelUpgrade) {
            return <Text_1.default style={[styles.textAlignCenter, styles.w100]}>{translate('workspace.upgrade.completed.travelMessage')}</Text_1.default>;
        }
        return (<react_native_1.View style={[styles.renderHTML, styles.w100]}>
                <RenderHTML_1.default html={translate('workspace.upgrade.completed.successMessage', { policyName, subscriptionLink })}/>
            </react_native_1.View>);
    }, [isCategorizing, isTravelUpgrade, policyName, styles.renderHTML, styles.textAlignCenter, styles.w100, translate, subscriptionLink]);
    return (<ConfirmationPage_1.default heading={translate('workspace.upgrade.completed.headline')} descriptionComponent={description} shouldShowButton onButtonPress={onConfirmUpgrade} buttonText={translate('workspace.upgrade.completed.gotIt')} containerStyle={styles.h100}/>);
}
exports.default = UpgradeConfirmation;
