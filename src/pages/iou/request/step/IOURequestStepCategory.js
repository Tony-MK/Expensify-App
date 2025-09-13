"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const CategoryPicker_1 = require("@components/CategoryPicker");
const FixedFooter_1 = require("@components/FixedFooter");
const Illustrations = require("@components/Icon/Illustrations");
const SearchContext_1 = require("@components/Search/SearchContext");
const Text_1 = require("@components/Text");
const WorkspaceEmptyStateSection_1 = require("@components/WorkspaceEmptyStateSection");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const Category_1 = require("@libs/actions/Policy/Category");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepCategory({ report: reportReal, reportDraft, route: { params: { transactionID, backTo, action, iouType, reportActionID }, }, transaction, }) {
    const [policyReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${(0, IOU_1.getIOURequestPolicyID)(transaction, reportReal)}`, { canBeMissing: true });
    const [policyDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${(0, IOU_1.getIOURequestPolicyID)(transaction, reportDraft)}`, { canBeMissing: true });
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [policyCategoriesReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${(0, IOU_1.getIOURequestPolicyID)(transaction, reportReal)}`, { canBeMissing: true });
    const [policyCategoriesDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${(0, IOU_1.getIOURequestPolicyID)(transaction, reportDraft)}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${(0, IOU_1.getIOURequestPolicyID)(transaction, reportReal)}`, { canBeMissing: true });
    const report = reportReal ?? reportDraft;
    const policy = policyReal ?? policyDraft;
    const policyCategories = policyCategoriesReal ?? policyCategoriesDraft;
    const [allTransactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [policyTagLists] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policy?.id}`, { canBeMissing: true });
    const { currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isEditingSplit = (iouType === CONST_1.default.IOU.TYPE.SPLIT || iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE) && isEditing;
    const currentTransaction = isEditingSplit && !(0, isEmpty_1.default)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    const transactionCategory = (0, ReportUtils_1.getTransactionDetails)(currentTransaction)?.category ?? '';
    const categoryForDisplay = (0, CategoryUtils_1.isCategoryMissing)(transactionCategory) ? '' : transactionCategory;
    const shouldShowCategory = ((0, ReportUtils_1.isReportInGroupPolicy)(report) || (0, ReportUtils_1.isGroupPolicy)(policy?.type ?? '')) &&
        // The transactionCategory can be an empty string, so to maintain the logic we'd like to keep it in this shape until utils refactor
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (!!categoryForDisplay || (0, OptionsListUtils_1.hasEnabledOptions)(Object.values(policyCategories ?? {})));
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    const fetchData = () => {
        if ((!!policy && !!policyCategories) || !report?.policyID) {
            return;
        }
        (0, Category_1.getPolicyCategories)(report?.policyID);
    };
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchData });
    const isLoading = !isOffline && policyCategories === undefined;
    const shouldShowEmptyState = policyCategories !== undefined && !shouldShowCategory;
    const shouldShowOfflineView = policyCategories === undefined && isOffline;
    (0, react_1.useEffect)(() => {
        fetchData();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const updateCategory = (category) => {
        const categorySearchText = category.searchText ?? '';
        const isSelectedCategory = categorySearchText === categoryForDisplay;
        const updatedCategory = isSelectedCategory ? '' : categorySearchText;
        if (transaction) {
            // In the split flow, when editing we use SPLIT_TRANSACTION_DRAFT to save draft value
            if (isEditingSplit) {
                (0, IOU_1.setDraftSplitTransaction)(transaction.transactionID, { category: updatedCategory }, policy);
                navigateBack();
                return;
            }
            if (isEditing && report) {
                (0, IOU_1.updateMoneyRequestCategory)(transaction.transactionID, report.reportID, updatedCategory, policy, policyTags, policyCategories, currentSearchHash);
                navigateBack();
                return;
            }
        }
        (0, IOU_1.setMoneyRequestCategory)(transactionID, updatedCategory, policy?.id);
        if (action === CONST_1.default.IOU.ACTION.CATEGORIZE && !backTo) {
            if (report?.reportID) {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(action, iouType, transactionID, report.reportID));
            }
            return;
        }
        navigateBack();
    };
    return (<StepScreenWrapper_1.default headerTitle={translate('common.category')} onBackButtonPress={navigateBack} shouldShowWrapper shouldShowNotFoundPage={shouldShowNotFoundPage} shouldShowOfflineIndicator={policyCategories !== undefined} testID={IOURequestStepCategory.displayName} shouldEnableKeyboardAvoidingView={false}>
            {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
            {shouldShowOfflineView && <FullPageOfflineBlockingView_1.default>{null}</FullPageOfflineBlockingView_1.default>}
            {shouldShowEmptyState && (<react_native_1.View style={[styles.flex1]}>
                    <WorkspaceEmptyStateSection_1.default shouldStyleAsCard={false} icon={Illustrations.EmptyStateExpenses} title={translate('workspace.categories.emptyCategories.title')} subtitle={translate('workspace.categories.emptyCategories.subtitle')} containerStyle={[styles.flex1, styles.justifyContentCenter]}/>
                    {(0, PolicyUtils_1.isPolicyAdmin)(policy) && (<FixedFooter_1.default style={[styles.mtAuto, styles.pt5]}>
                            <Button_1.default large success style={[styles.w100]} onPress={() => {
                    if (!policy?.id || !report?.reportID) {
                        return;
                    }
                    if (!policy.areCategoriesEnabled) {
                        (0, Category_1.enablePolicyCategories)(policy.id, true, policyTagLists, allTransactionViolations, false);
                    }
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.getRoute(policy.id, ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(action, iouType, transactionID, report.reportID, backTo, reportActionID)));
                    });
                }} text={translate('workspace.categories.editCategories')} pressOnEnter/>
                        </FixedFooter_1.default>)}
                </react_native_1.View>)}
            {!shouldShowEmptyState && !isLoading && !shouldShowOfflineView && (<>
                    <Text_1.default style={[styles.ph5, styles.pv3]}>{translate('iou.categorySelection')}</Text_1.default>
                    <CategoryPicker_1.default selectedCategory={categoryForDisplay} policyID={report?.policyID ?? policy?.id} onSubmit={updateCategory}/>
                </>)}
        </StepScreenWrapper_1.default>);
}
IOURequestStepCategory.displayName = 'IOURequestStepCategory';
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepCategoryWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepCategory);
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepCategoryWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepCategoryWithFullTransactionOrNotFound);
exports.default = IOURequestStepCategoryWithWritableReportOrNotFound;
