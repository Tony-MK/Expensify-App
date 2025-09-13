"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
function CardSectionActions() {
    const { translate } = (0, useLocalize_1.default)();
    const overflowMenu = (0, react_1.useMemo)(() => [
        {
            icon: Expensicons.CreditCard,
            text: translate('subscription.cardSection.changeCard'),
            onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD),
        },
        {
            icon: Expensicons.MoneyCircle,
            text: translate('subscription.cardSection.changeCurrency'),
            onSelected: () => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_CHANGE_BILLING_CURRENCY),
        },
    ], [translate]);
    return (<ThreeDotsMenu_1.default shouldSelfPosition menuItems={overflowMenu} anchorAlignment={anchorAlignment} shouldOverlay/>);
}
CardSectionActions.displayName = 'CardSectionActions';
exports.default = CardSectionActions;
