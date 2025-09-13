"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportFieldTypePicker_1 = require("@pages/workspace/reports/ReportFieldTypePicker");
const CONST_1 = require("@src/CONST");
function TypeSelectorModal({ isVisible, currentType, label, subtitle, onTypeSelected, onClose }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default style={styles.pb0} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={TypeSelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <react_native_1.View style={[styles.ph5, styles.pb4]}>
                    <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>{subtitle}</Text_1.default>
                </react_native_1.View>
                <ReportFieldTypePicker_1.default defaultValue={currentType} onOptionSelected={onTypeSelected}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
TypeSelectorModal.displayName = 'TypeSelectorModal';
exports.default = TypeSelectorModal;
