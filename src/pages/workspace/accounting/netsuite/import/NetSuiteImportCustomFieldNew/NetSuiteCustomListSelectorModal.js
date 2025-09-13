"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const CONST_1 = require("@src/CONST");
function NetSuiteCustomListSelectorModal({ isVisible, currentCustomListValue, onCustomListSelected, onClose, label, policy, onBackdropPress }) {
    const { translate } = (0, useLocalize_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const { sections, headerMessage, showTextInput } = (0, react_1.useMemo)(() => {
        const customLists = policy?.connections?.netsuite?.options?.data?.customLists ?? [];
        const customListData = customLists.map((customListRecord) => ({
            text: customListRecord.name,
            value: customListRecord.name,
            isSelected: customListRecord.name === currentCustomListValue,
            keyForList: customListRecord.name,
            id: customListRecord.id,
        }));
        const searchRegex = new RegExp(expensify_common_1.Str.escapeForRegExp(debouncedSearchValue.trim()), 'i');
        const filteredCustomLists = customListData.filter((customListRecord) => searchRegex.test(customListRecord.text ?? ''));
        const isEmpty = debouncedSearchValue.trim() && !filteredCustomLists.length;
        return {
            sections: isEmpty
                ? []
                : [
                    {
                        data: filteredCustomLists,
                    },
                ],
            headerMessage: isEmpty ? translate('common.noResultsFound') : '',
            showTextInput: customListData.length > CONST_1.default.STANDARD_LIST_ITEM_LIMIT,
        };
    }, [debouncedSearchValue, policy?.connections?.netsuite?.options?.data?.customLists, translate, currentCustomListValue]);
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onModalHide={onClose} onBackdropPress={onBackdropPress} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default includePaddingTop={false} enableEdgeToEdgeBottomSafeAreaPadding testID={NetSuiteCustomListSelectorModal.displayName}>
                <HeaderWithBackButton_1.default title={label} shouldShowBackButton onBackButtonPress={onClose}/>
                <SelectionList_1.default sections={sections} textInputValue={searchValue} textInputLabel={showTextInput ? translate('common.search') : undefined} onChangeText={setSearchValue} onSelectRow={onCustomListSelected} headerMessage={headerMessage} ListItem={RadioListItem_1.default} isRowMultilineSupported initiallyFocusedOptionKey={currentCustomListValue} shouldSingleExecuteRowSelect shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch addBottomSafeAreaPadding/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
NetSuiteCustomListSelectorModal.displayName = 'NetSuiteCustomListSelectorModal';
exports.default = NetSuiteCustomListSelectorModal;
