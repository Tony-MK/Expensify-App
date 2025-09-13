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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var isEmpty_1 = require("lodash/isEmpty");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var OptionListContextProvider_1 = require("@components/OptionListContextProvider");
var SelectionList_1 = require("@components/SelectionList");
var UserSelectionListItem_1 = require("@components/SelectionList/Search/UserSelectionListItem");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
var memoize_1 = require("@libs/memoize");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function getSelectedOptionData(option) {
    return __assign(__assign({}, option), { reportID: "".concat(option.reportID), selected: true });
}
var optionsMatch = function (opt1, opt2) {
    // Below is just a boolean expression.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return (opt1.accountID && opt1.accountID === (opt2 === null || opt2 === void 0 ? void 0 : opt2.accountID)) || (opt1.reportID && opt1.reportID === (opt2 === null || opt2 === void 0 ? void 0 : opt2.reportID));
};
var memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'UserSelectPopup.getValidOptions' });
function UserSelectPopup(_a) {
    var value = _a.value, closeOverlay = _a.closeOverlay, onChange = _a.onChange;
    var selectionListRef = (0, react_1.useRef)(null);
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var options = (0, OptionListContextProvider_1.useOptionsList)().options;
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var accountID = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true, selector: function (onyxSession) { return onyxSession === null || onyxSession === void 0 ? void 0 : onyxSession.accountID; } })[0];
    var shouldFocusInputOnScreenFocus = (0, canFocusInputOnScreenFocus_1.default)();
    var countryCode = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false })[0];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var isSearchingForReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true })[0];
    var initialSelectedOptions = (0, react_1.useMemo)(function () {
        return value.reduce(function (acc, id) {
            var participant = personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[id];
            if (!participant) {
                return acc;
            }
            var optionData = getSelectedOptionData(participant);
            if (optionData) {
                acc.push(optionData);
            }
            return acc;
        }, []);
    }, [value, personalDetails]);
    var _c = (0, react_1.useState)(initialSelectedOptions), selectedOptions = _c[0], setSelectedOptions = _c[1];
    var cleanSearchTerm = searchTerm.trim().toLowerCase();
    var selectedAccountIDs = (0, react_1.useMemo)(function () {
        return new Set(selectedOptions.map(function (option) { return option.accountID; }).filter(Boolean));
    }, [selectedOptions]);
    var optionsList = (0, react_1.useMemo)(function () {
        return memoizedGetValidOptions({
            reports: options.reports,
            personalDetails: options.personalDetails,
        }, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            includeCurrentUser: true,
        });
    }, [options.reports, options.personalDetails]);
    var filteredOptions = (0, react_1.useMemo)(function () {
        return (0, OptionsListUtils_1.filterAndOrderOptions)(optionsList, cleanSearchTerm, countryCode, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
            canInviteUser: false,
        });
    }, [optionsList, cleanSearchTerm, countryCode]);
    var listData = (0, react_1.useMemo)(function () {
        var personalDetailList = filteredOptions.personalDetails.map(function (participant) { return (__assign(__assign({}, participant), { isSelected: selectedAccountIDs.has(participant.accountID) })); });
        var recentReportsList = filteredOptions.recentReports.map(function (report) { return (__assign(__assign({}, report), { isSelected: selectedAccountIDs.has(report.accountID) })); });
        var combined = __spreadArray(__spreadArray([], personalDetailList, true), recentReportsList, true);
        combined.sort(function (a, b) {
            // selected items first
            if (a.isSelected && !b.isSelected) {
                return -1;
            }
            if (!a.isSelected && b.isSelected) {
                return 1;
            }
            // Put the current user at the top of the list
            if (a.accountID === accountID) {
                return -1;
            }
            if (b.accountID === accountID) {
                return 1;
            }
            return 0;
        });
        return combined;
    }, [filteredOptions, accountID, selectedAccountIDs]);
    var _d = (0, react_1.useMemo)(function () {
        var newSections = [
            {
                title: '',
                data: listData,
                shouldShow: !(0, isEmpty_1.default)(listData),
            },
        ];
        var noResultsFound = (0, isEmpty_1.default)(listData);
        var message = noResultsFound ? translate('common.noResultsFound') : undefined;
        return {
            sections: newSections,
            headerMessage: message,
        };
    }, [listData, translate]), sections = _d.sections, headerMessage = _d.headerMessage;
    var selectUser = (0, react_1.useCallback)(function (option) {
        var _a;
        var isSelected = selectedOptions.some(function (selected) { return optionsMatch(selected, option); });
        setSelectedOptions(function (prev) { return (isSelected ? prev.filter(function (selected) { return !optionsMatch(selected, option); }) : __spreadArray(__spreadArray([], prev, true), [getSelectedOptionData(option)], false)); });
        (_a = selectionListRef === null || selectionListRef === void 0 ? void 0 : selectionListRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex(0, true);
    }, [selectedOptions]);
    var applyChanges = (0, react_1.useCallback)(function () {
        var accountIDs = selectedOptions.map(function (option) { return (option.accountID ? option.accountID.toString() : undefined); }).filter(Boolean);
        closeOverlay();
        onChange(accountIDs);
    }, [closeOverlay, onChange, selectedOptions]);
    var resetChanges = (0, react_1.useCallback)(function () {
        onChange([]);
        closeOverlay();
    }, [closeOverlay, onChange]);
    var isLoadingNewOptions = !!isSearchingForReports;
    var dataLength = sections.flatMap(function (section) { return section.data; }).length;
    return (<react_native_1.View style={[styles.getUserSelectionListPopoverHeight(dataLength || 1, windowHeight, shouldUseNarrowLayout)]}>
            <SelectionList_1.default ref={selectionListRef} canSelectMultiple textInputAutoFocus={shouldFocusInputOnScreenFocus} headerMessage={headerMessage} sections={sections} ListItem={UserSelectionListItem_1.default} containerStyle={[!shouldUseNarrowLayout && styles.pt4]} contentContainerStyle={[styles.pb2]} textInputLabel={translate('selectionList.searchForSomeone')} textInputValue={searchTerm} onSelectRow={selectUser} onChangeText={setSearchTerm} isLoadingNewOptions={isLoadingNewOptions}/>

            <react_native_1.View style={[styles.flexRow, styles.gap2, styles.mh5, !shouldUseNarrowLayout && styles.mb4]}>
                <Button_1.default medium style={[styles.flex1]} text={translate('common.reset')} onPress={resetChanges}/>
                <Button_1.default success medium style={[styles.flex1]} text={translate('common.apply')} onPress={applyChanges}/>
            </react_native_1.View>
        </react_native_1.View>);
}
UserSelectPopup.displayName = 'UserSelectPopup';
exports.default = (0, react_1.memo)(UserSelectPopup);
