"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Badge_1 = require("@components/Badge");
var Button_1 = require("@components/Button");
var Expensicons = require("@components/Icon/Expensicons");
var SettlementButton_1 = require("@components/SettlementButton");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var actionTranslationsMap = {
    view: 'common.view',
    review: 'common.review',
    submit: 'common.submit',
    approve: 'iou.approve',
    pay: 'iou.pay',
    exportToAccounting: 'common.export',
    done: 'common.done',
    paid: 'iou.settledExpensify',
};
function ActionCell(_a) {
    var _b = _a.action, action = _b === void 0 ? CONST_1.default.SEARCH.ACTION_TYPES.VIEW : _b, _c = _a.isLargeScreenWidth, isLargeScreenWidth = _c === void 0 ? true : _c, _d = _a.isSelected, isSelected = _d === void 0 ? false : _d, goToItem = _a.goToItem, _e = _a.isChildListItem, isChildListItem = _e === void 0 ? false : _e, _f = _a.parentAction, parentAction = _f === void 0 ? '' : _f, _g = _a.isLoading, isLoading = _g === void 0 ? false : _g, _h = _a.policyID, policyID = _h === void 0 ? '' : _h, _j = _a.reportID, reportID = _j === void 0 ? '' : _j, hash = _a.hash, amount = _a.amount;
    var translate = (0, useLocalize_1.default)().translate;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var iouReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), { canBeMissing: true })[0];
    var text = isChildListItem ? translate(actionTranslationsMap[CONST_1.default.SEARCH.ACTION_TYPES.VIEW]) : translate(actionTranslationsMap[action]);
    var shouldUseViewAction = action === CONST_1.default.SEARCH.ACTION_TYPES.VIEW || (parentAction === CONST_1.default.SEARCH.ACTION_TYPES.PAID && action === CONST_1.default.SEARCH.ACTION_TYPES.PAID);
    var currency = (iouReport !== null && iouReport !== void 0 ? iouReport : {}).currency;
    var confirmPayment = (0, react_1.useCallback)(function (type) {
        if (!type || !reportID || !hash || !amount) {
            return;
        }
        (0, Search_1.payMoneyRequestOnSearch)(hash, [{ amount: amount, paymentType: type, reportID: reportID }]);
    }, [hash, amount, reportID]);
    if (!isChildListItem && ((parentAction !== CONST_1.default.SEARCH.ACTION_TYPES.PAID && action === CONST_1.default.SEARCH.ACTION_TYPES.PAID) || action === CONST_1.default.SEARCH.ACTION_TYPES.DONE)) {
        return (<react_native_1.View style={[StyleUtils.getHeight(variables_1.default.h28), styles.justifyContentCenter]}>
                <Badge_1.default text={text} icon={action === CONST_1.default.SEARCH.ACTION_TYPES.DONE ? Expensicons.Checkbox : Expensicons.Checkmark} badgeStyles={[
                styles.ml0,
                styles.ph2,
                styles.gap1,
                isLargeScreenWidth ? styles.alignSelfCenter : styles.alignSelfEnd,
                StyleUtils.getHeight(variables_1.default.h20),
                StyleUtils.getMinimumHeight(variables_1.default.h20),
                isSelected ? StyleUtils.getBorderColorStyle(theme.buttonHoveredBG) : StyleUtils.getBorderColorStyle(theme.border),
            ]} textStyles={StyleUtils.getFontSizeStyle(variables_1.default.fontSizeExtraSmall)} iconStyles={styles.mr0} success/>
            </react_native_1.View>);
    }
    if (action === CONST_1.default.SEARCH.ACTION_TYPES.VIEW || action === CONST_1.default.SEARCH.ACTION_TYPES.REVIEW || shouldUseViewAction || isChildListItem) {
        var buttonInnerStyles = isSelected ? styles.buttonDefaultSelected : {};
        return isLargeScreenWidth ? (<Button_1.default text={text} onPress={goToItem} small style={[styles.w100]} innerStyles={buttonInnerStyles} link={isChildListItem} shouldUseDefaultHover={!isChildListItem} icon={!isChildListItem && action === CONST_1.default.SEARCH.ACTION_TYPES.REVIEW ? Expensicons.DotIndicator : undefined} iconFill={theme.danger} iconHoverFill={theme.dangerHover} isNested/>) : null;
    }
    if (action === CONST_1.default.SEARCH.ACTION_TYPES.PAY && !(0, ReportUtils_1.isInvoiceReport)(iouReport)) {
        return (<SettlementButton_1.default shouldUseShortForm buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} currency={currency} formattedAmount={(0, CurrencyUtils_1.convertToDisplayString)(iouReport === null || iouReport === void 0 ? void 0 : iouReport.total, currency)} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        policyID={policyID || (iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID)} iouReport={iouReport} chatReportID={iouReport === null || iouReport === void 0 ? void 0 : iouReport.chatReportID} enablePaymentsRoute={ROUTES_1.default.ENABLE_PAYMENTS} onPress={function (type) { return confirmPayment(type); }} style={[styles.w100]} wrapperStyle={[styles.w100]} shouldShowPersonalBankAccountOption={!policyID && !(iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID)} isDisabled={isOffline} isLoading={isLoading}/>);
    }
    return (<Button_1.default text={text} onPress={goToItem} small style={[styles.w100]} isLoading={isLoading} success isDisabled={isOffline} isNested/>);
}
ActionCell.displayName = 'ActionCell';
exports.default = ActionCell;
