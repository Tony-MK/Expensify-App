"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Checkbox_1 = require("@components/Checkbox");
const RadioButton_1 = require("@components/RadioButton");
const ActionCell_1 = require("@components/SelectionList/Search/ActionCell");
const DateCell_1 = require("@components/SelectionList/Search/DateCell");
const UserInfoCell_1 = require("@components/SelectionList/Search/UserInfoCell");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const StringUtils_1 = require("@libs/StringUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const CategoryCell_1 = require("./DataCells/CategoryCell");
const ChatBubbleCell_1 = require("./DataCells/ChatBubbleCell");
const MerchantCell_1 = require("./DataCells/MerchantCell");
const ReceiptCell_1 = require("./DataCells/ReceiptCell");
const TagCell_1 = require("./DataCells/TagCell");
const TaxCell_1 = require("./DataCells/TaxCell");
const TotalCell_1 = require("./DataCells/TotalCell");
const TypeCell_1 = require("./DataCells/TypeCell");
const TransactionItemRowRBRWithOnyx_1 = require("./TransactionItemRowRBRWithOnyx");
function getMerchantName(transactionItem, translate) {
    const shouldShowMerchant = transactionItem.shouldShowMerchant ?? true;
    let merchant = transactionItem?.formattedMerchant ?? (0, TransactionUtils_1.getMerchant)(transactionItem);
    if ((0, TransactionUtils_1.isScanning)(transactionItem) && shouldShowMerchant) {
        merchant = translate('iou.receiptStatusTitle');
    }
    const merchantName = StringUtils_1.default.getFirstLine(merchant);
    return merchantName !== CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT ? merchantName : '';
}
function TransactionItemRow({ transactionItem, report, shouldUseNarrowLayout, isSelected, shouldShowTooltip, dateColumnSize, amountColumnSize, taxAmountColumnSize, onCheckboxPress = () => { }, shouldShowCheckbox = false, columns, onButtonPress = () => { }, style, isReportItemChild = false, isActionLoading, isInSingleTransactionReport = false, shouldShowRadioButton = false, onRadioButtonPress = () => { }, shouldShowErrors = true, shouldHighlightItemWhenSelected = true, isDisabled = false, areAllOptionalColumnsHidden = false, violations, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const hasCategoryOrTag = !(0, CategoryUtils_1.isCategoryMissing)(transactionItem?.category) || !!transactionItem.tag;
    const createdAt = (0, TransactionUtils_1.getCreated)(transactionItem);
    const isDateColumnWide = dateColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE;
    const isAmountColumnWide = amountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE;
    const isTaxAmountColumnWide = taxAmountColumnSize === CONST_1.default.SEARCH.TABLE_COLUMN_SIZES.WIDE;
    const bgActiveStyles = (0, react_1.useMemo)(() => {
        if (!isSelected || !shouldHighlightItemWhenSelected) {
            return [];
        }
        return styles.activeComponentBG;
    }, [isSelected, styles.activeComponentBG, shouldHighlightItemWhenSelected]);
    const merchant = (0, react_1.useMemo)(() => getMerchantName(transactionItem, translate), [transactionItem, translate]);
    const description = (0, TransactionUtils_1.getDescription)(transactionItem);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const merchantOrDescription = merchant || description;
    const missingFieldError = (0, react_1.useMemo)(() => {
        const isCustomUnitOutOfPolicy = (0, TransactionUtils_1.isUnreportedAndHasInvalidDistanceRateTransaction)(transactionItem);
        const hasFieldErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(transactionItem) || isCustomUnitOutOfPolicy;
        if (hasFieldErrors) {
            const amountMissing = (0, TransactionUtils_1.isAmountMissing)(transactionItem);
            const merchantMissing = (0, TransactionUtils_1.isMerchantMissing)(transactionItem);
            let error = '';
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
    const columnComponent = (0, react_1.useMemo)(() => ({
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TYPE]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TYPE} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE)]}>
                    <TypeCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.RECEIPT]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.RECEIPT} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT)]}>
                    <ReceiptCell_1.default transactionItem={transactionItem} isSelected={isSelected}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAG} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TAG)]}>
                    <TagCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DATE]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DATE} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.DATE, isDateColumnWide, false, false, areAllOptionalColumnsHidden)]}>
                    <DateCell_1.default created={createdAt} showTooltip={shouldShowTooltip} isLargeScreenWidth={!shouldUseNarrowLayout}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.CATEGORY} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY)]}>
                    <CategoryCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.ACTION]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.ACTION} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION)]}>
                    {!!transactionItem.action && (<ActionCell_1.default action={transactionItem.action} isSelected={isSelected} isChildListItem={isReportItemChild} parentAction={transactionItem.parentTransactionID} goToItem={onButtonPress} isLoading={isActionLoading} reportID={transactionItem.reportID} policyID={report?.policyID} hash={transactionItem?.hash} amount={report?.total}/>)}
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.MERCHANT} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT)]}>
                    {!!merchant && (<MerchantCell_1.default merchantOrDescription={merchant} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={false}/>)}
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.DESCRIPTION} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION)]}>
                    {!!description && (<MerchantCell_1.default merchantOrDescription={description} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={false} isDescription/>)}
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TO} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.FROM)]}>
                    {!!transactionItem.to && (<UserInfoCell_1.default accountID={transactionItem.to.accountID} avatar={transactionItem.to.avatar} displayName={transactionItem.formattedTo ?? transactionItem.to.displayName ?? ''}/>)}
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.FROM]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.FROM} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.FROM)]}>
                    {!!transactionItem.from && (<UserInfoCell_1.default accountID={transactionItem.from.accountID} avatar={transactionItem.from.avatar} displayName={transactionItem.formattedFrom ?? transactionItem.from.displayName ?? ''}/>)}
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS)]}>
                    <ChatBubbleCell_1.default transaction={transactionItem} isInSingleTransactionReport={isInSingleTransactionReport}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TOTAL_AMOUNT]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TOTAL_AMOUNT} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT, undefined, isAmountColumnWide)]}>
                    <TotalCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip} shouldUseNarrowLayout={shouldUseNarrowLayout}/>
                </react_native_1.View>),
        [CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAX]: (<react_native_1.View key={CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.TAX} style={[StyleUtils.getReportTableColumnStyles(CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT, undefined, undefined, isTaxAmountColumnWide)]}>
                    <TaxCell_1.default transactionItem={transactionItem} shouldShowTooltip={shouldShowTooltip}/>
                </react_native_1.View>),
    }), [
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
        report?.policyID,
        report?.total,
        areAllOptionalColumnsHidden,
    ]);
    const shouldRenderChatBubbleCell = (0, react_1.useMemo)(() => {
        return columns?.includes(CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS) ?? false;
    }, [columns]);
    if (shouldUseNarrowLayout) {
        return (<react_native_1.View style={[styles.expenseWidgetRadius, styles.justifyContentEvenly, bgActiveStyles, style, styles.overflowHidden]}>
                <react_native_1.View style={[styles.flexRow]}>
                    {shouldShowCheckbox && (<Checkbox_1.default disabled={isDisabled} onPress={() => {
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
                            <RadioButton_1.default isChecked={isSelected} disabled={isDisabled} onPress={() => onRadioButtonPress?.(transactionItem.transactionID)} accessibilityLabel={CONST_1.default.ROLE.RADIO} shouldUseNewStyle/>
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
                {!shouldShowRadioButton && (<Checkbox_1.default disabled={isDisabled} onPress={() => {
                onCheckboxPress(transactionItem.transactionID);
            }} accessibilityLabel={CONST_1.default.ROLE.CHECKBOX} isChecked={isSelected} style={styles.mr1} wrapperStyle={styles.justifyContentCenter}/>)}
                {columns?.map((column) => columnComponent[column]).filter(Boolean)}
                {shouldShowRadioButton && (<react_native_1.View style={[styles.ml1, styles.justifyContentCenter]}>
                        <RadioButton_1.default isChecked={isSelected} disabled={isDisabled} onPress={() => onRadioButtonPress?.(transactionItem.transactionID)} accessibilityLabel={CONST_1.default.ROLE.RADIO} shouldUseNewStyle/>
                    </react_native_1.View>)}
            </react_native_1.View>
            {shouldShowErrors && (<TransactionItemRowRBRWithOnyx_1.default transaction={transactionItem} violations={violations} report={report} missingFieldError={missingFieldError}/>)}
        </react_native_1.View>);
}
TransactionItemRow.displayName = 'TransactionItemRow';
exports.default = TransactionItemRow;
