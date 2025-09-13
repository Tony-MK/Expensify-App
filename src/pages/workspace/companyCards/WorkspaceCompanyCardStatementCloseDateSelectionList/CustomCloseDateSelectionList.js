"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const SelectionList_1 = require("@components/SelectionList");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function CustomCloseDateSelectionList({ initiallySelectedDay, onConfirmSelectedDay }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [selectedDay, setSelectedDay] = (0, react_1.useState)(initiallySelectedDay);
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const [error, setError] = (0, react_1.useState)(undefined);
    const { sections, headerMessage } = (0, react_1.useMemo)(() => {
        const data = CONST_1.default.DATE.MONTH_DAYS.reduce((days, dayValue) => {
            const day = {
                value: dayValue,
                text: dayValue.toString(),
                keyForList: dayValue.toString(),
                isSelected: dayValue === selectedDay,
            };
            if (debouncedSearchValue) {
                if (day.text.includes(debouncedSearchValue)) {
                    days.push(day);
                }
            }
            else {
                days.push(day);
            }
            return days;
        }, []);
        return {
            sections: [{ data, indexOffset: 0 }],
            headerMessage: data.length === 0 ? translate('common.noResultsFound') : undefined,
        };
    }, [selectedDay, debouncedSearchValue, translate]);
    const selectDayAndClearError = (0, react_1.useCallback)((item) => {
        setSelectedDay(item.value);
        setError(undefined);
    }, []);
    const confirmSelectedDay = (0, react_1.useCallback)(() => {
        if (!selectedDay) {
            setError(translate('workspace.moreFeatures.companyCards.error.statementCloseDateRequired'));
            return;
        }
        onConfirmSelectedDay(selectedDay);
    }, [selectedDay, onConfirmSelectedDay, translate]);
    return (<SelectionList_1.default ListItem={SingleSelectListItem_1.default} onSelectRow={selectDayAndClearError} shouldShowListEmptyContent={false} sections={sections} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={initiallySelectedDay?.toString()} shouldUpdateFocusedIndex showConfirmButton confirmButtonText={translate('common.save')} onConfirm={confirmSelectedDay} confirmButtonStyles={styles.mt3} addBottomSafeAreaPadding shouldShowTextInput textInputLabel={translate('common.search')} textInputValue={searchValue} onChangeText={setSearchValue} headerMessage={headerMessage}>
            {!!error && (<FormHelpMessage_1.default style={[styles.ph5]} isError message={error}/>)}
        </SelectionList_1.default>);
}
CustomCloseDateSelectionList.displayName = 'CustomCloseDateSelectionList';
exports.default = CustomCloseDateSelectionList;
