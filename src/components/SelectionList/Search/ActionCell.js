"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Badge_1 = require("@components/Badge");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const SettlementButton_1 = require("@components/SettlementButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const actionTranslationsMap = {
    view: 'common.view',
    review: 'common.review',
    submit: 'common.submit',
    approve: 'iou.approve',
    pay: 'iou.pay',
    exportToAccounting: 'common.export',
    done: 'common.done',
    paid: 'iou.settledExpensify',
};
function ActionCell({ action = CONST_1.default.SEARCH.ACTION_TYPES.VIEW, isLargeScreenWidth = true, isSelected = false, goToItem, isChildListItem = false, parentAction = '', isLoading = false, policyID = '', reportID = '', hash, amount, }) {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [iouReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const text = isChildListItem ? translate(actionTranslationsMap[CONST_1.default.SEARCH.ACTION_TYPES.VIEW]) : translate(actionTranslationsMap[action]);
    const shouldUseViewAction = action === CONST_1.default.SEARCH.ACTION_TYPES.VIEW || (parentAction === CONST_1.default.SEARCH.ACTION_TYPES.PAID && action === CONST_1.default.SEARCH.ACTION_TYPES.PAID);
    const { currency } = iouReport ?? {};
    const confirmPayment = (0, react_1.useCallback)((type) => {
        if (!type || !reportID || !hash || !amount) {
            return;
        }
        (0, Search_1.payMoneyRequestOnSearch)(hash, [{ amount, paymentType: type, reportID }]);
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
        const buttonInnerStyles = isSelected ? styles.buttonDefaultSelected : {};
        return isLargeScreenWidth ? (<Button_1.default text={text} onPress={goToItem} small style={[styles.w100]} innerStyles={buttonInnerStyles} link={isChildListItem} shouldUseDefaultHover={!isChildListItem} icon={!isChildListItem && action === CONST_1.default.SEARCH.ACTION_TYPES.REVIEW ? Expensicons.DotIndicator : undefined} iconFill={theme.danger} iconHoverFill={theme.dangerHover} isNested/>) : null;
    }
    if (action === CONST_1.default.SEARCH.ACTION_TYPES.PAY && !(0, ReportUtils_1.isInvoiceReport)(iouReport)) {
        return (<SettlementButton_1.default shouldUseShortForm buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL} currency={currency} formattedAmount={(0, CurrencyUtils_1.convertToDisplayString)(iouReport?.total, currency)} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        policyID={policyID || iouReport?.policyID} iouReport={iouReport} chatReportID={iouReport?.chatReportID} enablePaymentsRoute={ROUTES_1.default.ENABLE_PAYMENTS} onPress={(type) => confirmPayment(type)} style={[styles.w100]} wrapperStyle={[styles.w100]} shouldShowPersonalBankAccountOption={!policyID && !iouReport?.policyID} isDisabled={isOffline} isLoading={isLoading}/>);
    }
    return (<Button_1.default text={text} onPress={goToItem} small style={[styles.w100]} isLoading={isLoading} success isDisabled={isOffline} isNested/>);
}
ActionCell.displayName = 'ActionCell';
exports.default = ActionCell;
