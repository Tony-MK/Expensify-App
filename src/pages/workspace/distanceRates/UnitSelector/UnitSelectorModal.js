"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const UnitPicker_1 = require("@components/UnitPicker");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function UnitSelectorModal({ isVisible, currentUnit, onUnitSelected, onClose, label }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose}>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={UnitSelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <UnitPicker_1.default defaultValue={currentUnit} onOptionSelected={onUnitSelected}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
UnitSelectorModal.displayName = 'UnitSelectorModal';
exports.default = UnitSelectorModal;
