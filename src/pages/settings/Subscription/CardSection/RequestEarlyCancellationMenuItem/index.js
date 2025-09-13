"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function RequestEarlyCancellationMenuItem() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const handleRequestEarlyCancellationPress = () => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_REQUEST_EARLY_CANCELLATION);
    };
    return (<MenuItem_1.default title={translate('subscription.requestEarlyCancellation.title')} icon={Expensicons.CalendarSolid} shouldShowRightIcon wrapperStyle={styles.sectionMenuItemTopDescription} onPress={handleRequestEarlyCancellationPress}/>);
}
RequestEarlyCancellationMenuItem.displayName = 'RequestEarlyCancellationMenuItem';
exports.default = RequestEarlyCancellationMenuItem;
