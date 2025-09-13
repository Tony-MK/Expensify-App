"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const searchOptions_1 = require("@libs/searchOptions");
const StringUtils_1 = require("@libs/StringUtils");
const CONST_1 = require("@src/CONST");
function PushRowModal({ isVisible, selectedOption, onOptionChange, onClose, optionsList, headerTitle, searchInputTitle }) {
    const { translate } = (0, useLocalize_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const options = (0, react_1.useMemo)(() => Object.entries(optionsList).map(([key, value]) => ({
        value: key,
        text: value,
        keyForList: key,
        isSelected: key === selectedOption,
        searchValue: StringUtils_1.default.sanitizeString(value),
    })), [optionsList, selectedOption]);
    const handleSelectRow = (option) => {
        onOptionChange(option.value);
        onClose();
    };
    const handleClose = () => {
        onClose();
        setSearchValue('');
    };
    const searchResults = (0, searchOptions_1.default)(debouncedSearchValue, options);
    const headerMessage = debouncedSearchValue.trim() && !searchResults.length ? translate('common.noResultsFound') : '';
    return (<Modal_1.default onClose={handleClose} isVisible={isVisible} type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} onModalHide={handleClose} shouldUseCustomBackdrop shouldHandleNavigationBack>
            <ScreenWrapper_1.default includePaddingTop={false} includeSafeAreaPaddingBottom={false} testID={PushRowModal.displayName}>
                <HeaderWithBackButton_1.default title={headerTitle} onBackButtonPress={onClose}/>
                <SelectionList_1.default headerMessage={headerMessage} textInputLabel={searchInputTitle} textInputValue={searchValue} onChangeText={setSearchValue} onSelectRow={handleSelectRow} sections={[{ data: searchResults }]} initiallyFocusedOptionKey={selectedOption} showScrollIndicator shouldShowTooltips={false} ListItem={RadioListItem_1.default}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
PushRowModal.displayName = 'PushRowModal';
exports.default = PushRowModal;
