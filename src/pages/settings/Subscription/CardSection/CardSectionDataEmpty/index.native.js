"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function CardSectionDataEmpty() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
            <Icon_1.default src={Expensicons.CreditCardExclamation} additionalStyles={styles.subscriptionCardIcon} fill={theme.icon} medium/>
            <Text_1.default style={[styles.mutedNormalTextLabel, styles.textStrong]}>{translate('subscription.cardSection.cardNotFound')}</Text_1.default>
        </react_native_1.View>);
}
CardSectionDataEmpty.displayName = 'CardSectionDataEmpty';
exports.default = CardSectionDataEmpty;
