"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SplitExpenseEditPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { reportID, transactionID, splitExpenseTransactionID = '', backTo } = route.params;
    const report = (0, ReportUtils_1.getReportOrDraftReport)(reportID);
    const [splitExpenseDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`, { canBeMissing: false });
    const splitExpenseDraftTransactionDetails = (0, react_1.useMemo)(() => (0, ReportUtils_1.getTransactionDetails)(splitExpenseDraftTransaction) ?? {}, [splitExpenseDraftTransaction]);
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: false });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: false });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: false });
    const transactionDetails = (0, react_1.useMemo)(() => (0, ReportUtils_1.getTransactionDetails)(transaction) ?? {}, [transaction]);
    const transactionDetailsAmount = transactionDetails?.amount ?? 0;
    const [draftTransactionWithSplitExpenses] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: false });
    const splitExpensesList = draftTransactionWithSplitExpenses?.comment?.splitExpenses;
    const currentAmount = transactionDetailsAmount >= 0 ? Math.abs(Number(splitExpenseDraftTransactionDetails?.amount)) : Number(splitExpenseDraftTransactionDetails?.amount);
    const currentDescription = (0, ReportUtils_1.getParsedComment)(Parser_1.default.htmlToMarkdown(splitExpenseDraftTransactionDetails?.comment ?? ''));
    const shouldShowCategory = !!policy?.areCategoriesEnabled && !!policyCategories;
    const transactionTag = (0, TransactionUtils_1.getTag)(splitExpenseDraftTransaction);
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTags), [policyTags]);
    const isSplitAvailable = report && transaction && (0, ReportSecondaryActionUtils_1.isSplitAction)(report, [transaction], policy);
    const isCategoryRequired = !!policy?.requiresCategory;
    const shouldShowTags = !!policy?.areTagsEnabled && !!(transactionTag || (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists));
    const tagVisibility = (0, react_1.useMemo)(() => (0, TagsOptionsListUtils_1.getTagVisibility)({
        shouldShowTags,
        policy,
        policyTags,
        transaction: splitExpenseDraftTransaction,
    }), [shouldShowTags, policy, policyTags, splitExpenseDraftTransaction]);
    const previousTagsVisibility = (0, usePrevious_1.default)(tagVisibility.map((v) => v.shouldShow)) ?? [];
    return (<ScreenWrapper_1.default testID={SplitExpenseEditPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!reportID || (0, EmptyObject_1.isEmptyObject)(splitExpenseDraftTransaction) || !isSplitAvailable}>
                <react_native_1.View style={[styles.flex1]}>
                    <HeaderWithBackButton_1.default title={translate('iou.splitExpenseEditTitle', {
            amount: (0, CurrencyUtils_1.convertToDisplayString)(currentAmount, splitExpenseDraftTransactionDetails?.currency),
            merchant: splitExpenseDraftTransaction?.merchant ?? '',
        })} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                    <ScrollView_1.default>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon shouldRenderAsHTML key={translate('common.description')} description={translate('common.description')} title={currentDescription} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
        }} style={[styles.moneyRequestMenuItem]} titleWrapperStyle={styles.flex1} numberOfLinesTitle={2}/>
                        {shouldShowCategory && (<MenuItemWithTopDescription_1.default shouldShowRightIcon key={translate('common.category')} description={translate('common.category')} title={splitExpenseDraftTransactionDetails?.category} numberOfLinesTitle={2} rightLabel={isCategoryRequired ? translate('common.required') : ''} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
            }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1}/>)}
                        {shouldShowTags &&
            policyTagLists.map(({ name }, index) => {
                const tagVisibilityItem = tagVisibility.at(index);
                const shouldShow = tagVisibilityItem?.shouldShow ?? false;
                const isTagRequired = tagVisibilityItem?.isTagRequired ?? false;
                const prevShouldShow = previousTagsVisibility.at(index) ?? false;
                if (!shouldShow) {
                    return null;
                }
                return (<MenuItemWithTopDescription_1.default shouldShowRightIcon key={name} highlighted={!(0, TransactionUtils_1.getTagForDisplay)(splitExpenseDraftTransaction, index) && !prevShouldShow} title={(0, TransactionUtils_1.getTagForDisplay)(splitExpenseDraftTransaction, index)} description={name} shouldShowBasicTitle shouldShowDescriptionOnTop numberOfLinesTitle={2} rightLabel={isTagRequired ? translate('common.required') : ''} onPress={() => {
                        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, index, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
                    }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1}/>);
            })}
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon key={translate('common.date')} description={translate('common.date')} title={splitExpenseDraftTransactionDetails?.created} numberOfLinesTitle={2} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
        }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1}/>
                    </ScrollView_1.default>
                    <FixedFooter_1.default style={styles.mtAuto}>
                        {Number(splitExpensesList?.length) > 2 && (<Button_1.default danger large style={[styles.w100, styles.mb4]} text={translate('iou.removeSplit')} onPress={() => {
                (0, IOU_1.removeSplitExpenseField)(draftTransactionWithSplitExpenses, splitExpenseTransactionID);
                Navigation_1.default.goBack(backTo);
            }} pressOnEnter enterKeyEventListenerPriority={1}/>)}
                        <Button_1.default success large style={[styles.w100]} text={translate('common.save')} onPress={() => {
            (0, IOU_1.updateSplitExpenseField)(splitExpenseDraftTransaction, splitExpenseTransactionID);
            Navigation_1.default.goBack(backTo);
        }} pressOnEnter enterKeyEventListenerPriority={1}/>
                    </FixedFooter_1.default>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
SplitExpenseEditPage.displayName = 'SplitExpenseEditPage';
exports.default = SplitExpenseEditPage;
