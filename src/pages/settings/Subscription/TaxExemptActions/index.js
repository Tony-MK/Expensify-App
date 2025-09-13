"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@userActions/Report");
const Subscription_1 = require("@userActions/Subscription");
const CONST_1 = require("@src/CONST");
const anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function TaxExemptActions() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const overflowMenu = (0, react_1.useMemo)(() => [
        {
            icon: Expensicons.Coins,
            numberOfLinesTitle: 2,
            text: translate('subscription.details.taxExempt'),
            onSelected: () => {
                (0, Subscription_1.requestTaxExempt)();
                (0, Report_1.navigateToConciergeChat)();
            },
        },
    ], [translate]);
    return (<react_native_1.View style={[styles.mtn2, styles.pAbsolute, styles.rn3]}>
            <ThreeDotsMenu_1.default shouldSelfPosition menuItems={overflowMenu} anchorAlignment={anchorAlignment} shouldOverlay/>
        </react_native_1.View>);
}
TaxExemptActions.displayName = 'TaxExemptActions';
exports.default = TaxExemptActions;
