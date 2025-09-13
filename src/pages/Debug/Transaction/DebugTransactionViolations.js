"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
function DebugTransactionViolations({ transactionID }) {
    const transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const renderItem = (item, index) => (<PressableWithFeedback_1.default accessibilityLabel={translate('common.details')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.DEBUG_TRANSACTION_VIOLATION.getRoute(transactionID, String(index)))} style={({ pressed }) => [styles.flexRow, styles.justifyContentBetween, pressed && styles.hoveredComponentBG, styles.p4]} hoverStyle={styles.hoveredComponentBG} key={index}>
            <Text_1.default>{item.type}</Text_1.default>
            <Text_1.default>{item.name}</Text_1.default>
        </PressableWithFeedback_1.default>);
    return (<ScrollView_1.default style={styles.mv5}>
            <Button_1.default success large text={translate('common.create')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.DEBUG_TRANSACTION_VIOLATION_CREATE.getRoute(transactionID))} style={[styles.pb5, styles.ph3]}/>
            {/* This list was previously rendered as a FlatList, but it turned out that it caused the component to flash in some cases,
        so it was replaced by this solution. */}
            {transactionViolations?.map((item, index) => renderItem(item, index))}
        </ScrollView_1.default>);
}
DebugTransactionViolations.displayName = 'DebugTransactionViolations';
exports.default = DebugTransactionViolations;
