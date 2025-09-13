"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const Report_1 = require("@libs/actions/Report");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseShareLogList({ onAttachLogToReport }) {
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const betas = (0, OnyxListItemProvider_1.useBetas)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return {
                recentReports: [],
                personalDetails: [],
                userToInvite: null,
                currentUserOption: null,
                headerMessage: '',
            };
        }
        const shareLogOptions = (0, OptionsListUtils_1.getShareLogOptions)(options, betas ?? []);
        const header = (0, OptionsListUtils_1.getHeaderMessage)((shareLogOptions.recentReports.length || 0) + (shareLogOptions.personalDetails.length || 0) !== 0, !!shareLogOptions.userToInvite, '');
        return {
            ...shareLogOptions,
            headerMessage: header,
        };
    }, [areOptionsInitialized, options, betas]);
    const searchOptions = (0, react_1.useMemo)(() => {
        if (debouncedSearchValue.trim() === '') {
            return defaultOptions;
        }
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchValue, countryCode, {
            preferChatRoomsOverThreads: true,
            sortByReportTypeInSearch: true,
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((filteredOptions.recentReports?.length || 0) + (filteredOptions.personalDetails?.length || 0) !== 0, !!filteredOptions.userToInvite, debouncedSearchValue.trim());
        return { ...filteredOptions, headerMessage };
    }, [debouncedSearchValue, defaultOptions, countryCode]);
    const sections = (0, react_1.useMemo)(() => {
        const sectionsList = [];
        sectionsList.push({
            title: translate('common.recents'),
            data: searchOptions.recentReports,
            shouldShow: searchOptions.recentReports?.length > 0,
        });
        sectionsList.push({
            title: translate('common.contacts'),
            data: searchOptions.personalDetails,
            shouldShow: searchOptions.personalDetails?.length > 0,
        });
        if (searchOptions.userToInvite) {
            sectionsList.push({
                data: [searchOptions.userToInvite],
                shouldShow: true,
            });
        }
        return sectionsList;
    }, [searchOptions?.personalDetails, searchOptions?.recentReports, searchOptions?.userToInvite, translate]);
    const attachLogToReport = (option) => {
        if (!option.reportID) {
            return;
        }
        const filename = (0, FileUtils_1.appendTimeToFileName)('logs.txt');
        onAttachLogToReport(option.reportID, filename);
    };
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchValue);
    }, [debouncedSearchValue]);
    return (<ScreenWrapper_1.default testID={BaseShareLogList.displayName} includeSafeAreaPaddingBottom={false}>
            {({ didScreenTransitionEnd }) => (<>
                    <HeaderWithBackButton_1.default title={translate('initialSettingsPage.debugConsole.shareLog')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONSOLE.getRoute())}/>
                    <SelectionList_1.default ListItem={UserListItem_1.default} sections={didScreenTransitionEnd ? sections : CONST_1.default.EMPTY_ARRAY} onSelectRow={attachLogToReport} shouldSingleExecuteRowSelect onChangeText={setSearchValue} textInputValue={searchValue} headerMessage={searchOptions.headerMessage} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputHint={isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : ''} showLoadingPlaceholder={!didScreenTransitionEnd} isLoadingNewOptions={!!isSearchingForReports}/>
                </>)}
        </ScreenWrapper_1.default>);
}
BaseShareLogList.displayName = 'ShareLogPage';
exports.default = BaseShareLogList;
