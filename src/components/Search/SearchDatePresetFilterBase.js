"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CalendarPicker_1 = require("@components/DatePicker/CalendarPicker");
var MenuItem_1 = require("@components/MenuItem");
var SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
var SpacerView_1 = require("@components/SpacerView");
var useLocalize_1 = require("@hooks/useLocalize");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var CONST_1 = require("@src/CONST");
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
function SearchDatePresetFilterBase(_a) {
    var defaultDateValues = _a.defaultDateValues, selectedDateModifier = _a.selectedDateModifier, onSelectDateModifier = _a.onSelectDateModifier, presets = _a.presets, ref = _a.ref;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var shouldShowHorizontalRule = !!(presets === null || presets === void 0 ? void 0 : presets.length);
    var _b = (0, react_1.useState)(defaultDateValues), dateValues = _b[0], setDateValues = _b[1];
    var setDateValue = (0, react_1.useCallback)(function (dateModifier, value) {
        setDateValues(function (prevDateValues) {
            var _a, _b, _c;
            if (dateModifier === CONST_1.default.SEARCH.DATE_MODIFIERS.ON && (0, SearchQueryUtils_1.isSearchDatePreset)(value)) {
                return _a = {},
                    _a[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] = value,
                    _a[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE] = undefined,
                    _a[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER] = undefined,
                    _a;
            }
            if (dateModifier !== CONST_1.default.SEARCH.DATE_MODIFIERS.ON && (0, SearchQueryUtils_1.isSearchDatePreset)(prevDateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON])) {
                return __assign(__assign({}, prevDateValues), (_b = {}, _b[dateModifier] = value, _b[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] = undefined, _b));
            }
            return __assign(__assign({}, prevDateValues), (_c = {}, _c[dateModifier] = value, _c));
        });
    }, []);
    var dateDisplayValues = (0, react_1.useMemo)(function () {
        var _a;
        var dateOn = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON];
        var dateAfter = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER];
        var dateBefore = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE];
        return _a = {},
            // dateOn could be a preset e.g. Last month which should not be displayed as the On field
            _a[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] = (0, SearchQueryUtils_1.isSearchDatePreset)(dateOn) ? undefined : dateOn,
            _a[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER] = dateAfter,
            _a[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE] = dateBefore,
            _a;
    }, [dateValues]);
    var getInitialEphemeralDateValue = (0, react_1.useCallback)(function (dateModifier) { return (dateModifier ? dateDisplayValues[dateModifier] : undefined); }, [dateDisplayValues]);
    var _c = (0, react_1.useState)(function () { return getInitialEphemeralDateValue(selectedDateModifier); }), ephemeralDateValue = _c[0], setEphemeralDateValue = _c[1];
    var resetEphemeralDateValue = (0, react_1.useCallback)(function (dateModifier) { return setEphemeralDateValue(getInitialEphemeralDateValue(dateModifier)); }, [getInitialEphemeralDateValue]);
    var selectDateModifier = (0, react_1.useCallback)(function (dateModifier) {
        resetEphemeralDateValue(dateModifier);
        onSelectDateModifier(dateModifier);
    }, [resetEphemeralDateValue, onSelectDateModifier]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getDateValues: function () {
            return dateValues;
        },
        clearDateValues: function () {
            var _a;
            setDateValues((_a = {}, _a[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] = undefined, _a[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE] = undefined, _a[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER] = undefined, _a));
        },
        setDateValueOfSelectedDateModifier: function () {
            if (!selectedDateModifier) {
                return;
            }
            setDateValue(selectedDateModifier, ephemeralDateValue);
        },
        clearDateValueOfSelectedDateModifier: function () {
            if (!selectedDateModifier) {
                return;
            }
            setDateValue(selectedDateModifier, undefined);
        },
    }); }, [selectedDateModifier, dateValues, ephemeralDateValue, setDateValue]);
    return !selectedDateModifier ? (<>
            {presets === null || presets === void 0 ? void 0 : presets.map(function (preset) { return (<SingleSelectListItem_1.default key={preset} showTooltip item={{
                text: translate("search.filters.date.presets.".concat(preset)),
                isSelected: dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] === preset,
            }} onSelectRow={function () { return setDateValue(CONST_1.default.SEARCH.DATE_MODIFIERS.ON, preset); }} wrapperStyle={styles.flexReset}/>); })}
            {shouldShowHorizontalRule && (<SpacerView_1.default shouldShow style={[StyleUtils.getBorderColorStyle(theme.border), styles.mh3]}/>)}
            <MenuItem_1.default shouldShowRightIcon viewMode={CONST_1.default.OPTION_MODE.COMPACT} title={translate('common.on')} description={dateDisplayValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON]} onPress={function () { return selectDateModifier(CONST_1.default.SEARCH.DATE_MODIFIERS.ON); }}/>
            <MenuItem_1.default shouldShowRightIcon viewMode={CONST_1.default.OPTION_MODE.COMPACT} title={translate('common.after')} description={dateDisplayValues[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]} onPress={function () { return selectDateModifier(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER); }}/>
            <MenuItem_1.default shouldShowRightIcon viewMode={CONST_1.default.OPTION_MODE.COMPACT} title={translate('common.before')} description={dateDisplayValues[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]} onPress={function () { return selectDateModifier(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE); }}/>
        </>) : (<CalendarPicker_1.default value={ephemeralDateValue} onSelected={setEphemeralDateValue} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE} maxDate={CONST_1.default.CALENDAR_PICKER.MAX_DATE}/>);
}
SearchDatePresetFilterBase.displayName = 'SearchDatePresetFilterBase';
exports.default = SearchDatePresetFilterBase;
