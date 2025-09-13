"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ExpenseLimitTypeSelectorModal({ isVisible, currentExpenseLimitType, onExpenseLimitTypeSelected, onClose, label }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const expenseLimitTypes = Object.values(CONST_1.default.POLICY.EXPENSE_LIMIT_TYPES).map((value) => ({
        value,
        text: translate(`workspace.rules.categoryRules.expenseLimitTypes.${value}`),
        alternateText: translate(`workspace.rules.categoryRules.expenseLimitTypes.${value}Subtitle`),
        keyForList: value,
        isSelected: currentExpenseLimitType === value,
    }));
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={ExpenseLimitTypeSelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <SelectionList_1.default sections={[{ data: expenseLimitTypes }]} ListItem={RadioListItem_1.default} onSelectRow={(item) => onExpenseLimitTypeSelected(item.value)} shouldSingleExecuteRowSelect containerStyle={[styles.pt3]} initiallyFocusedOptionKey={currentExpenseLimitType} isAlternateTextMultilineSupported alternateTextNumberOfLines={3} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
ExpenseLimitTypeSelectorModal.displayName = 'ExpenseLimitTypeSelectorModal';
exports.default = ExpenseLimitTypeSelectorModal;
