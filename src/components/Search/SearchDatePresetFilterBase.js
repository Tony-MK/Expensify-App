"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CalendarPicker_1 = require("@components/DatePicker/CalendarPicker");
const MenuItem_1 = require("@components/MenuItem");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const SpacerView_1 = require("@components/SpacerView");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const CONST_1 = require("@src/CONST");
/**
 * SearchDatePresetFilterBase is a partially controlled component:
 * - The selected date modifier is controlled.
 * - The date values are uncontrolled. This is done to avoid duplicating the `setDateValue` logic and also to avoid exposing the `ephemeralDateValue` state.
 *
 * There are cases where the parent is required to alter the internal date values e.g. reset the values, in such cases you should use the ref handle.
 * Typically you are expected to use this component with a save and a reset button.
 * - On save: if a date modifier is selected (i.e. user clicked save at the calendar picker) you should `setDateValueOfSelectedDateModifier` otherwise `getDateValues`
 * - On reset: if a date modifier is selected (i.e. user clicked reset at the calendar picker) you should `clearDateValueOfSelectedDateModifier` otherwise `clearDateValues`
 */
function SearchDatePresetFilterBase({ defaultDateValues, selectedDateModifier, onSelectDateModifier, presets, ref }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const shouldShowHorizontalRule = !!presets?.length;
    const [dateValues, setDateValues] = (0, react_1.useState)(defaultDateValues);
    const setDateValue = (0, react_1.useCallback)((dateModifier, value) => {
        setDateValues((prevDateValues) => {
            if (dateModifier === CONST_1.default.SEARCH.DATE_MODIFIERS.ON && (0, SearchQueryUtils_1.isSearchDatePreset)(value)) {
                return {
                    [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: value,
                    [CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]: undefined,
                    [CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]: undefined,
                };
            }
            if (dateModifier !== CONST_1.default.SEARCH.DATE_MODIFIERS.ON && (0, SearchQueryUtils_1.isSearchDatePreset)(prevDateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON])) {
                return {
                    ...prevDateValues,
                    [dateModifier]: value,
                    [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: undefined,
                };
            }
            return { ...prevDateValues, [dateModifier]: value };
        });
    }, []);
    const dateDisplayValues = (0, react_1.useMemo)(() => {
        const dateOn = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON];
        const dateAfter = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER];
        const dateBefore = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE];
        return {
            // dateOn could be a preset e.g. Last month which should not be displayed as the On field
            [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: (0, SearchQueryUtils_1.isSearchDatePreset)(dateOn) ? undefined : dateOn,
            [CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]: dateAfter,
            [CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]: dateBefore,
        };
    }, [dateValues]);
    const getInitialEphemeralDateValue = (0, react_1.useCallback)((dateModifier) => (dateModifier ? dateDisplayValues[dateModifier] : undefined), [dateDisplayValues]);
    const [ephemeralDateValue, setEphemeralDateValue] = (0, react_1.useState)(() => getInitialEphemeralDateValue(selectedDateModifier));
    const resetEphemeralDateValue = (0, react_1.useCallback)((dateModifier) => setEphemeralDateValue(getInitialEphemeralDateValue(dateModifier)), [getInitialEphemeralDateValue]);
    const selectDateModifier = (0, react_1.useCallback)((dateModifier) => {
        resetEphemeralDateValue(dateModifier);
        onSelectDateModifier(dateModifier);
    }, [resetEphemeralDateValue, onSelectDateModifier]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        getDateValues() {
            return dateValues;
        },
        clearDateValues() {
            setDateValues({ [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: undefined, [CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]: undefined, [CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]: undefined });
        },
        setDateValueOfSelectedDateModifier() {
            if (!selectedDateModifier) {
                return;
            }
            setDateValue(selectedDateModifier, ephemeralDateValue);
        },
        clearDateValueOfSelectedDateModifier() {
            if (!selectedDateModifier) {
                return;
            }
            setDateValue(selectedDateModifier, undefined);
        },
    }), [selectedDateModifier, dateValues, ephemeralDateValue, setDateValue]);
    return !selectedDateModifier ? (<>
            {presets?.map((preset) => (<SingleSelectListItem_1.default key={preset} showTooltip item={{
                text: translate(`search.filters.date.presets.${preset}`),
                isSelected: dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] === preset,
            }} onSelectRow={() => setDateValue(CONST_1.default.SEARCH.DATE_MODIFIERS.ON, preset)} wrapperStyle={styles.flexReset}/>))}
            {shouldShowHorizontalRule && (<SpacerView_1.default shouldShow style={[StyleUtils.getBorderColorStyle(theme.border), styles.mh3]}/>)}
            <MenuItem_1.default shouldShowRightIcon viewMode={CONST_1.default.OPTION_MODE.COMPACT} title={translate('common.on')} description={dateDisplayValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON]} onPress={() => selectDateModifier(CONST_1.default.SEARCH.DATE_MODIFIERS.ON)}/>
            <MenuItem_1.default shouldShowRightIcon viewMode={CONST_1.default.OPTION_MODE.COMPACT} title={translate('common.after')} description={dateDisplayValues[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]} onPress={() => selectDateModifier(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER)}/>
            <MenuItem_1.default shouldShowRightIcon viewMode={CONST_1.default.OPTION_MODE.COMPACT} title={translate('common.before')} description={dateDisplayValues[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]} onPress={() => selectDateModifier(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE)}/>
        </>) : (<CalendarPicker_1.default value={ephemeralDateValue} onSelected={setEphemeralDateValue} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE} maxDate={CONST_1.default.CALENDAR_PICKER.MAX_DATE}/>);
}
SearchDatePresetFilterBase.displayName = 'SearchDatePresetFilterBase';
exports.default = SearchDatePresetFilterBase;
