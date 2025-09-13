"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var Button_1 = require("@components/Button");
var FixedFooter_1 = require("@components/FixedFooter");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MergeTransaction_1 = require("@libs/actions/MergeTransaction");
var MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var TransactionMergeReceipts_1 = require("./TransactionMergeReceipts");
function ReceiptReviewPage(_a) {
    var _b;
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var _c = route.params, transactionID = _c.transactionID, backTo = _c.backTo;
    var _d = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), { canBeMissing: false }), mergeTransaction = _d[0], mergeTransactionMetadata = _d[1];
    var _e = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.targetTransactionID), {
        canBeMissing: true,
    })[0], targetTransaction = _e === void 0 ? (0, MergeTransactionUtils_1.getTargetTransactionFromMergeTransaction)(mergeTransaction) : _e;
    var _f = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.sourceTransactionID), {
        canBeMissing: true,
    })[0], sourceTransaction = _f === void 0 ? (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction) : _f;
    var transactions = [targetTransaction, sourceTransaction].filter(function (transaction) { return !!transaction; });
    var handleSelect = function (receipt) {
        (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, { receipt: receipt });
    };
    var handleContinue = function () {
        if (!(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.receipt)) {
            return;
        }
        var _a = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(targetTransaction, sourceTransaction), conflictFields = _a.conflictFields, mergeableData = _a.mergeableData;
        if (!conflictFields.length) {
            // If there are no conflict fields, we should set mergeable data and navigate to the confirmation page
            (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, mergeableData);
            Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_CONFIRMATION_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_DETAILS_PAGE.getRoute(transactionID, Navigation_1.default.getActiveRoute()));
    };
    if ((0, isLoadingOnyxValue_1.default)(mergeTransactionMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ReceiptReviewPage.displayName} shouldEnableMaxHeight includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={!mergeTransaction}>
                <HeaderWithBackButton_1.default title={translate('transactionMerge.receiptPage.header')} onBackButtonPress={function () {
            Navigation_1.default.goBack(backTo);
        }}/>
                <ScrollView_1.default style={[styles.pv3, styles.ph5]}>
                    <react_native_1.View style={[styles.mb5]}>
                        <Text_1.default>{translate('transactionMerge.receiptPage.pageTitle')}</Text_1.default>
                    </react_native_1.View>
                    <TransactionMergeReceipts_1.default transactions={transactions} selectedReceiptID={(_b = mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.receipt) === null || _b === void 0 ? void 0 : _b.receiptID} onSelect={handleSelect}/>
                </ScrollView_1.default>
                <FixedFooter_1.default>
                    <Button_1.default success large text={translate('common.continue')} onPress={handleContinue} style={styles.mt5} isDisabled={!(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.receipt)}/>
                </FixedFooter_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ReceiptReviewPage.displayName = 'ReceiptReviewPage';
exports.default = ReceiptReviewPage;
