"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function CardSectionDataEmpty() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const openAddPaymentCardScreen = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD);
    }, []);
    const handleAddPaymentCardPress = () => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        openAddPaymentCardScreen();
    };
    return (<Button_1.default text={translate('subscription.cardSection.addCardButton')} onPress={handleAddPaymentCardPress} style={styles.w100} success large/>);
}
CardSectionDataEmpty.displayName = 'CardSectionDataEmpty';
exports.default = CardSectionDataEmpty;
