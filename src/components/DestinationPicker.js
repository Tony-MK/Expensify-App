"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PerDiemRequestUtils_1 = require("@libs/PerDiemRequestUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SelectionList_1 = require("./SelectionList");
const RadioListItem_1 = require("./SelectionList/RadioListItem");
function DestinationPicker({ selectedDestination, policyID, onSubmit }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const customUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const [policyRecentlyUsedDestinations] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_DESTINATIONS}${policyID}`, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const selectedOptions = (0, react_1.useMemo)(() => {
        if (!selectedDestination) {
            return [];
        }
        const selectedRate = customUnit?.rates?.[selectedDestination];
        if (!selectedRate?.customUnitRateID) {
            return [];
        }
        return [
            {
                rateID: selectedRate.customUnitRateID,
                name: selectedRate?.name ?? '',
                currency: selectedRate?.currency ?? CONST_1.default.CURRENCY.USD,
                isSelected: true,
            },
        ];
    }, [customUnit?.rates, selectedDestination]);
    const [sections, headerMessage, shouldShowTextInput] = (0, react_1.useMemo)(() => {
        const destinationOptions = (0, PerDiemRequestUtils_1.getDestinationListSections)({
            searchValue: debouncedSearchValue,
            selectedOptions,
            destinations: Object.values(customUnit?.rates ?? {}),
            recentlyUsedDestinations: policyRecentlyUsedDestinations,
        });
        const destinationData = destinationOptions?.at(0)?.data ?? [];
        const header = (0, OptionsListUtils_1.getHeaderMessageForNonUserList)(destinationData.length > 0, debouncedSearchValue);
        const destinationsCount = Object.values(customUnit?.rates ?? {}).length;
        const isDestinationsCountBelowThreshold = destinationsCount < CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
        const showInput = !isDestinationsCountBelowThreshold;
        return [destinationOptions, header, showInput];
    }, [debouncedSearchValue, selectedOptions, customUnit?.rates, policyRecentlyUsedDestinations]);
    const selectedOptionKey = (0, react_1.useMemo)(() => (sections?.at(0)?.data ?? []).filter((destination) => destination.keyForList === selectedDestination).at(0)?.keyForList, [sections, selectedDestination]);
    return (<SelectionList_1.default sections={sections} headerMessage={headerMessage} textInputValue={searchValue} textInputLabel={shouldShowTextInput ? translate('common.search') : undefined} onChangeText={setSearchValue} onSelectRow={onSubmit} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={selectedOptionKey ?? undefined} isRowMultilineSupported shouldHideKeyboardOnScroll={false}/>);
}
DestinationPicker.displayName = 'DestinationPicker';
exports.default = DestinationPicker;
