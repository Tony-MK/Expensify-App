"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectableListItem_1 = require("@components/SelectionList/SelectableListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getMatchScore_1 = require("@libs/getMatchScore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function CurrencySelectionList({ searchInputLabel, initiallySelectedCurrencyCode, onSelect, didScreenTransitionEnd = true, selectedCurrencies = [], canSelectMultiple = false, recentlyUsedCurrencies, excludedCurrencies = [], ...restProps }) {
    const [currencyList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: false });
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const { translate } = (0, useLocalize_1.default)();
    const getUnselectedOptions = (0, react_1.useCallback)((options) => options.filter((option) => !option.isSelected), []);
    const { sections, headerMessage } = (0, react_1.useMemo)(() => {
        const currencyOptions = Object.entries(currencyList ?? {}).reduce((acc, [currencyCode, currencyInfo]) => {
            const isSelectedCurrency = currencyCode === initiallySelectedCurrencyCode || selectedCurrencies.includes(currencyCode);
            if (!excludedCurrencies.includes(currencyCode) && (isSelectedCurrency || !currencyInfo?.retired)) {
                acc.push({
                    currencyName: currencyInfo?.name ?? '',
                    text: `${currencyCode} - ${(0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)}`,
                    currencyCode,
                    keyForList: currencyCode,
                    isSelected: isSelectedCurrency,
                });
            }
            return acc;
        }, []);
        const recentlyUsedCurrencyOptions = Array.isArray(recentlyUsedCurrencies)
            ? recentlyUsedCurrencies?.map((currencyCode) => {
                const currencyInfo = currencyList?.[currencyCode];
                const isSelectedCurrency = currencyCode === initiallySelectedCurrencyCode;
                return {
                    currencyName: currencyInfo?.name ?? '',
                    text: `${currencyCode} - ${(0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)}`,
                    currencyCode,
                    keyForList: currencyCode,
                    isSelected: isSelectedCurrency,
                };
            })
            : [];
        const searchRegex = new RegExp(expensify_common_1.Str.escapeForRegExp(searchValue.trim()), 'i');
        const filteredCurrencies = currencyOptions
            .filter((currencyOption) => searchRegex.test(currencyOption.text ?? '') || searchRegex.test(currencyOption.currencyName))
            .sort((currency1, currency2) => (0, getMatchScore_1.default)(currency2.text ?? '', searchValue) - (0, getMatchScore_1.default)(currency1.text ?? '', searchValue));
        const isEmpty = searchValue.trim() && !filteredCurrencies.length;
        const shouldDisplayRecentlyOptions = !(0, EmptyObject_1.isEmptyObject)(recentlyUsedCurrencyOptions) && !searchValue;
        const selectedOptions = filteredCurrencies.filter((option) => option.isSelected);
        const shouldDisplaySelectedOptionOnTop = selectedOptions.length > 0;
        const unselectedOptions = getUnselectedOptions(filteredCurrencies);
        const result = [];
        if (shouldDisplaySelectedOptionOnTop) {
            result.push({
                title: '',
                data: selectedOptions,
                shouldShow: true,
            });
        }
        if (shouldDisplayRecentlyOptions) {
            if (!isEmpty) {
                result.push({
                    title: translate('common.recents'),
                    data: shouldDisplaySelectedOptionOnTop ? getUnselectedOptions(recentlyUsedCurrencyOptions) : recentlyUsedCurrencyOptions,
                    shouldShow: shouldDisplayRecentlyOptions,
                }, { title: translate('common.all'), data: shouldDisplayRecentlyOptions ? unselectedOptions : filteredCurrencies });
            }
        }
        else if (!isEmpty) {
            result.push({
                data: shouldDisplaySelectedOptionOnTop ? unselectedOptions : filteredCurrencies,
            });
        }
        return { sections: result, headerMessage: isEmpty ? translate('common.noResultsFound') : '' };
    }, [currencyList, recentlyUsedCurrencies, searchValue, getUnselectedOptions, translate, initiallySelectedCurrencyCode, selectedCurrencies, excludedCurrencies]);
    return (<SelectionList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restProps} sections={sections} ListItem={canSelectMultiple ? SelectableListItem_1.default : RadioListItem_1.default} textInputLabel={searchInputLabel} textInputValue={searchValue} onChangeText={setSearchValue} onSelectRow={onSelect} shouldSingleExecuteRowSelect headerMessage={headerMessage} initiallyFocusedOptionKey={initiallySelectedCurrencyCode} showScrollIndicator canSelectMultiple={canSelectMultiple} showLoadingPlaceholder={!didScreenTransitionEnd}/>);
}
CurrencySelectionList.displayName = 'CurrencySelectionList';
exports.default = CurrencySelectionList;
