"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const RenderHTML_1 = require("@components/RenderHTML");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function PaymentCardCurrencyHeader({ isSectionList }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.mt3, isSectionList && styles.mh5, isSectionList && styles.mb5]}>
            <RenderHTML_1.default html={translate('billingCurrency.note')}/>
        </react_native_1.View>);
}
PaymentCardCurrencyHeader.displayName = 'PaymentCardCurrencyHeader';
exports.default = PaymentCardCurrencyHeader;
