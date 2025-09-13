"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const TaxOptionsListUtils_1 = require("@libs/TaxOptionsListUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const SelectionList_1 = require("./SelectionList");
const RadioListItem_1 = require("./SelectionList/RadioListItem");
function TaxPicker({ selectedTaxRate = '', policyID, transactionID, onSubmit, action, iouType, onDismiss = Navigation_1.default.goBack, addBottomSafeAreaPadding }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const [splitDraftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const [transaction] = (0, useOnyx_1.default)((() => {
        if ((0, IOUUtils_1.shouldUseTransactionDraft)(action)) {
            return `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`;
        }
        return `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`;
    })(), { canBeMissing: true });
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isEditingSplitBill = isEditing && iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const currentTransaction = isEditingSplitBill && !(0, EmptyObject_1.isEmptyObject)(splitDraftTransaction) ? splitDraftTransaction : transaction;
    const taxRates = policy?.taxRates;
    const taxRatesCount = (0, TransactionUtils_1.getEnabledTaxRateCount)(taxRates?.taxes ?? {});
    const isTaxRatesCountBelowThreshold = taxRatesCount < CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    const shouldShowTextInput = !isTaxRatesCountBelowThreshold;
    const selectedOptions = (0, react_1.useMemo)(() => {
        if (!selectedTaxRate) {
            return [];
        }
        return [
            {
                modifiedName: selectedTaxRate,
                isDisabled: false,
                accountID: null,
            },
        ];
    }, [selectedTaxRate]);
    const sections = (0, react_1.useMemo)(() => (0, TaxOptionsListUtils_1.getTaxRatesSection)({
        policy,
        searchValue,
        localeCompare,
        selectedOptions,
        transaction: currentTransaction,
    }), [searchValue, selectedOptions, policy, currentTransaction, localeCompare]);
    const headerMessage = (0, OptionsListUtils_1.getHeaderMessageForNonUserList)((sections.at(0)?.data?.length ?? 0) > 0, searchValue);
    const selectedOptionKey = (0, react_1.useMemo)(() => sections?.at(0)?.data?.find((taxRate) => taxRate.searchText === selectedTaxRate)?.keyForList, [sections, selectedTaxRate]);
    const handleSelectRow = (0, react_1.useCallback)((newSelectedOption) => {
        if (selectedOptionKey === newSelectedOption.keyForList) {
            onDismiss();
            return;
        }
        onSubmit(newSelectedOption);
    }, [onSubmit, onDismiss, selectedOptionKey]);
    return (<SelectionList_1.default sections={sections} headerMessage={headerMessage} textInputValue={searchValue} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} onChangeText={setSearchValue} onSelectRow={handleSelectRow} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={selectedOptionKey ?? undefined} isRowMultilineSupported addBottomSafeAreaPadding={addBottomSafeAreaPadding}/>);
}
TaxPicker.displayName = 'TaxPicker';
exports.default = TaxPicker;
