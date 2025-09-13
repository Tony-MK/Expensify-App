"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const Button_1 = require("@components/Button");
const DestinationPicker_1 = require("@components/DestinationPicker");
const FixedFooter_1 = require("@components/FixedFooter");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const WorkspaceEmptyStateSection_1 = require("@components/WorkspaceEmptyStateSection");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDestination({ report, route: { params: { transactionID, backTo, action, iouType, reportID }, }, transaction, openedFromStartPage = false, explicitPolicyID, }) {
    const [policy, policyMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${explicitPolicyID ?? (0, IOU_1.getIOURequestPolicyID)(transaction, report)}`, { canBeMissing: false });
    const { accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    const policyExpenseReport = policy?.id ? (0, ReportUtils_1.getPolicyExpenseChat)(accountID, policy.id) : undefined;
    const { top } = (0, useSafeAreaInsets_1.default)();
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const selectedDestination = transaction?.comment?.customUnit?.customUnitRateID;
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, EmptyObject_1.isEmptyObject)(policy);
    const { isOffline } = (0, useNetwork_1.default)();
    const isLoading = !isOffline && (0, isLoadingOnyxValue_1.default)(policyMetadata);
    const shouldShowEmptyState = (0, EmptyObject_1.isEmptyObject)(customUnit?.rates) && !isOffline;
    const shouldShowOfflineView = (0, EmptyObject_1.isEmptyObject)(customUnit?.rates) && isOffline;
    const navigateBack = () => {
        Navigation_1.default.goBack(backTo);
    };
    const updateDestination = (destination) => {
        if ((0, EmptyObject_1.isEmptyObject)(customUnit)) {
            return;
        }
        if (selectedDestination !== destination.keyForList) {
            if (openedFromStartPage) {
                (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, policyExpenseReport);
                (0, IOU_1.setCustomUnitID)(transactionID, customUnit.customUnitID);
                (0, IOU_1.setMoneyRequestCategory)(transactionID, customUnit?.defaultCategory ?? '');
            }
            (0, IOU_1.setCustomUnitRateID)(transactionID, destination.keyForList ?? '');
            (0, IOU_1.setMoneyRequestCurrency)(transactionID, destination.currency);
            (0, IOU_1.clearSubrates)(transactionID);
        }
        if (backTo) {
            navigateBack();
        }
        else if (explicitPolicyID && transaction?.isFromGlobalCreate) {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TIME.getRoute(action, iouType, transactionID, policyExpenseReport?.reportID ?? reportID));
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TIME.getRoute(action, iouType, transactionID, reportID));
        }
    };
    const tabTitles = {
        [CONST_1.default.IOU.TYPE.REQUEST]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SUBMIT]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SEND]: translate('iou.paySomeone', { name: '' }),
        [CONST_1.default.IOU.TYPE.PAY]: translate('iou.paySomeone', { name: '' }),
        [CONST_1.default.IOU.TYPE.SPLIT]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.SPLIT_EXPENSE]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.TRACK]: translate('iou.createExpense'),
        [CONST_1.default.IOU.TYPE.INVOICE]: translate('workspace.invoices.sendInvoice'),
        [CONST_1.default.IOU.TYPE.CREATE]: translate('iou.createExpense'),
    };
    return (<ScreenWrapper_1.default includePaddingTop={false} keyboardVerticalOffset={variables_1.default.contentHeaderHeight + top + variables_1.default.tabSelectorButtonHeight + variables_1.default.tabSelectorButtonPadding} testID={`${IOURequestStepDestination.displayName}-container`}>
            <StepScreenWrapper_1.default headerTitle={backTo ? translate('common.destination') : tabTitles[iouType]} onBackButtonPress={navigateBack} shouldShowWrapper={!openedFromStartPage} shouldShowNotFoundPage={shouldShowNotFoundPage} testID={IOURequestStepDestination.displayName}>
                {isLoading && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.spinner}/>)}
                {shouldShowOfflineView && <FullPageOfflineBlockingView_1.default>{null}</FullPageOfflineBlockingView_1.default>}
                {shouldShowEmptyState && (<react_native_1.View style={[styles.flex1]}>
                        <WorkspaceEmptyStateSection_1.default shouldStyleAsCard={false} icon={Illustrations.EmptyStateExpenses} title={translate('workspace.perDiem.emptyList.title')} subtitle={translate('workspace.perDiem.emptyList.subtitle')} containerStyle={[styles.flex1, styles.justifyContentCenter]}/>
                        {(0, PolicyUtils_1.isPolicyAdmin)(policy) && !!policy?.areCategoriesEnabled && (<FixedFooter_1.default style={[styles.mtAuto, styles.pt5]}>
                                <Button_1.default large success style={[styles.w100]} onPress={() => {
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_PER_DIEM.getRoute(policy.id, Navigation_1.default.getActiveRoute()));
                    });
                }} text={translate('workspace.perDiem.editPerDiemRates')} pressOnEnter/>
                            </FixedFooter_1.default>)}
                    </react_native_1.View>)}
                {!shouldShowEmptyState && !isLoading && !shouldShowOfflineView && !!policy?.id && (<DestinationPicker_1.default selectedDestination={selectedDestination} policyID={policy.id} onSubmit={updateDestination}/>)}
            </StepScreenWrapper_1.default>
        </ScreenWrapper_1.default>);
}
IOURequestStepDestination.displayName = 'IOURequestStepDestination';
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepDestinationWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDestination);
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepDestinationWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDestinationWithFullTransactionOrNotFound);
exports.default = IOURequestStepDestinationWithWritableReportOrNotFound;
