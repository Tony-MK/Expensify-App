"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CategoryPicker_1 = require("@components/CategoryPicker");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function CategorySelectorModal({ policyID, isVisible, currentCategory, onCategorySelected, onClose, label }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding shouldEnableKeyboardAvoidingView={false} testID={CategorySelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <CategoryPicker_1.default policyID={policyID} selectedCategory={currentCategory} onSubmit={onCategorySelected} addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
CategorySelectorModal.displayName = 'CategorySelectorModal';
exports.default = CategorySelectorModal;
