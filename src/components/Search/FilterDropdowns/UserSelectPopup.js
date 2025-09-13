"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const UserSelectionListItem_1 = require("@components/SelectionList/Search/UserSelectionListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
const memoize_1 = require("@libs/memoize");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function getSelectedOptionData(option) {
    return { ...option, reportID: `${option.reportID}`, selected: true };
}
const optionsMatch = (opt1, opt2) => {
    // Below is just a boolean expression.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return (opt1.accountID && opt1.accountID === opt2?.accountID) || (opt1.reportID && opt1.reportID === opt2?.reportID);
};
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'UserSelectPopup.getValidOptions' });
function UserSelectPopup({ value, closeOverlay, onChange }) {
    const selectionListRef = (0, react_1.useRef)(null);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { options } = (0, OptionListContextProvider_1.useOptionsList)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true, selector: (onyxSession) => onyxSession?.accountID });
    const shouldFocusInputOnScreenFocus = (0, canFocusInputOnScreenFocus_1.default)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const initialSelectedOptions = (0, react_1.useMemo)(() => {
        return value.reduce((acc, id) => {
            const participant = personalDetails?.[id];
            if (!participant) {
                return acc;
            }
            const optionData = getSelectedOptionData(participant);
            if (optionData) {
                acc.push(optionData);
            }
            return acc;
        }, []);
    }, [value, personalDetails]);
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)(initialSelectedOptions);
    const cleanSearchTerm = searchTerm.trim().toLowerCase();
    const selectedAccountIDs = (0, react_1.useMemo)(() => {
        return new Set(selectedOptions.map((option) => option.accountID).filter(Boolean));
    }, [selectedOptions]);
    const optionsList = (0, react_1.useMemo)(() => {
        return memoizedGetValidOptions({
            reports: options.reports,
            personalDetails: options.personalDetails,
        }, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            includeCurrentUser: true,
        });
    }, [options.reports, options.personalDetails]);
    const filteredOptions = (0, react_1.useMemo)(() => {
        return (0, OptionsListUtils_1.filterAndOrderOptions)(optionsList, cleanSearchTerm, countryCode, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
            canInviteUser: false,
        });
    }, [optionsList, cleanSearchTerm, countryCode]);
    const listData = (0, react_1.useMemo)(() => {
        const personalDetailList = filteredOptions.personalDetails.map((participant) => ({
            ...participant,
            isSelected: selectedAccountIDs.has(participant.accountID),
        }));
        const recentReportsList = filteredOptions.recentReports.map((report) => ({
            ...report,
            isSelected: selectedAccountIDs.has(report.accountID),
        }));
        const combined = [...personalDetailList, ...recentReportsList];
        combined.sort((a, b) => {
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
    const { sections, headerMessage } = (0, react_1.useMemo)(() => {
        const newSections = [
            {
                title: '',
                data: listData,
                shouldShow: !(0, isEmpty_1.default)(listData),
            },
        ];
        const noResultsFound = (0, isEmpty_1.default)(listData);
        const message = noResultsFound ? translate('common.noResultsFound') : undefined;
        return {
            sections: newSections,
            headerMessage: message,
        };
    }, [listData, translate]);
    const selectUser = (0, react_1.useCallback)((option) => {
        const isSelected = selectedOptions.some((selected) => optionsMatch(selected, option));
        setSelectedOptions((prev) => (isSelected ? prev.filter((selected) => !optionsMatch(selected, option)) : [...prev, getSelectedOptionData(option)]));
        selectionListRef?.current?.scrollToIndex(0, true);
    }, [selectedOptions]);
    const applyChanges = (0, react_1.useCallback)(() => {
        const accountIDs = selectedOptions.map((option) => (option.accountID ? option.accountID.toString() : undefined)).filter(Boolean);
        closeOverlay();
        onChange(accountIDs);
    }, [closeOverlay, onChange, selectedOptions]);
    const resetChanges = (0, react_1.useCallback)(() => {
        onChange([]);
        closeOverlay();
    }, [closeOverlay, onChange]);
    const isLoadingNewOptions = !!isSearchingForReports;
    const dataLength = sections.flatMap((section) => section.data).length;
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
