"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Expensicons = require("@components/Icon/Expensicons");
var ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Report_1 = require("@userActions/Report");
var Subscription_1 = require("@userActions/Subscription");
var CONST_1 = require("@src/CONST");
var anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function TaxExemptActions() {
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var overflowMenu = (0, react_1.useMemo)(function () { return [
        {
            icon: Expensicons.Coins,
            numberOfLinesTitle: 2,
            text: translate('subscription.details.taxExempt'),
            onSelected: function () {
                (0, Subscription_1.requestTaxExempt)();
                (0, Report_1.navigateToConciergeChat)();
            },
        },
    ]; }, [translate]);
    return (<react_native_1.View style={[styles.mtn2, styles.pAbsolute, styles.rn3]}>
            <ThreeDotsMenu_1.default shouldSelfPosition menuItems={overflowMenu} anchorAlignment={anchorAlignment} shouldOverlay/>
        </react_native_1.View>);
}
TaxExemptActions.displayName = 'TaxExemptActions';
exports.default = TaxExemptActions;
