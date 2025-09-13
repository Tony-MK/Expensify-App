"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Expensicons = require("@components/Icon/Expensicons");
var ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
var useLocalize_1 = require("@hooks/useLocalize");
var Navigation_1 = require("@navigation/Navigation");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function CardSectionActions() {
    var translate = (0, useLocalize_1.default)().translate;
    var overflowMenu = (0, react_1.useMemo)(function () { return [
        {
            icon: Expensicons.CreditCard,
            text: translate('subscription.cardSection.changeCard'),
            onSelected: function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD); },
        },
        {
            icon: Expensicons.MoneyCircle,
            text: translate('subscription.cardSection.changeCurrency'),
            onSelected: function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_CHANGE_BILLING_CURRENCY); },
        },
    ]; }, [translate]);
    return (<ThreeDotsMenu_1.default shouldSelfPosition menuItems={overflowMenu} anchorAlignment={anchorAlignment} shouldOverlay/>);
}
CardSectionActions.displayName = 'CardSectionActions';
exports.default = CardSectionActions;
