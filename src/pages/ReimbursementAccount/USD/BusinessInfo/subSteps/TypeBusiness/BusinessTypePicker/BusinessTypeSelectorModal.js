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
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
function BusinessTypeSelectorModal({ isVisible, currentBusinessType, onBusinessTypeSelected, onClose, label }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const incorporationTypes = (0, react_1.useMemo)(() => Object.keys(CONST_1.default.INCORPORATION_TYPES).map((key) => ({
        value: key,
        text: translate(`businessInfoStep.incorporationType.${key}`),
        keyForList: key,
        isSelected: key === currentBusinessType,
    })), [currentBusinessType, translate]);
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onBackdropPress={() => {
            onClose();
            Navigation_1.default.dismissModal();
        }}>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} includeSafeAreaPaddingBottom={false} testID={BusinessTypeSelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <SelectionList_1.default sections={[{ data: incorporationTypes }]} initiallyFocusedOptionKey={currentBusinessType} onSelectRow={onBusinessTypeSelected} shouldSingleExecuteRowSelect shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch ListItem={RadioListItem_1.default}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
BusinessTypeSelectorModal.displayName = 'BusinessTypeSelectorModal';
exports.default = BusinessTypeSelectorModal;
