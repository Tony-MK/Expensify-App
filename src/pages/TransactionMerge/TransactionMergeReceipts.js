"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons_1 = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const RadioButton_1 = require("@components/RadioButton");
const ReportActionItemImage_1 = require("@components/ReportActionItem/ReportActionItemImage");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function TransactionMergeReceipts({ transactions, selectedReceiptID, onSelect }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.flexRow, styles.flexWrap, styles.justifyContentBetween]}>
            {transactions.map((transaction, index) => {
            const receiptURIs = (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transaction);
            const isSelected = selectedReceiptID === transaction.receipt?.receiptID;
            return (<react_native_1.View key={transaction.transactionID} style={[styles.flexColumn, styles.alignItemsCenter, styles.w100, styles.mb2]}>
                        <PressableWithFeedback_1.default onPress={() => onSelect(transaction.receipt)} wrapperStyle={styles.w100} hoverStyle={styles.hoveredComponentBG} style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.mergeTransactionReceiptThumbnail]} accessibilityRole={CONST_1.default.ROLE.RADIO} accessibilityLabel={`${translate('transactionMerge.receiptPage.pageTitle')} ${transaction.transactionID}`}>
                            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.w100, styles.mb5]}>
                                <Text_1.default style={[styles.headerText]}>
                                    {translate('common.receipt')} {index + 1}
                                </Text_1.default>
                                <RadioButton_1.default isChecked={isSelected} onPress={() => onSelect(transaction.receipt)} accessibilityLabel={`${translate('transactionMerge.receiptPage.pageTitle')} ${transaction.transactionID}`} shouldUseNewStyle/>
                            </react_native_1.View>
                            <react_native_1.View style={[styles.mergeTransactionReceiptImage, styles.pRelative]}>
                                <ReportActionItemImage_1.default thumbnail={receiptURIs.thumbnail} fileExtension={receiptURIs.fileExtension} isThumbnail={receiptURIs.isThumbnail} image={receiptURIs.image} isLocalFile={receiptURIs.isLocalFile} filename={receiptURIs.filename} transaction={transaction} readonly/>
                                <react_native_1.View style={[styles.pAbsolute, styles.b2, styles.r2]}>
                                    <Button_1.default innerStyles={[styles.arrowIcon]} icon={Expensicons_1.Zoom} onPress={() => {
                    Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_RECEIPT.getRoute((0, MergeTransactionUtils_1.getTransactionThreadReportID)(transaction) ?? transaction.reportID, transaction.transactionID, true));
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
