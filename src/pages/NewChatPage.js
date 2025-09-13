"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const isEmpty_1 = require("lodash/isEmpty");
const reject_1 = require("lodash/reject");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const Pressable_1 = require("@components/Pressable");
const ReferralProgramCTA_1 = require("@components/ReferralProgramCTA");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectCircle_1 = require("@components/SelectCircle");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useContactImport_1 = require("@hooks/useContactImport");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useDismissedReferralBanners_1 = require("@hooks/useDismissedReferralBanners");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Log_1 = require("@libs/Log");
const memoize_1 = require("@libs/memoize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const keyboard_1 = require("@src/utils/keyboard");
const excludedGroupEmails = CONST_1.default.EXPENSIFY_EMAILS.filter((value) => value !== CONST_1.default.EMAIL.CONCIERGE);
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'NewChatPage.getValidOptions' });
function useOptions() {
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)([]);
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const [newGroupDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NEW_GROUP_CHAT_DRAFT, { canBeMissing: true });
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const personalData = (0, useCurrentUserPersonalDetails_1.default)();
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const [didScreenTransitionEnd, setDidScreenTransitionEnd] = (0, react_1.useState)(false);
    const { contacts } = (0, useContactImport_1.default)();
    const { options: listOptions, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const defaultOptions = (0, react_1.useMemo)(() => {
        const filteredOptions = memoizedGetValidOptions({
            reports: listOptions.reports ?? [],
            personalDetails: (listOptions.personalDetails ?? []).concat(contacts),
        }, {
            betas: betas ?? [],
            includeSelfDM: true,
        });
        return filteredOptions;
    }, [betas, listOptions.personalDetails, listOptions.reports, contacts]);
    const unselectedOptions = (0, react_1.useMemo)(() => (0, OptionsListUtils_1.filterSelectedOptions)(defaultOptions, new Set(selectedOptions.map(({ accountID }) => accountID))), [defaultOptions, selectedOptions]);
    const options = (0, react_1.useMemo)(() => {
        const filteredOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(unselectedOptions, debouncedSearchTerm, countryCode, {
            selectedOptions,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
        });
        return filteredOptions;
    }, [debouncedSearchTerm, unselectedOptions, selectedOptions, countryCode]);
    const cleanSearchTerm = (0, react_1.useMemo)(() => debouncedSearchTerm.trim().toLowerCase(), [debouncedSearchTerm]);
    const headerMessage = (0, react_1.useMemo)(() => {
        return (0, OptionsListUtils_1.getHeaderMessage)(options.personalDetails.length + options.recentReports.length !== 0, !!options.userToInvite, debouncedSearchTerm.trim(), selectedOptions.some((participant) => (0, OptionsListUtils_1.getPersonalDetailSearchTerms)(participant).join(' ').toLowerCase?.().includes(cleanSearchTerm)));
    }, [cleanSearchTerm, debouncedSearchTerm, options.personalDetails.length, options.recentReports.length, options.userToInvite, selectedOptions]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            setDidScreenTransitionEnd(true);
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current);
    }, []));
    (0, react_1.useEffect)(() => {
        if (!debouncedSearchTerm.length) {
            return;
        }
        (0, Report_1.searchInServer)(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    (0, react_1.useEffect)(() => {
        if (!newGroupDraft?.participants) {
            return;
        }
        const newSelectedOptions = [];
        newGroupDraft.participants.forEach((participant) => {
            if (participant.accountID === personalData.accountID) {
                return;
            }
            let participantOption = listOptions.personalDetails.find((option) => option.accountID === participant.accountID);
            if (!participantOption) {
                participantOption = (0, OptionsListUtils_1.getUserToInviteOption)({
                    searchValue: participant?.login,
                });
            }
            if (!participantOption) {
                return;
            }
            newSelectedOptions.push({
                ...participantOption,
                isSelected: true,
            });
        });
        setSelectedOptions(newSelectedOptions);
    }, [newGroupDraft?.participants, listOptions.personalDetails, personalData.accountID]);
    return {
        ...options,
        searchTerm,
        debouncedSearchTerm,
        setSearchTerm,
        areOptionsInitialized: areOptionsInitialized && didScreenTransitionEnd,
        selectedOptions,
        setSelectedOptions,
        headerMessage,
    };
}
function NewChatPage(_, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to show offline indicator on small screen only
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const styles = (0, useThemeStyles_1.default)();
    const personalData = (0, useCurrentUserPersonalDetails_1.default)();
    const { top } = (0, useSafeAreaInsets_1.default)();
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const selectionListRef = (0, react_1.useRef)(null);
    const { singleExecution } = (0, useSingleExecution_1.default)();
    (0, react_1.useImperativeHandle)(ref, () => ({
        focus: selectionListRef.current?.focusTextInput,
    }));
    const { headerMessage, searchTerm, debouncedSearchTerm, setSearchTerm, selectedOptions, setSelectedOptions, recentReports, personalDetails, userToInvite, areOptionsInitialized } = useOptions();
    const [sections, firstKeyForList] = (0, react_1.useMemo)(() => {
        const sectionsList = [];
        let firstKey = '';
        const formatResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(debouncedSearchTerm, selectedOptions, recentReports, personalDetails, undefined, undefined, undefined, reportAttributesDerived);
        sectionsList.push(formatResults.section);
        if (!firstKey) {
            firstKey = (0, OptionsListUtils_1.getFirstKeyForList)(formatResults.section.data);
        }
        sectionsList.push({
            title: translate('common.recents'),
            data: selectedOptions.length ? recentReports.filter((option) => !option.isSelfDM) : recentReports,
            shouldShow: !(0, isEmpty_1.default)(recentReports),
        });
        if (!firstKey) {
            firstKey = (0, OptionsListUtils_1.getFirstKeyForList)(recentReports);
        }
        sectionsList.push({
            title: translate('common.contacts'),
            data: personalDetails,
            shouldShow: !(0, isEmpty_1.default)(personalDetails),
        });
        if (!firstKey) {
            firstKey = (0, OptionsListUtils_1.getFirstKeyForList)(personalDetails);
        }
        if (userToInvite) {
            sectionsList.push({
                title: undefined,
                data: [userToInvite],
                shouldShow: true,
            });
            if (!firstKey) {
                firstKey = (0, OptionsListUtils_1.getFirstKeyForList)([userToInvite]);
            }
        }
        return [sectionsList, firstKey];
    }, [debouncedSearchTerm, selectedOptions, recentReports, personalDetails, reportAttributesDerived, translate, userToInvite]);
    /**
     * Removes a selected option from list if already selected. If not already selected add this option to the list.
     */
    const toggleOption = (0, react_1.useCallback)((option) => {
        const isOptionInList = !!option.isSelected;
        let newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = (0, reject_1.default)(selectedOptions, (selectedOption) => selectedOption.login === option.login);
        }
        else {
            newSelectedOptions = [...selectedOptions, { ...option, isSelected: true, selected: true, reportID: option.reportID }];
            selectionListRef?.current?.scrollToIndex(0, true);
        }
        selectionListRef?.current?.clearInputAfterSelect?.();
        if (!(0, DeviceCapabilities_1.canUseTouchScreen)()) {
            selectionListRef.current?.focusTextInput();
        }
        setSelectedOptions(newSelectedOptions);
    }, [selectedOptions, setSelectedOptions]);
    /**
     * If there are selected options already then it will toggle the option otherwise
     * creates a new 1:1 chat with the option and the current user,
     * or navigates to the existing chat if one with those participants already exists.
     */
    const selectOption = (0, react_1.useCallback)((option) => {
        if (option?.isSelfDM) {
            if (!option.reportID) {
                Navigation_1.default.dismissModal();
                return;
            }
            Navigation_1.default.dismissModalWithReport({ reportID: option.reportID });
            return;
        }
        if (selectedOptions.length && option) {
            // Prevent excluded emails from being added to groups
            if (option?.login && excludedGroupEmails.includes(option.login)) {
                return;
            }
            toggleOption(option);
            return;
        }
        let login = '';
        if (option?.login) {
            login = option.login;
        }
        else if (selectedOptions.length === 1) {
            login = selectedOptions.at(0)?.login ?? '';
        }
        if (!login) {
            Log_1.default.warn('Tried to create chat with empty login');
            return;
        }
        keyboard_1.default.dismiss().then(() => {
            singleExecution(() => (0, Report_1.navigateToAndOpenReport)([login]))();
        });
    }, [selectedOptions, toggleOption, singleExecution]);
    const itemRightSideComponent = (0, react_1.useCallback)((item, isFocused) => {
        if (!!item.isSelfDM || (item.login && excludedGroupEmails.includes(item.login))) {
            return null;
        }
        if (item.isSelected) {
            return (<Pressable_1.PressableWithFeedback onPress={() => toggleOption(item)} disabled={item.isDisabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={CONST_1.default.ROLE.BUTTON} style={[styles.flexRow, styles.alignItemsCenter, styles.ml5, styles.optionSelectCircle]}>
                        <SelectCircle_1.default isChecked={item.isSelected} selectCircleStyles={styles.ml0}/>
                    </Pressable_1.PressableWithFeedback>);
        }
        const buttonInnerStyles = isFocused ? styles.buttonDefaultHovered : {};
        return (<Button_1.default onPress={() => toggleOption(item)} style={[styles.pl2]} text={translate('newChatPage.addToGroup')} innerStyles={buttonInnerStyles} small/>);
    }, [toggleOption, styles.alignItemsCenter, styles.buttonDefaultHovered, styles.flexRow, styles.ml0, styles.ml5, styles.optionSelectCircle, styles.pl2, translate]);
    const createGroup = (0, react_1.useCallback)(() => {
        if (!personalData || !personalData.login || !personalData.accountID) {
            return;
        }
        const selectedParticipants = selectedOptions.map((option) => ({
            login: option?.login,
            accountID: option.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        }));
        const logins = [...selectedParticipants, { login: personalData.login, accountID: personalData.accountID }];
        (0, Report_1.setGroupDraft)({ participants: logins });
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.navigate(ROUTES_1.default.NEW_CHAT_CONFIRM);
    }, [selectedOptions, personalData]);
    const { isDismissed } = (0, useDismissedReferralBanners_1.default)({ referralContentType: CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.START_CHAT });
    const footerContent = (0, react_1.useMemo)(() => (!isDismissed || selectedOptions.length > 0) && (<>
                    <ReferralProgramCTA_1.default referralContentType={CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.START_CHAT} style={selectedOptions.length ? styles.mb5 : undefined}/>

                    {!!selectedOptions.length && (<Button_1.default success large text={translate('common.next')} onPress={createGroup} pressOnEnter/>)}
                </>), [createGroup, selectedOptions.length, styles.mb5, translate, isDismissed]);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding includePaddingTop={false} shouldEnablePickerAvoiding={false} disableOfflineIndicatorSafeAreaPadding shouldShowOfflineIndicator={false} keyboardVerticalOffset={variables_1.default.contentHeaderHeight + top + variables_1.default.tabSelectorButtonHeight + variables_1.default.tabSelectorButtonPadding} 
    // Disable the focus trap of this page to activate the parent focus trap in `NewChatSelectorPage`.
    focusTrapSettings={{ active: false }} testID={NewChatPage.displayName}>
            <SelectionList_1.default ref={selectionListRef} ListItem={UserListItem_1.default} sections={areOptionsInitialized ? sections : CONST_1.default.EMPTY_ARRAY} textInputValue={searchTerm} textInputHint={isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : ''} onChangeText={setSearchTerm} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} headerMessage={headerMessage} onSelectRow={selectOption} shouldSingleExecuteRowSelect onConfirm={(e, option) => (selectedOptions.length > 0 ? createGroup() : selectOption(option))} rightHandSideComponent={itemRightSideComponent} footerContent={footerContent} showLoadingPlaceholder={!areOptionsInitialized} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} isLoadingNewOptions={!!isSearchingForReports} initiallyFocusedOptionKey={firstKeyForList} shouldTextInputInterceptSwipe addBottomSafeAreaPadding textInputAutoFocus={false}/>
        </ScreenWrapper_1.default>);
}
NewChatPage.displayName = 'NewChatPage';
exports.default = (0, react_1.forwardRef)(NewChatPage);
