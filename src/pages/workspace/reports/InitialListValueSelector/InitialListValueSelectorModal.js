"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportFieldsInitialListValuePicker_1 = require("./ReportFieldsInitialListValuePicker");
function InitialListValueSelectorModal({ isVisible, currentValue, label, subtitle, onValueSelected, onClose }) {
    const styles = (0, useThemeStyles_1.default)();
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default style={styles.pb0} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={InitialListValueSelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <react_native_1.View style={[styles.ph5, styles.pb4]}>
                    <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>{subtitle}</Text_1.default>
                </react_native_1.View>
                <ReportFieldsInitialListValuePicker_1.default listValues={formDraft?.listValues ?? []} disabledOptions={formDraft?.disabledListValues ?? []} value={currentValue} onValueChange={onValueSelected}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
InitialListValueSelectorModal.displayName = 'InitialListValueSelectorModal';
exports.default = InitialListValueSelectorModal;
