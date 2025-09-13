"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function WorkspaceMemberDetailsRoleSelectionModal({ isVisible, items, onRoleChange, onClose }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={() => onClose?.()} onModalHide={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default testID={WorkspaceMemberDetailsRoleSelectionModal.displayName} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('common.role')} onBackButtonPress={onClose}/>
                <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                    <SelectionList_1.default sections={[{ data: items }]} ListItem={RadioListItem_1.default} onSelectRow={onRoleChange} isAlternateTextMultilineSupported shouldSingleExecuteRowSelect initiallyFocusedOptionKey={items.find((item) => item.isSelected)?.keyForList} addBottomSafeAreaPadding/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
WorkspaceMemberDetailsRoleSelectionModal.displayName = 'WorkspaceMemberDetailsRoleSelectionModal';
exports.default = WorkspaceMemberDetailsRoleSelectionModal;
