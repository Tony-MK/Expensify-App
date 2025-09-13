"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const MergeTransactionsListContent_1 = require("./MergeTransactionsListContent");
function MergeTransactionsListPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { transactionID, backTo } = route.params;
    const [mergeTransaction, mergeTransactionMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, { canBeMissing: false });
    if ((0, isLoadingOnyxValue_1.default)(mergeTransactionMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={MergeTransactionsListPage.displayName} shouldEnableMaxHeight includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={!mergeTransaction}>
                <HeaderWithBackButton_1.default title={translate('transactionMerge.listPage.header')} onBackButtonPress={() => {
            Navigation_1.default.goBack(backTo);
        }}/>
                <MergeTransactionsListContent_1.default transactionID={transactionID} mergeTransaction={mergeTransaction}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
MergeTransactionsListPage.displayName = 'MergeTransactionsListPage';
exports.default = MergeTransactionsListPage;
