"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Checkbox_1 = require("@components/Checkbox");
var RadioButton_1 = require("@components/RadioButton");
var ActionCell_1 = require("@components/SelectionList/Search/ActionCell");
var DateCell_1 = require("@components/SelectionList/Search/DateCell");
var UserInfoCell_1 = require("@components/SelectionList/Search/UserInfoCell");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CategoryUtils_1 = require("@libs/CategoryUtils");
var StringUtils_1 = require("@libs/StringUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var CategoryCell_1 = require("./DataCells/CategoryCell");
var ChatBubbleCell_1 = require("./DataCells/ChatBubbleCell");
var MerchantCell_1 = require("./DataCells/MerchantCell");
var ReceiptCell_1 = require("./DataCells/ReceiptCell");
var TagCell_1 = require("./DataCells/TagCell");
var TaxCell_1 = require("./DataCells/TaxCell");
var TotalCell_1 = require("./DataCells/TotalCell");
var TypeCell_1 = require("./DataCells/TypeCell");
var TransactionItemRowRBRWithOnyx_1 = require("./TransactionItemRowRBRWithOnyx");
function getMerchantName(transactionItem, translate) {
    var _a, _b;
    var shouldShowMerchant = (_a = transactionItem.shouldShowMerchant) !== null && _a !== void 0 ? _a : true;
    var merchant = (_b = transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.formattedMerchant) !== null && _b !== void 0 ? _b : (0, TransactionUtils_1.getMerchant)(transactionItem);
    if ((0, TransactionUtils_1.isScanning)(transactionItem) && shouldShowMerchant) {
        merchant = translate('iou.receiptStatusTitle');
    }
    var merchantName = StringUtils_1.default.getFirstLine(merchant);
    return merchantName !== CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT ? merchantName : '';
}
function TransactionItemRow(_a) {
    var transactionItem = _a.transactionItem, report = _a.report, shouldUseNarrowLayout = _a.shouldUseNarrowLayout, isSelected = _a.isSelected, shouldShowTooltip = _a.shouldShowTooltip, dateColumnSize = _a.dateColumnSize, amountColumnSize = _a.amountColumnSize, taxAmountColumnSize = _a.taxAmountColumnSize, _b = _a.onCheckboxPress, onCheckboxPress = _b === void 0 ? function () { } : _b, _c = _a.shouldShowCheckbox, shouldShowCheckbox = _c === void 0 ? false : _c, columns = _a.columns, _d = _a.onButtonPress, onButtonPress = _d === void 0 ? function () { } : _d, style = _a.style, _e = _a.isReportItemChild, isReportItemChild = _e === void 0 ? false : _e, isActionLoading = _a.isActionLoading, _f = _a.isInSingleTransactionReport, isInSingleTransactionReport = _f === void 0 ? false : _f, _g = _a.shouldShowRadioButton, shouldShowRadioButton = _g === void 0 ? false : _g, _h = _a.onRadioButtonPress, onRadioButtonPress = _h === void 0 ? function () { } : _h, _j = _a.shouldShowErrors, shouldShowErrors = _j === void 0 ? true : _j, _k = _a.shouldHighlightItemWhenSelected, shouldHighlightItemWhenSelected = _k === void 0 ? true : _k, _l = _a.isDisabled, isDisabled = _l === void 0 ? false : _l, _m = _a.areAllOptionalColumnsHidden, areAllOptionalColumnsHidden = _m === void 0 ? false : _m, violations = _a.violations;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var StyleUtils = (0, useStyleUtils_1.default)();
    var hasCategoryOrTag = !(0, CategoryUtils_1.isCategoryMissing)(transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.category) || !!transactionItem.tag;
    var createdAt = (0, TransactionUtils_1.getCreated)(transactionItem);
    var isDateColumnWide = dateColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE;
    var isAmountColumnWide = amountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE;
    var isTaxAmountColumnWide = taxAmountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE;
    var bgActiveStyles = (0, react_1.useMemo)(function () {
        if (!isSelected || !shouldHighlightItemWhenSelected) {
            return [];
        }
        return styles.activeComponentBG;
    }, [isSelected, styles.activeComponentBG, shouldHighlightItemWhenSelected]);
    var merchant = (0, react_1.useMemo)(function () { return getMerchantName(transactionItem, translate); }, [transactionItem, translate]);
    var description = (0, TransactionUtils_1.getDescription)(transactionItem);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var merchantOrDescription = merchant || description;
    var missingFieldError = (0, react_1.useMemo)(function () {
        var isCustomUnitOutOfPolicy = (0, TransactionUtils_1.isUnreportedAndHasInvalidDistanceRateTransaction)(transactionItem);
        var hasFieldErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(transactionItem) || isCustomUnitOutOfPolicy;
        if (hasFieldErrors) {
            var amountMissing = (0, TransactionUtils_1.isAmountMissing)(transactionItem);
            var merchantMissing = (0, TransactionUtils_1.isMerchantMissing)(transactionItem);
            var error = '';
            if (amountMissing && merchantMissing) {
                error = translate('violations.reviewRequired');
            }
            else if (amountMissing) {
                error = translate('iou.missingAmount');
            }
            else if (merchantMissing) {
                error = translate('iou.missingMerchant');
            }
            else if (isCustomUnitOutOfPolicy) {
                error = translate('violations.customUnitOutOfPolicy');
            }
            return error;
        }
    }, [transactionItem, translate]);
    var columnComponent = (0, react_1.useMemo)(function () {
        var _a;
        var _b, _c, _d, _e;
        return (_a = {},
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TYPE] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TYPE} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE)]}>
                    <TypeCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.RECEIPT] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.RECEIPT} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT)]}>
                    <ReceiptCell_1.default transactionItem={transactionItem} isSelected={isSelected}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TAG)]}>
                    <TagCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DATE] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DATE} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.DATE, isDateColumnWide, false, false, areAllOptionalColumnsHidden)]}>
                    <DateCell_1.default created={createdAt} showTooltip={shouldShowTooltip} isLargeScreenWidth={!shouldUseNarrowLayout}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY)]}>
                    <CategoryCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.ACTION] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.ACTION} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION)]}>
                    {!!transactionItem.action && (<ActionCell_1.default action={transactionItem.action} isSelected={isSelected} isChildListItem={isReportItemChild} parentAction={transactionItem.parentTransactionID} goToItem={onButtonPress} isLoading={isActionLoading} reportID={transactionItem.reportID} policyID={report === null || report === void 0 ? void 0 : report.policyID} hash={transactionItem === null || transactionItem === void 0 ? void 0 : transactionItem.hash} amount={report === null || report === void 0 ? void 0 : report.total}/>)}
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT)]}>
                    {!!merchant && (<MerchantCell_1.default merchantOrDescription={merchant} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={false}/>)}
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION)]}>
                    {!!description && (<MerchantCell_1.default merchantOrDescription={description} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={false} isDescription/>)}
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.FROM)]}>
                    {!!transactionItem.to && (<UserInfoCell_1.default accountID={transactionItem.to.accountID} avatar={transactionItem.to.avatar} displayName={(_c = (_b = transactionItem.formattedTo) !== null && _b !== void 0 ? _b : transactionItem.to.displayName) !== null && _c !== void 0 ? _c : ''}/>)}
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.FROM] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.FROM} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.FROM)]}>
                    {!!transactionItem.from && (<UserInfoCell_1.default accountID={transactionItem.from.accountID} avatar={transactionItem.from.avatar} displayName={(_e = (_d = transactionItem.formattedFrom) !== null && _d !== void 0 ? _d : transactionItem.from.displayName) !== null && _e !== void 0 ? _e : ''}/>)}
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS)]}>
                    <ChatBubbleCell_1.default transaction={transactionItem} isInSingleTransactionReport={isInSingleTransactionReport}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TOTAL_AMOUNT] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TOTAL_AMOUNT} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT, undefined, isAmountColumnWide)]}>
                    <TotalCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
            _a[CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAX] = (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAX} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT, undefined, undefined, isTaxAmountColumnWide)]}>
                    <TaxCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip}/>
                </react_native_1.View>),
            _a);
    }, [
        StyleUtils,
        createdAt,
        isActionLoading,
        isReportItemChild,
        isDateColumnWide,
        isAmountColumnWide,
        isTaxAmountColumnWide,
        isInSingleTransactionReport,
        isSelected,
        merchant,
        description,
        onButtonPress,
        shouldShowTooltip,
        shouldUseNarrowLayout,
        transactionItem,
        report === null || report === void 0 ? void 0 : report.policyID,
        report === null || report === void 0 ? void 0 : report.total,
        areAllOptionalColumnsHidden,
    ]);
    var shouldRenderChatBubbleCell = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = columns === null || columns === void 0 ? void 0 : columns.includes(CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS)) !== null && _a !== void 0 ? _a : false;
    }, [columns]);
    if (shouldUseNarrowLayout) {
        return (<react_native_1.View style={[styles.expenseWidgetRadius, styles.justifyContentEvenly, bgActiveStyles, style, styles.overflowHidden]}>
                <react_native_1.View style={[styles.flexRow]}>
                    {shouldShowCheckbox && (<Checkbox_1.default disabled={isDisabled} onPress={function () {
                    onCheckboxPress(transactionItem.transactionID);
                }} accessibilityLabel={CONST_1.default.ROLE.CHECKBOX} isChecked={isSelected} style={styles.mr3} wrapperStyle={styles.justifyContentCenter}/>)}
                    <ReceiptCell_1.default transactionItem={transactionItem} isSelected={isSelected} style={styles.mr3}/>
                    <react_native_1.View style={[styles.flex2, styles.flexColumn, styles.justifyContentEvenly]}>
                        <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.minHeight5, styles.maxHeight5]}>
                            <DateCell_1.default created={createdAt} showTooltip={shouldShowTooltip} isLargeScreenWidth={!shouldUseNarrowLayout}/>
                            <Text_1.default style={[styles.textMicroSupporting]}> • </Text_1.default>
                            <TypeCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                            {!merchantOrDescription && (<react_native_1.View style={[styles.mlAuto]}>
                                    <TotalCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                                </react_native_1.View>)}
                        </react_native_1.View>
                        {!!merchantOrDescription && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.gap2]}>
                                <MerchantCell_1.default merchantOrDescription={merchantOrDescription} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout} isDescription={!merchant}/>
                                <TotalCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                            </react_native_1.View>)}
                    </react_native_1.View>
                    {shouldShowRadioButton && (<react_native_1.View style={[styles.ml3, styles.justifyContentCenter]}>
                            <RadioButton_1.default isChecked={isSelected} disabled={isDisabled} onPress={function () { return onRadioButtonPress === null || onRadioButtonPress === void 0 ? void 0 : onRadioButtonPress(transactionItem.transactionID); }} accessibilityLabel={CONST_1.default.ROLE.RADIO} shouldUseNewStyle/>
                        </react_native_1.View>)}
                </react_native_1.View>
                <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsStart]}>
                    <react_native_1.View style={[styles.flexColumn, styles.flex1]}>
                        {hasCategoryOrTag && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2, styles.mt2, styles.minHeight4]}>
                                <CategoryCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                                <TagCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                            </react_native_1.View>)}
                        {shouldShowErrors && (<TransactionItemRowRBRWithOnyx_1.default transaction={transactionItem} violations={violations} report={report} containerStyles={[styles.mt2, styles.minHeight4]} missingFieldError={missingFieldError}/>)}
                    </react_native_1.View>
                    {shouldRenderChatBubbleCell && (<ChatBubbleCell_1.default transaction={transactionItem} containerStyles={[styles.mt2]} isInSingleTransactionReport={isInSingleTransactionReport}/>)}
                </react_native_1.View>
            </react_native_1.View>);
    }
    return (<react_native_1.View style={[styles.expenseWidgetRadius, styles.flex1, styles.gap2, bgActiveStyles, styles.mw100, style]}>
            <react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
                {!shouldShowRadioButton && (<Checkbox_1.default disabled={isDisabled} onPress={function () {
                onCheckboxPress(transactionItem.transactionID);
            }} accessibilityLabel={CONST_1.default.ROLE.CHECKBOX} isChecked={isSelected} style={styles.mr1} wrapperStyle={styles.justifyContentCenter}/>)}
                {columns === null || columns === void 0 ? void 0 : columns.map(function (column) { return columnComponent[column]; }).filter(Boolean)}
                {shouldShowRadioButton && (<react_native_1.View style={[styles.ml1, styles.justifyContentCenter]}>
                        <RadioButton_1.default isChecked={isSelected} disabled={isDisabled} onPress={function () { return onRadioButtonPress === null || onRadioButtonPress === void 0 ? void 0 : onRadioButtonPress(transactionItem.transactionID); }} accessibilityLabel={CONST_1.default.ROLE.RADIO} shouldUseNewStyle/>
                    </react_native_1.View>)}
            </react_native_1.View>
            {shouldShowErrors && (<TransactionItemRowRBRWithOnyx_1.default transaction={transactionItem} violations={violations} report={report} missingFieldError={missingFieldError}/>)}
        </react_native_1.View>);
}
TransactionItemRow.displayName = 'TransactionItemRow';
exports.default = TransactionItemRow;
