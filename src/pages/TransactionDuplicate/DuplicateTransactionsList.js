"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FlatList_1 = require("@components/FlatList");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DuplicateTransactionItem_1 = require("./DuplicateTransactionItem");
const keyExtractor = (item, index) => `${item?.transactionID}+${index}`;
const maintainVisibleContentPosition = {
    minIndexForVisible: 1,
};
function DuplicateTransactionsList({ transactions }) {
    const styles = (0, useThemeStyles_1.default)();
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const renderItem = (0, react_1.useCallback)(({ item, index }) => (<DuplicateTransactionItem_1.default transaction={item} index={index} allReports={allReports} policies={policies}/>), [allReports, policies]);
    return (<FlatList_1.default data={transactions} renderItem={renderItem} keyExtractor={keyExtractor} maintainVisibleContentPosition={maintainVisibleContentPosition} contentContainerStyle={styles.pt5}/>);
}
DuplicateTransactionsList.displayName = 'DuplicateTransactionsList';
exports.default = DuplicateTransactionsList;
