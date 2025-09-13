"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
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
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const TransactionMergeReceipts_1 = require("./TransactionMergeReceipts");
function ReceiptReviewPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { transactionID, backTo } = route.params;
    const [mergeTransaction, mergeTransactionMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, { canBeMissing: false });
    const [targetTransaction = (0, MergeTransactionUtils_1.getTargetTransactionFromMergeTransaction)(mergeTransaction)] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mergeTransaction?.targetTransactionID}`, {
        canBeMissing: true,
    });
    const [sourceTransaction = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction)] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${mergeTransaction?.sourceTransactionID}`, {
        canBeMissing: true,
    });
    const transactions = [targetTransaction, sourceTransaction].filter((transaction) => !!transaction);
    const handleSelect = (receipt) => {
        (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, { receipt });
    };
    const handleContinue = () => {
        if (!mergeTransaction?.receipt) {
            return;
        }
        const { conflictFields, mergeableData } = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(targetTransaction, sourceTransaction);
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
                <HeaderWithBackButton_1.default title={translate('transactionMerge.receiptPage.header')} onBackButtonPress={() => {
            Navigation_1.default.goBack(backTo);
        }}/>
                <ScrollView_1.default style={[styles.pv3, styles.ph5]}>
                    <react_native_1.View style={[styles.mb5]}>
                        <Text_1.default>{translate('transactionMerge.receiptPage.pageTitle')}</Text_1.default>
                    </react_native_1.View>
                    <TransactionMergeReceipts_1.default transactions={transactions} selectedReceiptID={mergeTransaction?.receipt?.receiptID} onSelect={handleSelect}/>
                </ScrollView_1.default>
                <FixedFooter_1.default>
                    <Button_1.default success large text={translate('common.continue')} onPress={handleContinue} style={styles.mt5} isDisabled={!mergeTransaction?.receipt}/>
                </FixedFooter_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
ReceiptReviewPage.displayName = 'ReceiptReviewPage';
exports.default = ReceiptReviewPage;
