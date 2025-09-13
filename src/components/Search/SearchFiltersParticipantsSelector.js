"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const UserSelectionListItem_1 = require("@components/SelectionList/Search/UserSelectionListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const memoize_1 = require("@libs/memoize");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchFilterPageFooterButtons_1 = require("./SearchFilterPageFooterButtons");
const defaultListOptions = {
    userToInvite: null,
    recentReports: [],
    personalDetails: [],
    currentUserOption: null,
    headerMessage: '',
};
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'SearchFiltersParticipantsSelector.getValidOptions' });
function getSelectedOptionData(option) {
    // eslint-disable-next-line rulesdir/no-default-id-values
    return { ...option, selected: true, reportID: option.reportID ?? '-1' };
}
function SearchFiltersParticipantsSelector({ initialAccountIDs, onFiltersUpdate }) {
    const { translate } = (0, useLocalize_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { canBeMissing: false, initWithStoredValues: false });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const cleanSearchTerm = (0, react_1.useMemo)(() => searchTerm.trim().toLowerCase(), [searchTerm]);
    const defaultOptions = (0, react_1.useMemo)(() => {
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
    const unselectedOptions = (0, react_1.useMemo)(() => {
        return (0, OptionsListUtils_1.filterSelectedOptions)(defaultOptions, new Set(selectedOptions.map((option) => option.accountID)));
    }, [defaultOptions, selectedOptions]);
    const chatOptions = (0, react_1.useMemo)(() => {
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(unselectedOptions, cleanSearchTerm, countryCode, {
            selectedOptions,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
            canInviteUser: false,
        });
        const { currentUserOption } = unselectedOptions;
        // Ensure current user is not in personalDetails when they should be excluded
        if (currentUserOption) {
            filteredOptions.personalDetails = filteredOptions.personalDetails.filter((detail) => detail.accountID !== currentUserOption.accountID);
        }
        return filteredOptions;
    }, [unselectedOptions, cleanSearchTerm, selectedOptions, countryCode]);
    const { sections, headerMessage } = (0, react_1.useMemo)(() => {
        const newSections = [];
        if (!areOptionsInitialized) {
            return { sections: [], headerMessage: undefined };
        }
        const formattedResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(cleanSearchTerm, selectedOptions, chatOptions.recentReports, chatOptions.personalDetails, personalDetails, true, undefined, reportAttributesDerived);
        const selectedCurrentUser = formattedResults.section.data.find((option) => option.accountID === chatOptions.currentUserOption?.accountID);
        // If the current user is already selected, remove them from the recent reports and personal details
        if (selectedCurrentUser) {
            chatOptions.recentReports = chatOptions.recentReports.filter((report) => report.accountID !== selectedCurrentUser.accountID);
            chatOptions.personalDetails = chatOptions.personalDetails.filter((detail) => detail.accountID !== selectedCurrentUser.accountID);
        }
        // If the current user is not selected, add them to the top of the list
        if (!selectedCurrentUser && chatOptions.currentUserOption) {
            const formattedName = (0, ReportUtils_1.getDisplayNameForParticipant)({
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
        const noResultsFound = chatOptions.personalDetails.length === 0 && chatOptions.recentReports.length === 0 && !chatOptions.currentUserOption;
        const message = noResultsFound ? translate('common.noResultsFound') : undefined;
        return {
            sections: newSections,
            headerMessage: message,
        };
    }, [areOptionsInitialized, cleanSearchTerm, selectedOptions, chatOptions, personalDetails, reportAttributesDerived, translate]);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedOptions([]);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        const selectedAccountIDs = selectedOptions.map((option) => (option.accountID ? option.accountID.toString() : undefined)).filter(Boolean);
        onFiltersUpdate(selectedAccountIDs);
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [onFiltersUpdate, selectedOptions]);
    // This effect handles setting initial selectedOptions based on accountIDs saved in onyx form
    (0, react_1.useEffect)(() => {
        if (!initialAccountIDs || initialAccountIDs.length === 0 || !personalDetails) {
            return;
        }
        const preSelectedOptions = initialAccountIDs
            .map((accountID) => {
            const participant = personalDetails[accountID];
            if (!participant) {
                return;
            }
            return getSelectedOptionData(participant);
        })
            .filter((option) => {
            return !!option;
        });
        setSelectedOptions(preSelectedOptions);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- this should react only to changes in form data
    }, [initialAccountIDs, personalDetails]);
    const handleParticipantSelection = (0, react_1.useCallback)((option) => {
        const foundOptionIndex = selectedOptions.findIndex((selectedOption) => {
            if (selectedOption.accountID && selectedOption.accountID === option?.accountID) {
                return true;
            }
            if (selectedOption.reportID && selectedOption.reportID === option?.reportID) {
                return true;
            }
            return false;
        });
        if (foundOptionIndex < 0) {
            setSelectedOptions([...selectedOptions, getSelectedOptionData(option)]);
        }
        else {
            const newSelectedOptions = [...selectedOptions.slice(0, foundOptionIndex), ...selectedOptions.slice(foundOptionIndex + 1)];
            setSelectedOptions(newSelectedOptions);
        }
    }, [selectedOptions]);
    const footerContent = (0, react_1.useMemo)(() => (<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>), [applyChanges, resetChanges]);
    const isLoadingNewOptions = !!isSearchingForReports;
    const showLoadingPlaceholder = !didScreenTransitionEnd || !areOptionsInitialized || !initialAccountIDs || !personalDetails;
    return (<SelectionList_1.default canSelectMultiple sections={sections} ListItem={UserSelectionListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} headerMessage={headerMessage} textInputValue={searchTerm} footerContent={footerContent} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onChangeText={(value) => {
            setSearchTerm(value);
        }} onSelectRow={handleParticipantSelection} isLoadingNewOptions={isLoadingNewOptions} showLoadingPlaceholder={showLoadingPlaceholder}/>);
}
SearchFiltersParticipantsSelector.displayName = 'SearchFiltersParticipantsSelector';
exports.default = SearchFiltersParticipantsSelector;
