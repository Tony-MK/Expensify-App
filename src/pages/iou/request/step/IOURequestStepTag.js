"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const Illustrations_1 = require("@components/Icon/Illustrations");
const SearchContext_1 = require("@components/Search/SearchContext");
const TagPicker_1 = require("@components/TagPicker");
const Text_1 = require("@components/Text");
const WorkspaceEmptyStateSection_1 = require("@components/WorkspaceEmptyStateSection");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepTag({ report, route: { params: { action, orderWeight: rawTagIndex, transactionID, backTo, iouType, reportActionID }, }, transaction, }) {
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: false });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${report?.policyID}`, { canBeMissing: false });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${report?.policyID}`, { canBeMissing: false });
    const styles = (0, useThemeStyles_1.default)();
    const { currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const { translate } = (0, useLocalize_1.default)();
    const tagListIndex = Number(rawTagIndex);
    const policyTagListName = (0, PolicyUtils_1.getTagListName)(policyTags, tagListIndex);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isSplitExpense = iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE;
    const isEditingSplit = (isSplitBill || isSplitExpense) && isEditing;
    const currentTransaction = isEditingSplit && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    const transactionTag = (0, TransactionUtils_1.getTag)(currentTransaction);
    const tag = (0, TransactionUtils_1.getTag)(currentTransaction, tagListIndex);
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTags), [policyTags]);
    const hasDependentTags = (0, react_1.useMemo)(() => (0, PolicyUtils_1.hasDependentTags)(policy, policyTags), [policy, policyTags]);
    const shouldShowTag = transactionTag || (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const updateTag = (selectedTag) => {
        const isSelectedTag = selectedTag.searchText === tag;
        const searchText = selectedTag.searchText ?? '';
        let updatedTag;
        if (hasDependentTags) {
            const tagParts = transactionTag ? (0, TransactionUtils_1.getTagArrayFromName)(transactionTag) : [];
            if (isSelectedTag) {
                // Deselect: clear this and all child tags
                tagParts.splice(tagListIndex);
            }
            else {
                // Select new tag: replace this index and clear child tags
                tagParts.splice(tagListIndex, tagParts.length - tagListIndex, searchText);
                // Check for auto-selection of subsequent tags
                for (let i = tagListIndex + 1; i < policyTagLists.length; i++) {
                    const availableNextLevelTags = (0, PolicyUtils_1.getTagList)(policyTags, i);
                    const enabledTags = Object.values(availableNextLevelTags.tags).filter((t) => t.enabled);
                    if (enabledTags.length === 1) {
                        // If there is only one enabled tag, we can auto-select it
                        const firstTag = enabledTags.at(0);
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
            updatedTag = (0, IOUUtils_1.insertTagIntoTransactionTagsString)(transactionTag, isSelectedTag ? '' : searchText, tagListIndex, policy?.hasMultipleTagLists ?? false);
        }
        if (isEditingSplit) {
            (0, IOU_1.setDraftSplitTransaction)(transactionID, { tag: updatedTag });
            navigateBack();
            return;
        }
        if (isEditing) {
            (0, IOU_1.updateMoneyRequestTag)(transactionID, report?.reportID, updatedTag, policy, policyTags, policyCategories, currentSearchHash);
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
                            <Button_1.default large success style={[styles.w100]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_TAGS_ROOT.getRoute(policy?.id, ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(action, iouType, tagListIndex, transactionID, report?.reportID, backTo, reportActionID)))} text={translate('workspace.tags.editTags')} pressOnEnter/>
                        </FixedFooter_1.default>)}
                </react_native_1.View>)}
            {!!shouldShowTag && (<>
                    <Text_1.default style={[styles.ph5, styles.pv3]}>{translate('iou.tagSelection')}</Text_1.default>
                    <TagPicker_1.default policyID={report?.policyID} tagListName={policyTagListName} tagListIndex={tagListIndex} selectedTag={tag} transactionTag={transactionTag} hasDependentTags={hasDependentTags} onSubmit={updateTag}/>
                </>)}
        </StepScreenWrapper_1.default>);
}
IOURequestStepTag.displayName = 'IOURequestStepTag';
exports.default = (0, withWritableReportOrNotFound_1.default)((0, withFullTransactionOrNotFound_1.default)(IOURequestStepTag));
