"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var Expensicons_1 = require("@components/Icon/Expensicons");
var PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
var RadioButton_1 = require("@components/RadioButton");
var ReportActionItemImage_1 = require("@components/ReportActionItem/ReportActionItemImage");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReceiptUtils_1 = require("@libs/ReceiptUtils");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function TransactionMergeReceipts(_a) {
    var transactions = _a.transactions, selectedReceiptID = _a.selectedReceiptID, onSelect = _a.onSelect;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    return (<react_native_1.View style={[styles.flexRow, styles.flexWrap, styles.justifyContentBetween]}>
            {transactions.map(function (transaction, index) {
            var _a;
            var receiptURIs = (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transaction);
            var isSelected = selectedReceiptID === ((_a = transaction.receipt) === null || _a === void 0 ? void 0 : _a.receiptID);
            return (<react_native_1.View key={transaction.transactionID} style={[styles.flexColumn, styles.alignItemsCenter, styles.w100, styles.mb2]}>
                        <PressableWithFeedback_1.default onPress={function () { return onSelect(transaction.receipt); }} wrapperStyle={styles.w100} hoverStyle={styles.hoveredComponentBG} style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.mergeTransactionReceiptThumbnail]} accessibilityRole={CONST_1.default.ROLE.RADIO} accessibilityLabel={"".concat(translate('transactionMerge.receiptPage.pageTitle'), " ").concat(transaction.transactionID)}>
                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.w100, styles.mb5]}>
                                <Text_1.default style={[styles.headerText]}>
                                    {translate('common.receipt')} {index + 1}
                                </Text_1.default>
                                <RadioButton_1.default isChecked={isSelected} onPress={function () { return onSelect(transaction.receipt); }} accessibilityLabel={"".concat(translate('transactionMerge.receiptPage.pageTitle'), " ").concat(transaction.transactionID)} shouldUseNewStyle/>
                            </react_native_1.View>
                            <react_native_1.View style={[styles.mergeTransactionReceiptImage, styles.pRelative]}>
                                <ReportActionItemImage_1.default thumbnail={receiptURIs.thumbnail} fileExtension={receiptURIs.fileExtension} isThumbnail={receiptURIs.isThumbnail} image={receiptURIs.image} isLocalFile={receiptURIs.isLocalFile} filename={receiptURIs.filename} transaction={transaction} readonly/>
                                <react_native_1.View style={[styles.pAbsolute, styles.b2, styles.r2]}>
                                    <Button_1.default innerStyles={[styles.arrowIcon]} icon={Expensicons_1.Zoom} onPress={function () {
                    var _a;
                    Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_RECEIPT.getRoute((_a = (0, MergeTransactionUtils_1.getTransactionThreadReportID)(transaction)) !== null && _a !== void 0 ? _a : transaction.reportID, transaction.transactionID, true));
                }}/>
                                </react_native_1.View>
                            </react_native_1.View>
                        </PressableWithFeedback_1.default>
                    </react_native_1.View>);
        })}
        </react_native_1.View>);
}
TransactionMergeReceipts.displayName = 'TransactionMergeReceipts';
exports.default = TransactionMergeReceipts;
