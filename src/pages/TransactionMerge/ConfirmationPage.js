"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MoneyRequestView_1 = require("@components/ReportActionItem/MoneyRequestView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ConfirmationPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isMergingExpenses, setIsMergingExpenses] = (0, react_1.useState)(false);
    const { transactionID, backTo } = route.params;
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [mergeTransaction, mergeTransactionMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, { canBeMissing: true });
    const [targetTransaction = (0, MergeTransactionUtils_1.getTargetTransactionFromMergeTransaction)(mergeTransaction)] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mergeTransaction?.targetTransactionID}`, {
        canBeMissing: true,
    });
    const [sourceTransaction = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction)] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mergeTransaction?.sourceTransactionID}`, {
        canBeMissing: true,
    });
    const targetTransactionThreadReportID = (0, MergeTransactionUtils_1.getTransactionThreadReportID)(targetTransaction);
    const targetTransactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${targetTransactionThreadReportID}`];
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${targetTransactionThreadReport?.policyID}`, { canBeMissing: true });
    // Build the merged transaction data for display
    const mergedTransactionData = (0, react_1.useMemo)(() => (0, MergeTransactionUtils_1.buildMergedTransactionData)(targetTransaction, mergeTransaction), [targetTransaction, mergeTransaction]);
    const contextValue = (0, react_1.useMemo)(() => ({
        transactionThreadReport: targetTransactionThreadReport,
        action: undefined,
        report: targetTransactionThreadReport,
        checkIfContextMenuActive: () => { },
        onShowContextMenu: () => { },
        isReportArchived: false,
        anchor: null,
        isDisabled: false,
    }), [targetTransactionThreadReport]);
    const handleMergeExpenses = (0, react_1.useCallback)(() => {
        if (!targetTransaction || !mergeTransaction || !sourceTransaction) {
            return;
        }
        const reportID = mergeTransaction.reportID;
        setIsMergingExpenses(true);
        (0, MergeTransaction_1.mergeTransactionRequest)(transactionID, mergeTransaction, targetTransaction, sourceTransaction);
        const reportIDToDismiss = reportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID ? reportID : targetTransactionThreadReportID;
        if (reportID !== targetTransaction.reportID && reportIDToDismiss) {
            Navigation_1.default.dismissModalWithReport({ reportID: reportIDToDismiss });
        }
        else {
            Navigation_1.default.dismissModal();
        }
    }, [targetTransaction, mergeTransaction, sourceTransaction, transactionID, targetTransactionThreadReportID]);
    if ((0, isLoadingOnyxValue_1.default)(mergeTransactionMetadata) || !targetTransactionThreadReport?.reportID) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ConfirmationPage.displayName} shouldEnableMaxHeight includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={!mergeTransaction && !isMergingExpenses}>
                <HeaderWithBackButton_1.default title={translate('transactionMerge.confirmationPage.header')} onBackButtonPress={() => {
            Navigation_1.default.goBack(backTo);
        }}/>
                <ScrollView_1.default>
                    <react_native_1.View style={[styles.ph5, styles.pb8]}>
                        <Text_1.default>{translate('transactionMerge.confirmationPage.pageTitle')}</Text_1.default>
                    </react_native_1.View>
                    <ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextValue}>
                        <MoneyRequestView_1.default allReports={allReports} policy={policy} report={targetTransactionThreadReport} shouldShowAnimatedBackground={false} readonly updatedTransaction={mergedTransactionData} mergeTransactionID={transactionID}/>
                    </ShowContextMenuContext_1.ShowContextMenuContext.Provider>
                </ScrollView_1.default>
                <FixedFooter_1.default style={styles.ph5}>
                    <Button_1.default text={translate('transactionMerge.confirmationPage.confirmButton')} success onPress={handleMergeExpenses} large/>
                </FixedFooter_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ConfirmationPage.displayName = 'ConfirmationPage';
exports.default = ConfirmationPage;
