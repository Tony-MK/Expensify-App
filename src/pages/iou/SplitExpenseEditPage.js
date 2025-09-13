"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var usePrevious_1 = require("@hooks/usePrevious");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOU_1 = require("@libs/actions/IOU");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Parser_1 = require("@libs/Parser");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SplitExpenseEditPage(_a) {
    var _b, _c, _d, _e, _f;
    var route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _g = route.params, reportID = _g.reportID, transactionID = _g.transactionID, _h = _g.splitExpenseTransactionID, splitExpenseTransactionID = _h === void 0 ? '' : _h, backTo = _g.backTo;
    var report = (0, ReportUtils_1.getReportOrDraftReport)(reportID);
    var splitExpenseDraftTransaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID), { canBeMissing: false })[0];
    var splitExpenseDraftTransactionDetails = (0, react_1.useMemo)(function () { var _a; return (_a = (0, ReportUtils_1.getTransactionDetails)(splitExpenseDraftTransaction)) !== null && _a !== void 0 ? _a : {}; }, [splitExpenseDraftTransaction]);
    var policy = (0, usePolicy_1.default)(report === null || report === void 0 ? void 0 : report.policyID);
    var policyCategories = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var transaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat((0, getNonEmptyStringOnyxID_1.default)(transactionID)), { canBeMissing: false })[0];
    var transactionDetails = (0, react_1.useMemo)(function () { var _a; return (_a = (0, ReportUtils_1.getTransactionDetails)(transaction)) !== null && _a !== void 0 ? _a : {}; }, [transaction]);
    var transactionDetailsAmount = (_b = transactionDetails === null || transactionDetails === void 0 ? void 0 : transactionDetails.amount) !== null && _b !== void 0 ? _b : 0;
    var draftTransactionWithSplitExpenses = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID), { canBeMissing: false })[0];
    var splitExpensesList = (_c = draftTransactionWithSplitExpenses === null || draftTransactionWithSplitExpenses === void 0 ? void 0 : draftTransactionWithSplitExpenses.comment) === null || _c === void 0 ? void 0 : _c.splitExpenses;
    var currentAmount = transactionDetailsAmount >= 0 ? Math.abs(Number(splitExpenseDraftTransactionDetails === null || splitExpenseDraftTransactionDetails === void 0 ? void 0 : splitExpenseDraftTransactionDetails.amount)) : Number(splitExpenseDraftTransactionDetails === null || splitExpenseDraftTransactionDetails === void 0 ? void 0 : splitExpenseDraftTransactionDetails.amount);
    var currentDescription = (0, ReportUtils_1.getParsedComment)(Parser_1.default.htmlToMarkdown((_d = splitExpenseDraftTransactionDetails === null || splitExpenseDraftTransactionDetails === void 0 ? void 0 : splitExpenseDraftTransactionDetails.comment) !== null && _d !== void 0 ? _d : ''));
    var shouldShowCategory = !!(policy === null || policy === void 0 ? void 0 : policy.areCategoriesEnabled) && !!policyCategories;
    var transactionTag = (0, TransactionUtils_1.getTag)(splitExpenseDraftTransaction);
    var policyTagLists = (0, react_1.useMemo)(function () { return (0, PolicyUtils_1.getTagLists)(policyTags); }, [policyTags]);
    var isSplitAvailable = report && transaction && (0, ReportSecondaryActionUtils_1.isSplitAction)(report, [transaction], policy);
    var isCategoryRequired = !!(policy === null || policy === void 0 ? void 0 : policy.requiresCategory);
    var shouldShowTags = !!(policy === null || policy === void 0 ? void 0 : policy.areTagsEnabled) && !!(transactionTag || (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists));
    var tagVisibility = (0, react_1.useMemo)(function () {
        return (0, TagsOptionsListUtils_1.getTagVisibility)({
            shouldShowTags: shouldShowTags,
            policy: policy,
            policyTags: policyTags,
            transaction: splitExpenseDraftTransaction,
        });
    }, [shouldShowTags, policy, policyTags, splitExpenseDraftTransaction]);
    var previousTagsVisibility = (_e = (0, usePrevious_1.default)(tagVisibility.map(function (v) { return v.shouldShow; }))) !== null && _e !== void 0 ? _e : [];
    return (<ScreenWrapper_1.default testID={SplitExpenseEditPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!reportID || (0, EmptyObject_1.isEmptyObject)(splitExpenseDraftTransaction) || !isSplitAvailable}>
                <react_native_1.View style={[styles.flex1]}>
                    <HeaderWithBackButton_1.default title={translate('iou.splitExpenseEditTitle', {
            amount: (0, CurrencyUtils_1.convertToDisplayString)(currentAmount, splitExpenseDraftTransactionDetails === null || splitExpenseDraftTransactionDetails === void 0 ? void 0 : splitExpenseDraftTransactionDetails.currency),
            merchant: (_f = splitExpenseDraftTransaction === null || splitExpenseDraftTransaction === void 0 ? void 0 : splitExpenseDraftTransaction.merchant) !== null && _f !== void 0 ? _f : '',
        })} onBackButtonPress={function () { return Navigation_1.default.goBack(backTo); }}/>
                    <ScrollView_1.default>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon shouldRenderAsHTML key={translate('common.description')} description={translate('common.description')} title={currentDescription} onPress={function () {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
        }} style={[styles.moneyRequestMenuItem]} titleWrapperStyle={styles.flex1} numberOfLinesTitle={2}/>
                        {shouldShowCategory && (<MenuItemWithTopDescription_1.default shouldShowRightIcon key={translate('common.category')} description={translate('common.category')} title={splitExpenseDraftTransactionDetails === null || splitExpenseDraftTransactionDetails === void 0 ? void 0 : splitExpenseDraftTransactionDetails.category} numberOfLinesTitle={2} rightLabel={isCategoryRequired ? translate('common.required') : ''} onPress={function () {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
            }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1}/>)}
                        {shouldShowTags &&
            policyTagLists.map(function (_a, index) {
                var _b, _c, _d;
                var name = _a.name;
                var tagVisibilityItem = tagVisibility.at(index);
                var shouldShow = (_b = tagVisibilityItem === null || tagVisibilityItem === void 0 ? void 0 : tagVisibilityItem.shouldShow) !== null && _b !== void 0 ? _b : false;
                var isTagRequired = (_c = tagVisibilityItem === null || tagVisibilityItem === void 0 ? void 0 : tagVisibilityItem.isTagRequired) !== null && _c !== void 0 ? _c : false;
                var prevShouldShow = (_d = previousTagsVisibility.at(index)) !== null && _d !== void 0 ? _d : false;
                if (!shouldShow) {
                    return null;
                }
                return (<MenuItemWithTopDescription_1.default shouldShowRightIcon key={name} highlighted={!(0, TransactionUtils_1.getTagForDisplay)(splitExpenseDraftTransaction, index) && !prevShouldShow} title={(0, TransactionUtils_1.getTagForDisplay)(splitExpenseDraftTransaction, index)} description={name} shouldShowBasicTitle shouldShowDescriptionOnTop numberOfLinesTitle={2} rightLabel={isTagRequired ? translate('common.required') : ''} onPress={function () {
                        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, index, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
                    }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1}/>);
            })}
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon key={translate('common.date')} description={translate('common.date')} title={splitExpenseDraftTransactionDetails === null || splitExpenseDraftTransactionDetails === void 0 ? void 0 : splitExpenseDraftTransactionDetails.created} numberOfLinesTitle={2} onPress={function () {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DATE.getRoute(CONST_1.default.IOU.ACTION.EDIT, CONST_1.default.IOU.TYPE.SPLIT_EXPENSE, CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID, reportID, Navigation_1.default.getActiveRoute()));
        }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1}/>
                    </ScrollView_1.default>
                    <FixedFooter_1.default style={styles.mtAuto}>
                        {Number(splitExpensesList === null || splitExpensesList === void 0 ? void 0 : splitExpensesList.length) > 2 && (<Button_1.default danger large style={[styles.w100, styles.mb4]} text={translate('iou.removeSplit')} onPress={function () {
                (0, IOU_1.removeSplitExpenseField)(draftTransactionWithSplitExpenses, splitExpenseTransactionID);
                Navigation_1.default.goBack(backTo);
            }} pressOnEnter enterKeyEventListenerPriority={1}/>)}
                        <Button_1.default success large style={[styles.w100]} text={translate('common.save')} onPress={function () {
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
