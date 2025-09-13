"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var MergeTransactionsListContent_1 = require("./MergeTransactionsListContent");
function MergeTransactionsListPage(_a) {
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var _b = route.params, transactionID = _b.transactionID, backTo = _b.backTo;
    var _c = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), { canBeMissing: false }), mergeTransaction = _c[0], mergeTransactionMetadata = _c[1];
    if ((0, isLoadingOnyxValue_1.default)(mergeTransactionMetadata)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={MergeTransactionsListPage.displayName} shouldEnableMaxHeight includeSafeAreaPaddingBottom>
            <FullPageNotFoundView_1.default shouldShow={!mergeTransaction}>
                <HeaderWithBackButton_1.default title={translate('transactionMerge.listPage.header')} onBackButtonPress={function () {
            Navigation_1.default.goBack(backTo);
        }}/>
                <MergeTransactionsListContent_1.default transactionID={transactionID} mergeTransaction={mergeTransaction}/>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
MergeTransactionsListPage.displayName = 'MergeTransactionsListPage';
exports.default = MergeTransactionsListPage;
