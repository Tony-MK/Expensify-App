"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable es/no-optional-chaining */
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const withNavigationTransitionEnd_1 = require("@components/withNavigationTransitionEnd");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Task_1 = require("@libs/actions/Task");
const types_1 = require("@libs/API/types");
const HttpUtils_1 = require("@libs/HttpUtils");
const memoize_1 = require("@libs/memoize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'TaskAssigneeSelectorModal.getValidOptions' });
function useOptions() {
    const betas = (0, OnyxListItemProvider_1.useBetas)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [searchValue, debouncedSearchValue, setSearchValue] = (0, useDebouncedState_1.default)('');
    const { options: optionsList, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const defaultOptions = (0, react_1.useMemo)(() => {
        const { recentReports, personalDetails, userToInvite, currentUserOption } = memoizedGetValidOptions({
            reports: optionsList.reports,
            personalDetails: optionsList.personalDetails,
        }, {
            betas,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            includeCurrentUser: true,
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((recentReports?.length || 0) + (personalDetails?.length || 0) !== 0 || !!currentUserOption, !!userToInvite, '');
        if (isLoading) {
            // eslint-disable-next-line react-compiler/react-compiler
            setIsLoading(false);
        }
        return {
            userToInvite,
            recentReports,
            personalDetails,
            currentUserOption,
            headerMessage,
        };
    }, [optionsList.reports, optionsList.personalDetails, betas, isLoading]);
    const optionsWithoutCurrentUser = (0, react_1.useMemo)(() => {
        if (!session?.accountID) {
            return defaultOptions;
        }
        return {
            ...defaultOptions,
            personalDetails: defaultOptions.personalDetails.filter((detail) => detail.accountID !== session.accountID),
            recentReports: defaultOptions.recentReports.filter((report) => report.accountID !== session.accountID),
        };
    }, [defaultOptions, session?.accountID]);
    const options = (0, react_1.useMemo)(() => {
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(optionsWithoutCurrentUser, debouncedSearchValue.trim(), countryCode, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
        });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((filteredOptions.recentReports?.length || 0) + (filteredOptions.personalDetails?.length || 0) !== 0 || !!filteredOptions.currentUserOption, !!filteredOptions.userToInvite, debouncedSearchValue);
        return {
            ...filteredOptions,
            headerMessage,
        };
    }, [debouncedSearchValue, optionsWithoutCurrentUser, countryCode]);
    return { ...options, searchValue, debouncedSearchValue, setSearchValue, areOptionsInitialized };
}
function TaskAssigneeSelectorModal() {
    const styles = (0, useThemeStyles_1.default)();
    const route = (0, native_1.useRoute)();
    const { translate } = (0, useLocalize_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const backTo = route.params?.backTo;
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [task] = (0, useOnyx_1.default)(ONYXKEYS_1.default.TASK, { canBeMissing: false });
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const { userToInvite, recentReports, personalDetails, currentUserOption, searchValue, debouncedSearchValue, setSearchValue, headerMessage, areOptionsInitialized } = useOptions();
    const report = (0, react_1.useMemo)(() => {
        if (!route.params?.reportID) {
            return;
        }
        const reportOnyx = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${route.params?.reportID}`];
        if (reportOnyx && !(0, ReportUtils_1.isTaskReport)(reportOnyx)) {
            Navigation_1.default.isNavigationReady().then(() => {
                Navigation_1.default.dismissModalWithReport({ reportID: reportOnyx.reportID });
            });
        }
        return reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${route.params?.reportID}`];
    }, [reports, route]);
    const sections = (0, react_1.useMemo)(() => {
        const sectionsList = [];
        if (currentUserOption) {
            sectionsList.push({
                title: translate('newTaskPage.assignMe'),
                data: [currentUserOption],
                shouldShow: true,
            });
        }
        sectionsList.push({
            title: translate('common.recents'),
            data: recentReports,
            shouldShow: recentReports?.length > 0,
        });
        sectionsList.push({
            title: translate('common.contacts'),
            data: personalDetails,
            shouldShow: personalDetails?.length > 0,
        });
        if (userToInvite) {
            sectionsList.push({
                title: '',
                data: [userToInvite],
                shouldShow: true,
            });
        }
        return sectionsList.map((section) => ({
            ...section,
            data: section.data.map((option) => ({
                ...option,
                text: option.text ?? '',
                alternateText: option.alternateText ?? undefined,
                keyForList: option.keyForList ?? '',
                isDisabled: option.isDisabled ?? undefined,
                login: option.login ?? undefined,
                shouldShowSubscript: option.shouldShowSubscript ?? undefined,
            })),
        }));
    }, [currentUserOption, personalDetails, recentReports, translate, userToInvite]);
    const selectReport = (0, react_1.useCallback)((option) => {
        HttpUtils_1.default.cancelPendingRequests(types_1.READ_COMMANDS.SEARCH_FOR_REPORTS);
        if (!option) {
            return;
        }
        // Check to see if we're editing a task and if so, update the assignee
        if (report) {
            if (option.accountID !== report.managerID) {
                const assigneeChatReport = (0, Task_1.setAssigneeValue)(option?.login ?? '', option?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, report.reportID, undefined, // passing null as report because for editing task the report will be task details report page not the actual report where task was created
                (0, OptionsListUtils_1.isCurrentUser)({ ...option, accountID: option?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, login: option?.login ?? '' }));
                // Pass through the selected assignee
                (0, Task_1.editTaskAssignee)(report, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, option?.login ?? '', option?.accountID, assigneeChatReport);
            }
            react_native_1.InteractionManager.runAfterInteractions(() => {
                Navigation_1.default.dismissModalWithReport({ reportID: report?.reportID });
            });
            // If there's no report, we're creating a new task
        }
        else if (option.accountID) {
            (0, Task_1.setAssigneeValue)(option?.login ?? '', option.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, task?.shareDestination ?? '', undefined, // passing null as report is null in this condition
            (0, OptionsListUtils_1.isCurrentUser)({ ...option, accountID: option?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, login: option?.login ?? undefined }));
            react_native_1.InteractionManager.runAfterInteractions(() => {
                Navigation_1.default.goBack(ROUTES_1.default.NEW_TASK.getRoute(backTo));
            });
        }
    }, [session?.accountID, task?.shareDestination, report, backTo]);
    const handleBackButtonPress = (0, react_1.useCallback)(() => Navigation_1.default.goBack(!route.params?.reportID ? ROUTES_1.default.NEW_TASK.getRoute(backTo) : backTo), [route.params, backTo]);
    const isOpen = (0, ReportUtils_1.isOpenTaskReport)(report);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(report?.parentReportID);
    const isTaskModifiable = (0, Task_1.canModifyTask)(report, currentUserPersonalDetails.accountID, isParentReportArchived);
    const isTaskNonEditable = (0, ReportUtils_1.isTaskReport)(report) && (!isTaskModifiable || !isOpen);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchValue);
    }, [debouncedSearchValue]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={TaskAssigneeSelectorModal.displayName}>
            <FullPageNotFoundView_1.default shouldShow={isTaskNonEditable}>
                <HeaderWithBackButton_1.default title={translate('task.assignee')} onBackButtonPress={handleBackButtonPress}/>
                <react_native_1.View style={[styles.flex1, styles.w100, styles.pRelative]}>
                    <SelectionList_1.default sections={areOptionsInitialized ? sections : []} ListItem={UserListItem_1.default} onSelectRow={selectReport} shouldSingleExecuteRowSelect onChangeText={setSearchValue} textInputValue={searchValue} headerMessage={headerMessage} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} showLoadingPlaceholder={!areOptionsInitialized} isLoadingNewOptions={!!isSearchingForReports}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TaskAssigneeSelectorModal.displayName = 'TaskAssigneeSelectorModal';
exports.default = (0, withNavigationTransitionEnd_1.default)((0, withCurrentUserPersonalDetails_1.default)(TaskAssigneeSelectorModal));
