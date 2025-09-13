"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var Illustrations_1 = require("@components/Icon/Illustrations");
var SearchContext_1 = require("@components/Search/SearchContext");
var TagPicker_1 = require("@components/TagPicker");
var Text_1 = require("@components/Text");
var WorkspaceEmptyStateSection_1 = require("@components/WorkspaceEmptyStateSection");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOU_1 = require("@libs/actions/IOU");
var IOUUtils_1 = require("@libs/IOUUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var StepScreenWrapper_1 = require("./StepScreenWrapper");
var withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
var withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepTag(_a) {
    var report = _a.report, _b = _a.route.params, action = _b.action, rawTagIndex = _b.orderWeight, transactionID = _b.transactionID, backTo = _b.backTo, iouType = _b.iouType, reportActionID = _b.reportActionID, transaction = _a.transaction;
    var splitDraftTransaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT).concat(transactionID), { canBeMissing: true })[0];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var policyCategories = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var styles = (0, useThemeStyles_1.default)();
    var currentSearchHash = (0, SearchContext_1.useSearchContext)().currentSearchHash;
    var translate = (0, useLocalize_1.default)().translate;
    var tagListIndex = Number(rawTagIndex);
    var policyTagListName = (0, PolicyUtils_1.getTagListName)(policyTags, tagListIndex);
    var isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    var isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    var isSplitExpense = iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE;
    var isEditingSplit = (isSplitBill || isSplitExpense) && isEditing;
    var currentTransaction = isEditingSplit && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    var transactionTag = (0, TransactionUtils_1.getTag)(currentTransaction);
    var tag = (0, TransactionUtils_1.getTag)(currentTransaction, tagListIndex);
    var policyTagLists = (0, react_1.useMemo)(function () { return (0, PolicyUtils_1.getTagLists)(policyTags); }, [policyTags]);
    var hasDependentTags = (0, react_1.useMemo)(function () { return (0, PolicyUtils_1.hasDependentTags)(policy, policyTags); }, [policy, policyTags]);
    var shouldShowTag = transactionTag || (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    var navigateBack = function () {
        Navigation_1.default.goBack(backTo);
    };
    var updateTag = function (selectedTag) {
        var _a, _b;
        var isSelectedTag = selectedTag.searchText === tag;
        var searchText = (_a = selectedTag.searchText) !== null && _a !== void 0 ? _a : '';
        var updatedTag;
        if (hasDependentTags) {
            var tagParts = transactionTag ? (0, TransactionUtils_1.getTagArrayFromName)(transactionTag) : [];
            if (isSelectedTag) {
                // Deselect: clear this and all child tags
                tagParts.splice(tagListIndex);
            }
            else {
                // Select new tag: replace this index and clear child tags
                tagParts.splice(tagListIndex, tagParts.length - tagListIndex, searchText);
                // Check for auto-selection of subsequent tags
                for (var i = tagListIndex + 1; i < policyTagLists.length; i++) {
                    var availableNextLevelTags = (0, PolicyUtils_1.getTagList)(policyTags, i);
                    var enabledTags = Object.values(availableNextLevelTags.tags).filter(function (t) { return t.enabled; });
                    if (enabledTags.length === 1) {
                        // If there is only one enabled tag, we can auto-select it
                        var firstTag = enabledTags.at(0);
                        if (firstTag) {
                            tagParts.push(firstTag.name);
                        }
                    }
                    else {
                        // If there are no enabled tags or more than one, stop auto-selecting
                        break;
                    }
                }
            }
            updatedTag = tagParts.join(':');
        }
        else {
            // Independent tags (fallback): use comma-separated list
            updatedTag = (0, IOUUtils_1.insertTagIntoTransactionTagsString)(transactionTag, isSelectedTag ? '' : searchText, tagListIndex, (_b = policy === null || policy === void 0 ? void 0 : policy.hasMultipleTagLists) !== null && _b !== void 0 ? _b : false);
        }
        if (isEditingSplit) {
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { tag: updatedTag });
            navigateBack();
            return;
        }
        if (isEditing) {
            (0, IOU_1.updateMoneyRequestTag)(transactionID, report === null || report === void 0 ? void 0 : report.reportID, updatedTag, policy, policyTags, policyCategories, currentSearchHash);
            navigateBack();
            return;
        }
        (0, IOU_1.setMoneyRequestTag)(transactionID, updatedTag);
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={policyTagListName} onBackButtonPress={navigateBack} shouldShowWrapper testID={IOURequestStepTag.displayName} shouldShowNotFoundPage={shouldShowNotFoundPage}>
            {!shouldShowTag && (<react_native_1.View style={[styles.flex1]}>
                    <WorkspaceEmptyStateSection_1.default shouldStyleAsCard={false} icon={Illustrations_1.EmptyStateExpenses} title={translate('workspace.tags.emptyTags.title')} subtitle={translate('workspace.tags.emptyTags.subtitle')} containerStyle={[styles.flex1, styles.justifyContentCenter]}/>
                    {(0, PolicyUtils_1.isPolicyAdmin)(policy) && (<FixedFooter_1.default style={[styles.mtAuto, styles.pt5]}>
                            <Button_1.default large success style={[styles.w100]} onPress={function () {
                    return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policy === null || policy === void 0 ? void 0 : policy.id, ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(action, iouType, tagListIndex, transactionID, report === null || report === void 0 ? void 0 : report.reportID, backTo, reportActionID)));
                }} text={translate('workspace.tags.editTags')} pressOnEnter/>
                        </FixedFooter_1.default>)}
                </react_native_1.View>)}
            {!!shouldShowTag && (<>
                    <Text_1.default style={[styles.ph5, styles.pv3]}>{translate('iou.tagSelection')}</Text_1.default>
                    <TagPicker_1.default policyID={report === null || report === void 0 ? void 0 : report.policyID} tagListName={policyTagListName} tagListIndex={tagListIndex} selectedTag={tag} transactionTag={transactionTag} hasDependentTags={hasDependentTags} onSubmit={updateTag}/>
                </>)}
        </StepScreenWrapper_1.default>);
}
IOURequestStepTag.displayName = 'IOURequestStepTag';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepTag));
