"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Share_1 = require("@libs/actions/Share");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const StringUtils_1 = require("@libs/StringUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const defaultListOptions = {
    userToInvite: null,
    recentReports: [],
    personalDetails: [],
    currentUserOption: null,
    categoryOptions: [],
};
function ShareTab(_, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [textInputValue, debouncedTextInputValue, setTextInputValue] = (0, useDebouncedState_1.default)('');
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const selectionListRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        focus: selectionListRef.current?.focusTextInput,
    }));
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const offlineMessage = isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : '';
    const showLoadingPlaceholder = (0, react_1.useMemo)(() => !areOptionsInitialized || !didScreenTransitionEnd, [areOptionsInitialized, didScreenTransitionEnd]);
    const searchOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return defaultListOptions;
        }
        return (0, OptionsListUtils_1.getSearchOptions)(options, betas ?? [], false, false, textInputValue, 20, true);
    }, [areOptionsInitialized, betas, options, textInputValue]);
    const recentReportsOptions = (0, react_1.useMemo)(() => {
        if (textInputValue.trim() === '') {
            return (0, OptionsListUtils_1.optionsOrderBy)(searchOptions.recentReports, OptionsListUtils_1.recentReportComparator, 20);
        }
        const orderedOptions = (0, OptionsListUtils_1.combineOrderingOfReportsAndPersonalDetails)(searchOptions, textInputValue, {
            sortByReportTypeInSearch: true,
            preferChatRoomsOverThreads: true,
        });
        const reportOptions = [...orderedOptions.recentReports, ...orderedOptions.personalDetails];
        if (searchOptions.userToInvite) {
            reportOptions.push(searchOptions.userToInvite);
        }
        return reportOptions.slice(0, 20);
    }, [searchOptions, textInputValue]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedTextInputValue.trim());
    }, [debouncedTextInputValue]);
    const styledRecentReports = recentReportsOptions.map((item) => ({
        ...item,
        pressableStyle: styles.br2,
        text: StringUtils_1.default.lineBreaksToSpaces(item.text),
        wrapperStyle: [styles.pr3, styles.pl3],
    }));
    const [sections, header] = (0, react_1.useMemo)(() => {
        const newSections = [];
        newSections.push({ title: textInputValue.trim() === '' ? translate('search.recentChats') : undefined, data: styledRecentReports });
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)(styledRecentReports.length !== 0, false, textInputValue.trim(), false);
        return [newSections, headerMessage];
    }, [textInputValue, styledRecentReports, translate]);
    const onSelectRow = (item) => {
        let reportID = item?.reportID ?? CONST_1.default.DEFAULT_NUMBER_ID;
        const accountID = item?.accountID;
        if (accountID && !reportID) {
            (0, Share_1.saveUnknownUserDetails)(item);
            const optimisticReport = (0, Report_1.getOptimisticChatReport)(accountID);
            reportID = optimisticReport.reportID;
            (0, Report_1.saveReportDraft)(reportID, optimisticReport).then(() => {
                Navigation_1.default.navigate(ROUTES_1.default.SHARE_DETAILS.getRoute(reportID.toString()));
            });
        }
        else {
            (0, Share_1.clearUnknownUserDetails)();
            Navigation_1.default.navigate(ROUTES_1.default.SHARE_DETAILS.getRoute(reportID.toString()));
        }
    };
    return (<SelectionList_1.default sections={areOptionsInitialized ? sections : CONST_1.default.EMPTY_ARRAY} textInputValue={textInputValue} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputHint={offlineMessage} onChangeText={setTextInputValue} headerMessage={header} sectionListStyle={[styles.ph2, styles.pb2, styles.overscrollBehaviorContain]} ListItem={InviteMemberListItem_1.default} showLoadingPlaceholder={showLoadingPlaceholder} shouldSingleExecuteRowSelect onSelectRow={onSelectRow} isLoadingNewOptions={!!isSearchingForReports} textInputAutoFocus={false} ref={selectionListRef}/>);
}
exports.default = (0, react_1.forwardRef)(ShareTab);
