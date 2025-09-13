"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var MoneyRequestView_1 = require("@components/ReportActionItem/MoneyRequestView");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MergeTransaction_1 = require("@libs/actions/MergeTransaction");
var MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ConfirmationPage(_a) {
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var _b = (0, react_1.useState)(false), isMergingExpenses = _b[0], setIsMergingExpenses = _b[1];
    var _c = route.params, transactionID = _c.transactionID, backTo = _c.backTo;
    var allReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false })[0];
    var _d = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), { canBeMissing: true }), mergeTransaction = _d[0], mergeTransactionMetadata = _d[1];
    var _e = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.targetTransactionID), {
        canBeMissing: true,
    })[0], targetTransaction = _e === void 0 ? (0, MergeTransactionUtils_1.getTargetTransactionFromMergeTransaction)(mergeTransaction) : _e;
    var _f = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.sourceTransactionID), {
        canBeMissing: true,
    })[0], sourceTransaction = _f === void 0 ? (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction) : _f;
    var targetTransactionThreadReportID = (0, MergeTransactionUtils_1.getTransactionThreadReportID)(targetTransaction);
    var targetTransactionThreadReport = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(targetTransactionThreadReportID)];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(targetTransactionThreadReport === null || targetTransactionThreadReport === void 0 ? void 0 : targetTransactionThreadReport.policyID), { canBeMissing: true })[0];
    // Build the merged transaction data for display
    var mergedTransactionData = (0, react_1.useMemo)(function () { return (0, MergeTransactionUtils_1.buildMergedTransactionData)(targetTransaction, mergeTransaction); }, [targetTransaction, mergeTransaction]);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        transactionThreadReport: targetTransactionThreadReport,
        action: undefined,
        report: targetTransactionThreadReport,
        checkIfContextMenuActive: function () { },
        onShowContextMenu: function () { },
        isReportArchived: false,
        anchor: null,
        isDisabled: false,
    }); }, [targetTransactionThreadReport]);
    var handleMergeExpenses = (0, react_1.useCallback)(function () {
        if (!targetTransaction || !mergeTransaction || !sourceTransaction) {
            return;
        }
        var reportID = mergeTransaction.reportID;
        setIsMergingExpenses(true);
        (0, MergeTransaction_1.mergeTransactionRequest)(transactionID, mergeTransaction, targetTransaction, sourceTransaction);
        var reportIDToDismiss = reportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID ? reportID : targetTransactionThreadReportID;
        if (reportID !== targetTransaction.reportID && reportIDToDismiss) {
            Navigation_1.default.dismissModalWithReport({ reportID: reportIDToDismiss });
        }
        else {
            Navigation_1.default.dismissModal();
        }
    }, [targetTransaction, mergeTransaction, sourceTransaction, transactionID, targetTransactionThreadReportID]);
    if ((0, isLoadingOnyxValue_1.default)(mergeTransactionMetadata) || !(targetTransactionThreadReport === null || targetTransactionThreadReport === void 0 ? void 0 : targetTransactionThreadReport.reportID)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ConfirmationPage.displayName} shouldEnableMaxHeight includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={!mergeTransaction && !isMergingExpenses}>
                <HeaderWithBackButton_1.default title={translate('transactionMerge.confirmationPage.header')} onBackButtonPress={function () {
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
