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
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var OptionListContextProvider_1 = require("@components/OptionListContextProvider");
var SelectionList_1 = require("@components/SelectionList");
var UserSelectionListItem_1 = require("@components/SelectionList/Search/UserSelectionListItem");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var memoize_1 = require("@libs/memoize");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Navigation_1 = require("@navigation/Navigation");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SearchFilterPageFooterButtons_1 = require("./SearchFilterPageFooterButtons");
var defaultListOptions = {
    userToInvite: null,
    recentReports: [],
    personalDetails: [],
    currentUserOption: null,
    headerMessage: '',
};
var memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'SearchFiltersParticipantsSelector.getValidOptions' });
function getSelectedOptionData(option) {
    var _a;
    // eslint-disable-next-line rulesdir/no-default-id-values
    return __assign(__assign({}, option), { selected: true, reportID: (_a = option.reportID) !== null && _a !== void 0 ? _a : '-1' });
}
function SearchFiltersParticipantsSelector(_a) {
    var initialAccountIDs = _a.initialAccountIDs, onFiltersUpdate = _a.onFiltersUpdate;
    var translate = (0, useLocalize_1.default)().translate;
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var didScreenTransitionEnd = (0, useScreenWrapperTransitionStatus_1.default)().didScreenTransitionEnd;
    var _b = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    }), options = _b.options, areOptionsInitialized = _b.areOptionsInitialized;
    var isSearchingForReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { canBeMissing: false, initWithStoredValues: false })[0];
    var reportAttributesDerived = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: function (val) { return val === null || val === void 0 ? void 0 : val.reports; } })[0];
    var countryCode = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false })[0];
    var _c = (0, react_1.useState)([]), selectedOptions = _c[0], setSelectedOptions = _c[1];
    var _d = (0, react_1.useState)(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var cleanSearchTerm = (0, react_1.useMemo)(function () { return searchTerm.trim().toLowerCase(); }, [searchTerm]);
    var defaultOptions = (0, react_1.useMemo)(function () {
        if (!areOptionsInitialized) {
            return defaultListOptions;
        }
        return memoizedGetValidOptions({
            reports: options.reports,
            personalDetails: options.personalDetails,
        }, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            includeCurrentUser: true,
        });
    }, [areOptionsInitialized, options.personalDetails, options.reports]);
    var unselectedOptions = (0, react_1.useMemo)(function () {
        return (0, OptionsListUtils_1.filterSelectedOptions)(defaultOptions, new Set(selectedOptions.map(function (option) { return option.accountID; })));
    }, [defaultOptions, selectedOptions]);
    var chatOptions = (0, react_1.useMemo)(function () {
        var filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(unselectedOptions, cleanSearchTerm, countryCode, {
            selectedOptions: selectedOptions,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
            canInviteUser: false,
        });
        var currentUserOption = unselectedOptions.currentUserOption;
        // Ensure current user is not in personalDetails when they should be excluded
        if (currentUserOption) {
            filteredOptions.personalDetails = filteredOptions.personalDetails.filter(function (detail) { return detail.accountID !== currentUserOption.accountID; });
        }
        return filteredOptions;
    }, [unselectedOptions, cleanSearchTerm, selectedOptions, countryCode]);
    var _e = (0, react_1.useMemo)(function () {
        var newSections = [];
        if (!areOptionsInitialized) {
            return { sections: [], headerMessage: undefined };
        }
        var formattedResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(cleanSearchTerm, selectedOptions, chatOptions.recentReports, chatOptions.personalDetails, personalDetails, true, undefined, reportAttributesDerived);
        var selectedCurrentUser = formattedResults.section.data.find(function (option) { var _a; return option.accountID === ((_a = chatOptions.currentUserOption) === null || _a === void 0 ? void 0 : _a.accountID); });
        // If the current user is already selected, remove them from the recent reports and personal details
        if (selectedCurrentUser) {
            chatOptions.recentReports = chatOptions.recentReports.filter(function (report) { return report.accountID !== selectedCurrentUser.accountID; });
            chatOptions.personalDetails = chatOptions.personalDetails.filter(function (detail) { return detail.accountID !== selectedCurrentUser.accountID; });
        }
        // If the current user is not selected, add them to the top of the list
        if (!selectedCurrentUser && chatOptions.currentUserOption) {
            var formattedName = (0, ReportUtils_1.getDisplayNameForParticipant)({
                accountID: chatOptions.currentUserOption.accountID,
                shouldAddCurrentUserPostfix: true,
                personalDetailsData: personalDetails,
            });
            chatOptions.currentUserOption.text = formattedName;
            newSections.push({
                title: '',
                data: [chatOptions.currentUserOption],
                shouldShow: true,
            });
        }
        newSections.push(formattedResults.section);
        newSections.push({
            title: '',
            data: chatOptions.recentReports,
            shouldShow: chatOptions.recentReports.length > 0,
        });
        newSections.push({
            title: '',
            data: chatOptions.personalDetails,
            shouldShow: chatOptions.personalDetails.length > 0,
        });
        var noResultsFound = chatOptions.personalDetails.length === 0 && chatOptions.recentReports.length === 0 && !chatOptions.currentUserOption;
        var message = noResultsFound ? translate('common.noResultsFound') : undefined;
        return {
            sections: newSections,
            headerMessage: message,
        };
    }, [areOptionsInitialized, cleanSearchTerm, selectedOptions, chatOptions, personalDetails, reportAttributesDerived, translate]), sections = _e.sections, headerMessage = _e.headerMessage;
    var resetChanges = (0, react_1.useCallback)(function () {
        setSelectedOptions([]);
    }, []);
    var applyChanges = (0, react_1.useCallback)(function () {
        var selectedAccountIDs = selectedOptions.map(function (option) { return (option.accountID ? option.accountID.toString() : undefined); }).filter(Boolean);
        onFiltersUpdate(selectedAccountIDs);
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [onFiltersUpdate, selectedOptions]);
    // This effect handles setting initial selectedOptions based on accountIDs saved in onyx form
    (0, react_1.useEffect)(function () {
        if (!initialAccountIDs || initialAccountIDs.length === 0 || !personalDetails) {
            return;
        }
        var preSelectedOptions = initialAccountIDs
            .map(function (accountID) {
            var participant = personalDetails[accountID];
            if (!participant) {
                return;
            }
            return getSelectedOptionData(participant);
        })
            .filter(function (option) {
            return !!option;
        });
        setSelectedOptions(preSelectedOptions);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- this should react only to changes in form data
    }, [initialAccountIDs, personalDetails]);
    var handleParticipantSelection = (0, react_1.useCallback)(function (option) {
        var foundOptionIndex = selectedOptions.findIndex(function (selectedOption) {
            if (selectedOption.accountID && selectedOption.accountID === (option === null || option === void 0 ? void 0 : option.accountID)) {
                return true;
            }
            if (selectedOption.reportID && selectedOption.reportID === (option === null || option === void 0 ? void 0 : option.reportID)) {
                return true;
            }
            return false;
        });
        if (foundOptionIndex < 0) {
            setSelectedOptions(__spreadArray(__spreadArray([], selectedOptions, true), [getSelectedOptionData(option)], false));
        }
        else {
            var newSelectedOptions = __spreadArray(__spreadArray([], selectedOptions.slice(0, foundOptionIndex), true), selectedOptions.slice(foundOptionIndex + 1), true);
            setSelectedOptions(newSelectedOptions);
        }
    }, [selectedOptions]);
    var footerContent = (0, react_1.useMemo)(function () { return (<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>); }, [applyChanges, resetChanges]);
    var isLoadingNewOptions = !!isSearchingForReports;
    var showLoadingPlaceholder = !didScreenTransitionEnd || !areOptionsInitialized || !initialAccountIDs || !personalDetails;
    return (<SelectionList_1.default canSelectMultiple sections={sections} ListItem={UserSelectionListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} headerMessage={headerMessage} textInputValue={searchTerm} footerContent={footerContent} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onChangeText={function (value) {
            setSearchTerm(value);
        }} onSelectRow={handleParticipantSelection} isLoadingNewOptions={isLoadingNewOptions} showLoadingPlaceholder={showLoadingPlaceholder}/>);
}
SearchFiltersParticipantsSelector.displayName = 'SearchFiltersParticipantsSelector';
exports.default = SearchFiltersParticipantsSelector;
