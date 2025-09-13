"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Navigation_1 = require("@navigation/Navigation");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const defaultListOptions = {
    recentReports: [],
    personalDetails: [],
    userToInvite: null,
    currentUserOption: null,
    headerMessage: '',
};
function getSelectedOptionData(option) {
    // eslint-disable-next-line rulesdir/no-default-id-values
    return { ...option, isSelected: true, reportID: option.reportID ?? '-1' };
}
function SearchFiltersChatsSelector({ initialReportIDs, onFiltersUpdate, isScreenTransitionEnd }) {
    const { translate } = (0, useLocalize_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const [selectedReportIDs, setSelectedReportIDs] = (0, react_1.useState)(initialReportIDs);
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const cleanSearchTerm = (0, react_1.useMemo)(() => searchTerm.trim().toLowerCase(), [searchTerm]);
    const selectedOptions = (0, react_1.useMemo)(() => {
        return selectedReportIDs.map((id) => {
            const report = getSelectedOptionData((0, OptionsListUtils_1.createOptionFromReport)({ ...reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${id}`], reportID: id }, personalDetails, reportAttributesDerived));
            const alternateText = (0, OptionsListUtils_1.getAlternateText)(report, {});
            return { ...report, alternateText };
        });
    }, [personalDetails, reportAttributesDerived, reports, selectedReportIDs]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized || !isScreenTransitionEnd) {
            return defaultListOptions;
        }
        return (0, OptionsListUtils_1.getSearchOptions)(options, undefined, false);
    }, [areOptionsInitialized, isScreenTransitionEnd, options]);
    const chatOptions = (0, react_1.useMemo)(() => {
        return (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, cleanSearchTerm, countryCode, {
            selectedOptions,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
        });
    }, [defaultOptions, cleanSearchTerm, selectedOptions, countryCode]);
    const { sections, headerMessage } = (0, react_1.useMemo)(() => {
        const newSections = [];
        if (!areOptionsInitialized) {
            return { sections: [], headerMessage: undefined };
        }
        const formattedResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(cleanSearchTerm, selectedOptions, chatOptions.recentReports, chatOptions.personalDetails, personalDetails, false, undefined, reportAttributesDerived);
        newSections.push(formattedResults.section);
        const visibleReportsWhenSearchTermNonEmpty = chatOptions.recentReports.map((report) => (selectedReportIDs.includes(report.reportID) ? getSelectedOptionData(report) : report));
        const visibleReportsWhenSearchTermEmpty = chatOptions.recentReports.filter((report) => !selectedReportIDs.includes(report.reportID));
        const reportsFiltered = cleanSearchTerm === '' ? visibleReportsWhenSearchTermEmpty : visibleReportsWhenSearchTermNonEmpty;
        newSections.push({
            title: undefined,
            data: reportsFiltered,
            shouldShow: chatOptions.recentReports.length > 0,
        });
        const areResultsFound = didScreenTransitionEnd && formattedResults.section.data.length === 0 && reportsFiltered.length === 0;
        const message = areResultsFound ? translate('common.noResultsFound') : undefined;
        return {
            sections: newSections,
            headerMessage: message,
        };
    }, [
        areOptionsInitialized,
        chatOptions.personalDetails,
        chatOptions.recentReports,
        cleanSearchTerm,
        didScreenTransitionEnd,
        personalDetails,
        reportAttributesDerived,
        selectedOptions,
        selectedReportIDs,
        translate,
    ]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchTerm.trim());
    }, [debouncedSearchTerm]);
    const handleParticipantSelection = (0, react_1.useCallback)((selectedOption) => {
        const optionReportID = selectedOption.reportID;
        if (!optionReportID) {
            return;
        }
        const foundOptionIndex = selectedReportIDs.findIndex((reportID) => {
            return reportID && reportID !== '' && selectedOption.reportID === reportID;
        });
        if (foundOptionIndex < 0) {
            setSelectedReportIDs([...selectedReportIDs, optionReportID]);
        }
        else {
            const newSelectedReports = [...selectedReportIDs.slice(0, foundOptionIndex), ...selectedReportIDs.slice(foundOptionIndex + 1)];
            setSelectedReportIDs(newSelectedReports);
        }
    }, [selectedReportIDs]);
    const footerContent = (<Button_1.default success text={translate('common.save')} pressOnEnter onPress={() => {
            onFiltersUpdate(selectedReportIDs);
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }} large/>);
    const isLoadingNewOptions = !!isSearchingForReports;
    const showLoadingPlaceholder = !didScreenTransitionEnd || !areOptionsInitialized || !initialReportIDs || !personalDetails;
    return (<SelectionList_1.default canSelectMultiple sections={sections} ListItem={InviteMemberListItem_1.default} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} headerMessage={headerMessage} textInputValue={searchTerm} footerContent={footerContent} showScrollIndicator shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onChangeText={(value) => {
            setSearchTerm(value);
        }} onSelectRow={handleParticipantSelection} isLoadingNewOptions={isLoadingNewOptions} showLoadingPlaceholder={showLoadingPlaceholder}/>);
}
SearchFiltersChatsSelector.displayName = 'SearchFiltersChatsSelector';
exports.default = SearchFiltersChatsSelector;
