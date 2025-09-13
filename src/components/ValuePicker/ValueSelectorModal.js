"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const CONST_1 = require("@src/CONST");
const ValueSelectionList_1 = require("./ValueSelectionList");
function ValueSelectorModal({ items = [], selectedItem, label = '', isVisible, onClose, onItemSelected, shouldShowTooltips = true, onBackdropPress, shouldEnableKeyboardAvoidingView = true, }) {
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={() => onClose?.()} onModalHide={onClose} onBackdropPress={onBackdropPress} shouldHandleNavigationBack enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={ValueSelectorModal.displayName} shouldEnableKeyboardAvoidingView={shouldEnableKeyboardAvoidingView}>
                <HeaderWithBackButton_1.default title={label} onBackButtonPress={onClose}/>
                <ValueSelectionList_1.default items={items} selectedItem={selectedItem} onItemSelected={onItemSelected} shouldShowTooltips={shouldShowTooltips}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
ValueSelectorModal.displayName = 'ValueSelectorModal';
exports.default = ValueSelectorModal;
