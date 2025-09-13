"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const types_1 = require("@libs/API/types");
const HttpUtils_1 = require("@libs/HttpUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const selectReportHandler = (option) => {
    HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
    const optionItem = option;
    if (!optionItem || !optionItem?.reportID) {
        return;
    }
    (0, Task_1.setShareDestinationValue)(optionItem?.reportID);
    Navigation_1.default.goBack(ROUTES_1.default.NEW_TASK.getRoute());
};
const reportFilter = (reportOptions, archivedReportsIDList) => (reportOptions ?? []).reduce((filtered, option) => {
    const report = option.item;
    const isReportArchived = archivedReportsIDList.has(report?.reportID);
    if ((0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived) && (0, ReportUtils_1.canCreateTaskInReport)(report) && !(0, ReportUtils_1.isCanceledTaskReport)(report)) {
        filtered.push(option);
    }
    return filtered;
}, []);
function TaskShareDestinationSelectorModal() {
    const [didScreenTransitionEnd, setDidScreenTransitionEnd] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const { options: optionList, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const [archivedReportsIdSet = new Set()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {
        canBeMissing: true,
        selector: (all) => {
            const ids = new Set();
            if (!all) {
                return ids;
            }
            const prefixLength = ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS.length;
            for (const [key, value] of Object.entries(all)) {
                if ((0, ReportUtils_1.isArchivedReport)(value)) {
                    const reportID = key.slice(prefixLength);
                    ids.add(reportID);
                }
            }
            return ids;
        },
    });
    const textInputHint = (0, react_1.useMemo)(() => (isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : ''), [isOffline, translate]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return {
                recentReports: [],
                personalDetails: [],
                userToInvite: null,
                currentUserOption: null,
                header: '',
            };
        }
        const filteredReports = reportFilter(optionList.reports, archivedReportsIdSet);
        const { recentReports } = (0, OptionsListUtils_1.getShareDestinationOptions)(filteredReports, optionList.personalDetails, [], [], {}, true);
        const header = (0, OptionsListUtils_1.getHeaderMessage)(recentReports && recentReports.length !== 0, false, '');
        return {
            recentReports,
            personalDetails: [],
            userToInvite: null,
            currentUserOption: null,
            header,
        };
    }, [areOptionsInitialized, optionList.personalDetails, optionList.reports, archivedReportsIdSet]);
    const options = (0, react_1.useMemo)(() => {
        if (debouncedSearchValue.trim() === '') {
            return defaultOptions;
        }
        const filteredReports = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchValue.trim(), countryCode, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            canInviteUser: false,
        });
        const header = (0, OptionsListUtils_1.getHeaderMessage)(filteredReports.recentReports && filteredReports.recentReports.length !== 0, false, debouncedSearchValue);
        return { ...filteredReports, header };
    }, [debouncedSearchValue, defaultOptions, countryCode]);
    const sections = (0, react_1.useMemo)(() => options.recentReports && options.recentReports.length > 0
        ? [
            {
                data: options.recentReports.map((option) => ({
                    ...option,
                    text: option.text ?? '',
                    alternateText: option.alternateText ?? undefined,
                    keyForList: option.keyForList ?? '',
                    isDisabled: option.isDisabled ?? undefined,
                    login: option.login ?? undefined,
                    shouldShowSubscript: option.shouldShowSubscript ?? undefined,
                })),
                shouldShow: true,
            },
        ]
        : [], [options.recentReports]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchValue);
    }, [debouncedSearchValue]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID="TaskShareDestinationSelectorModal" onEntryTransitionEnd={() => setDidScreenTransitionEnd(true)}>
            <>
                <HeaderWithBackButton_1.default title={translate('common.share')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.NEW_TASK.getRoute())}/>
                <react_native_1.View style={[styles.flex1, styles.w100, styles.pRelative]}>
                    <SelectionList_1.default ListItem={UserListItem_1.default} sections={areOptionsInitialized ? sections : []} onSelectRow={selectReportHandler} shouldSingleExecuteRowSelect onChangeText={setSearchValue} textInputValue={searchValue} headerMessage={options.header} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} showLoadingPlaceholder={areOptionsInitialized && debouncedSearchValue.trim() === '' ? sections.length === 0 : !didScreenTransitionEnd} isLoadingNewOptions={!!isSearchingForReports} textInputHint={textInputHint}/>
                </react_native_1.View>
            </>
        </ScreenWrapper_1.default>);
}
TaskShareDestinationSelectorModal.displayName = 'TaskShareDestinationSelectorModal';
exports.default = TaskShareDestinationSelectorModal;
