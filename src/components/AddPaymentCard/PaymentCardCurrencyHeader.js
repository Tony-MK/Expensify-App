"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var RenderHTML_1 = require("@components/RenderHTML");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
function PaymentCardCurrencyHeader(_a) {
    var isSectionList = _a.isSectionList;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    return (<react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.mt3, isSectionList && styles.mh5, isSectionList && styles.mb5]}>
            <RenderHTML_1.default html={translate('billingCurrency.note')}/>
        </react_native_1.View>);
}
PaymentCardCurrencyHeader.displayName = 'PaymentCardCurrencyHeader';
exports.default = PaymentCardCurrencyHeader;
