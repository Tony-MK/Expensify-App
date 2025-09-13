"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const Report_1 = require("@userActions/Report");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const MergeFieldReview_1 = require("./MergeFieldReview");
function DetailsReviewPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { transactionID, backTo } = route.params;
    const [mergeTransaction, mergeTransactionMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, { canBeMissing: false });
    const [targetTransaction = (0, MergeTransactionUtils_1.getTargetTransactionFromMergeTransaction)(mergeTransaction)] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mergeTransaction?.targetTransactionID}`, {
        canBeMissing: true,
    });
    const [hasOnceLoadedTransactionThreadReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${targetTransaction?.reportID}`, {
        selector: (value) => value?.hasOnceLoadedReportActions,
        canBeMissing: true,
    });
    const targetTransactionThreadReportID = (0, MergeTransactionUtils_1.getTransactionThreadReportID)(targetTransaction);
    const [iouReportForTargetTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${targetTransaction?.reportID}`, { canBeMissing: true });
    const [iouActionForTargetTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${targetTransaction?.reportID}`, {
        selector: (value) => {
            if (!hasOnceLoadedTransactionThreadReportActions || !!targetTransactionThreadReportID || !targetTransaction?.transactionID) {
                return undefined;
            }
            return (0, ReportActionsUtils_1.getIOUActionForTransactionID)(Object.values(value ?? {}), targetTransaction?.transactionID);
        },
        canBeMissing: true,
    }, [hasOnceLoadedTransactionThreadReportActions, targetTransactionThreadReportID, targetTransaction?.transactionID]);
    const [sourceTransaction = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction)] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mergeTransaction?.sourceTransactionID}`, {
        canBeMissing: true,
    });
    const [targetTransactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${targetTransactionThreadReportID}`, { canBeMissing: true });
    const [currentUserEmail] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (value) => value?.email, canBeMissing: false });
    const [hasErrors, setHasErrors] = (0, react_1.useState)({});
    const [conflictFields, setConflictFields] = (0, react_1.useState)([]);
    const [isCheckingDataBeforeGoNext, setIsCheckingDataBeforeGoNext] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!transactionID || !targetTransaction || !sourceTransaction) {
            return;
        }
        const { conflictFields: detectedConflictFields, mergeableData } = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(targetTransaction, sourceTransaction);
        (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, mergeableData);
        setConflictFields(detectedConflictFields);
    }, [targetTransaction, sourceTransaction, transactionID]);
    (0, react_1.useEffect)(() => {
        if (!isCheckingDataBeforeGoNext) {
            return;
        }
        // When user selects a card transaction to merge, that card transaction becomes the target transaction.
        // The App may not have the transaction thread report loaded for card transactions, so we need to trigger
        // OpenReport to ensure the transaction thread report is available for confirmation page
        if (!targetTransactionThreadReportID && targetTransaction?.reportID) {
            // If the report was already loaded before, but there are still no transaction thread report info, it means it hasn't been created yet.
            // So we should create it.
            if (hasOnceLoadedTransactionThreadReportActions) {
                (0, Report_1.createTransactionThreadReport)(iouReportForTargetTransaction, iouActionForTargetTransaction);
                setIsCheckingDataBeforeGoNext(false);
                Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_CONFIRMATION_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
                return;
            }
            return (0, Report_1.openReport)(targetTransaction.reportID);
        }
        if (targetTransactionThreadReportID && !targetTransactionThreadReport) {
            return (0, Report_1.openReport)(targetTransactionThreadReportID);
        }
        // We need to wait for report to be loaded completely, avoid still optimistic loading
        if (!targetTransactionThreadReport?.reportID) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_CONFIRMATION_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
        setIsCheckingDataBeforeGoNext(false);
    }, [
        isCheckingDataBeforeGoNext,
        targetTransactionThreadReportID,
        targetTransaction?.reportID,
        targetTransactionThreadReport,
        transactionID,
        hasOnceLoadedTransactionThreadReportActions,
        iouActionForTargetTransaction,
        iouReportForTargetTransaction,
        currentUserEmail,
        targetTransaction?.transactionID,
    ]);
    // Handle selection
    const handleSelect = (0, react_1.useCallback)((transaction, field) => {
        const fieldValue = (0, MergeTransactionUtils_1.getMergeFieldValue)((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, field);
        // Clear error if it has
        setHasErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        // Update both the field value and track which transaction was selected (persisted in Onyx)
        const currentSelections = mergeTransaction?.selectedTransactionByField ?? {};
        (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, {
            [field]: fieldValue,
            ...(field === 'amount' && { currency: (0, TransactionUtils_1.getCurrency)(transaction) }),
            selectedTransactionByField: {
                ...currentSelections,
                [field]: transaction.transactionID,
            },
        });
    }, [mergeTransaction, transactionID]);
    // Handle continue
    const handleContinue = (0, react_1.useCallback)(() => {
        if (!mergeTransaction) {
            return;
        }
        const newHasErrors = {};
        conflictFields.forEach((field) => {
            if (!(0, MergeTransactionUtils_1.isEmptyMergeValue)(mergeTransaction[field])) {
                return;
            }
            newHasErrors[field] = true;
        });
        setHasErrors(newHasErrors);
        if ((0, EmptyObject_1.isEmptyObject)(newHasErrors)) {
            setIsCheckingDataBeforeGoNext(true);
        }
    }, [mergeTransaction, conflictFields]);
    // Build merge fields array with all necessary information
    const mergeFields = (0, react_1.useMemo)(() => (0, MergeTransactionUtils_1.buildMergeFieldsData)(conflictFields, targetTransaction, sourceTransaction, mergeTransaction, translate), [conflictFields, targetTransaction, sourceTransaction, mergeTransaction, translate]);
    // If this screen has multiple "selection cards" on it and the user skips one or more, show an error above the footer button
    const shouldShowSubmitError = conflictFields.length > 1 && !(0, EmptyObject_1.isEmptyObject)(hasErrors);
    if ((0, isLoadingOnyxValue_1.default)(mergeTransactionMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={DetailsReviewPage.displayName} shouldEnableMaxHeight includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={!mergeTransaction}>
                <HeaderWithBackButton_1.default title={translate('transactionMerge.detailsPage.header')} onBackButtonPress={() => {
            Navigation_1.default.goBack(backTo);
        }}/>
                <ScrollView_1.default style={[styles.flex1, styles.ph5]}>
                    <react_native_1.View style={[styles.mb5]}>
                        <Text_1.default>{translate('transactionMerge.detailsPage.pageTitle')}</Text_1.default>
                    </react_native_1.View>
                    {mergeFields.map((mergeField) => (<MergeFieldReview_1.default key={mergeField.field} mergeField={mergeField} onValueSelected={handleSelect} errorText={hasErrors[mergeField.field] ? translate('transactionMerge.detailsPage.pleaseSelectError', { field: mergeField.label }) : undefined}/>))}
                </ScrollView_1.default>
                <FixedFooter_1.default style={styles.ph5}>
                    {shouldShowSubmitError && (<FormHelpMessage_1.default message={translate('transactionMerge.detailsPage.selectAllDetailsError')} style={[styles.pv2]}/>)}
                    <Button_1.default large success text={translate('common.continue')} onPress={handleContinue} isDisabled={!(0, EmptyObject_1.isEmptyObject)(hasErrors)} isLoading={isCheckingDataBeforeGoNext} pressOnEnter/>
                </FixedFooter_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
DetailsReviewPage.displayName = 'DetailsReviewPage';
exports.default = DetailsReviewPage;
