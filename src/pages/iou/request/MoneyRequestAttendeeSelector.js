"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const reject_1 = require("lodash/reject");
const react_1 = require("react");
const Button_1 = require("@components/Button");
const EmptySelectionListContent_1 = require("@components/EmptySelectionListContent");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function MoneyRequestAttendeeSelector({ attendees = [], onFinish, onAttendeesAdded, iouType, action }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const { isOffline } = (0, useNetwork_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [recentAttendees] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_RECENT_ATTENDEES, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(activePolicyID);
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const cleanSearchTerm = (0, react_1.useMemo)(() => searchTerm.trim().toLowerCase(), [searchTerm]);
    const offlineMessage = isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : '';
    const isPaidGroupPolicy = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isPaidGroupPolicy)(policy), [policy]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchTerm.trim());
    }, [debouncedSearchTerm]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized || !didScreenTransitionEnd) {
            (0, OptionsListUtils_1.getEmptyOptions)();
        }
        const optionList = (0, OptionsListUtils_1.getAttendeeOptions)(options.reports, options.personalDetails, betas, attendees, recentAttendees ?? [], iouType === CONST_1.default.IOU.TYPE.SUBMIT, true, false, action);
        if (isPaidGroupPolicy) {
            const orderedOptions = (0, OptionsListUtils_1.orderOptions)(optionList, searchTerm, {
                preferChatRoomsOverThreads: true,
                preferPolicyExpenseChat: !!action,
                preferRecentExpenseReports: action === CONST_1.default.IOU.ACTION.CREATE,
            });
            optionList.recentReports = orderedOptions.recentReports;
            optionList.personalDetails = orderedOptions.personalDetails;
        }
        return optionList;
    }, [areOptionsInitialized, didScreenTransitionEnd, options.reports, options.personalDetails, betas, attendees, recentAttendees, iouType, action, isPaidGroupPolicy, searchTerm]);
    const chatOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return {
                userToInvite: null,
                recentReports: [],
                personalDetails: [],
                currentUserOption: null,
                headerMessage: '',
            };
        }
        const newOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, cleanSearchTerm, countryCode, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            preferPolicyExpenseChat: isPaidGroupPolicy,
            shouldAcceptName: true,
            selectedOptions: attendees.map((attendee) => ({
                ...attendee,
                reportID: CONST_1.default.DEFAULT_NUMBER_ID.toString(),
                selected: true,
                login: attendee.email,
                ...(0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(attendee.email),
            })),
        });
        return newOptions;
    }, [areOptionsInitialized, defaultOptions, cleanSearchTerm, isPaidGroupPolicy, attendees, countryCode]);
    /**
     * Returns the sections needed for the OptionsSelector
     */
    const [sections, header] = (0, react_1.useMemo)(() => {
        const newSections = [];
        if (!areOptionsInitialized || !didScreenTransitionEnd) {
            return [newSections, ''];
        }
        const fiveRecents = [...chatOptions.recentReports].slice(0, 5);
        const restOfRecents = [...chatOptions.recentReports].slice(5);
        const contactsWithRestOfRecents = [...restOfRecents, ...chatOptions.personalDetails];
        const formatResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(cleanSearchTerm, attendees.map((attendee) => ({
            ...attendee,
            reportID: CONST_1.default.DEFAULT_NUMBER_ID.toString(),
            selected: true,
            login: attendee.email,
            ...(0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(attendee.email),
        })), chatOptions.recentReports, chatOptions.personalDetails, personalDetails, true, undefined, reportAttributesDerived);
        newSections.push(formatResults.section);
        newSections.push({
            title: translate('common.recents'),
            data: fiveRecents,
            shouldShow: fiveRecents.length > 0,
        });
        newSections.push({
            title: translate('common.contacts'),
            data: contactsWithRestOfRecents,
            shouldShow: contactsWithRestOfRecents.length > 0,
        });
        if (chatOptions.userToInvite &&
            !(0, OptionsListUtils_1.isCurrentUser)({ ...chatOptions.userToInvite, accountID: chatOptions.userToInvite?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, status: chatOptions.userToInvite?.status ?? undefined })) {
            newSections.push({
                title: undefined,
                data: [chatOptions.userToInvite].map((participant) => {
                    const isPolicyExpenseChat = participant?.isPolicyExpenseChat ?? false;
                    return isPolicyExpenseChat ? (0, OptionsListUtils_1.getPolicyExpenseReportOption)(participant, reportAttributesDerived) : (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails);
                }),
                shouldShow: true,
            });
        }
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((chatOptions.personalDetails ?? []).length + (chatOptions.recentReports ?? []).length !== 0, !!chatOptions?.userToInvite, cleanSearchTerm, attendees.some((attendee) => (0, OptionsListUtils_1.getPersonalDetailSearchTerms)(attendee).join(' ').toLowerCase().includes(cleanSearchTerm)));
        return [newSections, headerMessage];
    }, [
        areOptionsInitialized,
        didScreenTransitionEnd,
        chatOptions.recentReports,
        chatOptions.personalDetails,
        chatOptions.userToInvite,
        cleanSearchTerm,
        attendees,
        personalDetails,
        translate,
        reportAttributesDerived,
    ]);
    const addAttendeeToSelection = (0, react_1.useCallback)((option) => {
        const isOptionSelected = (selectedOption) => {
            if (selectedOption.accountID && selectedOption.accountID === option?.accountID) {
                return true;
            }
            if (selectedOption.email && selectedOption.email === option?.login) {
                return true;
            }
            return false;
        };
        const isOptionInList = attendees.some(isOptionSelected);
        let newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = (0, reject_1.default)(attendees, isOptionSelected);
        }
        else {
            const iconSource = option.icons?.[0]?.source;
            const icon = typeof iconSource === 'function' ? '' : (iconSource?.toString() ?? '');
            newSelectedOptions = [
                ...attendees,
                {
                    accountID: option.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    login: option.login || option.text,
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    email: option.login || (option.text ?? ''),
                    displayName: option.text ?? '',
                    selected: true,
                    searchText: option.searchText,
                    avatarUrl: option.avatarUrl ?? icon,
                    iouType,
                },
            ];
        }
        onAttendeesAdded(newSelectedOptions);
    }, [attendees, iouType, onAttendeesAdded]);
    const shouldShowErrorMessage = attendees.length < 1;
    const handleConfirmSelection = (0, react_1.useCallback)((_keyEvent, option) => {
        if (shouldShowErrorMessage || (!attendees.length && !option)) {
            return;
        }
        onFinish(CONST_1.default.IOU.TYPE.SUBMIT);
    }, [shouldShowErrorMessage, onFinish, attendees]);
    const showLoadingPlaceholder = (0, react_1.useMemo)(() => !areOptionsInitialized || !didScreenTransitionEnd, [areOptionsInitialized, didScreenTransitionEnd]);
    const optionLength = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return 0;
        }
        return sections.reduce((acc, section) => acc + section.data.length, 0);
    }, [areOptionsInitialized, sections]);
    const shouldShowListEmptyContent = (0, react_1.useMemo)(() => optionLength === 0 && !showLoadingPlaceholder, [optionLength, showLoadingPlaceholder]);
    const footerContent = (0, react_1.useMemo)(() => {
        if (!shouldShowErrorMessage && !attendees.length) {
            return;
        }
        return (<>
                {shouldShowErrorMessage && (<FormHelpMessage_1.default style={[styles.ph1, styles.mb2]} isError message={translate('iou.error.atLeastOneAttendee')}/>)}
                <Button_1.default success text={translate('common.save')} onPress={handleConfirmSelection} pressOnEnter large isDisabled={shouldShowErrorMessage}/>
            </>);
    }, [handleConfirmSelection, attendees.length, shouldShowErrorMessage, styles, translate]);
    return (<SelectionList_1.default onConfirm={handleConfirmSelection} sections={areOptionsInitialized ? sections : CONST_1.default.EMPTY_ARRAY} ListItem={InviteMemberListItem_1.default} textInputValue={searchTerm} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputHint={offlineMessage} onChangeText={setSearchTerm} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onSelectRow={addAttendeeToSelection} shouldSingleExecuteRowSelect footerContent={footerContent} autoCorrect={false} listEmptyContent={<EmptySelectionListContent_1.default contentType={iouType}/>} headerMessage={header} showLoadingPlaceholder={showLoadingPlaceholder} canSelectMultiple isLoadingNewOptions={!!isSearchingForReports} shouldShowListEmptyContent={shouldShowListEmptyContent}/>);
}
MoneyRequestAttendeeSelector.displayName = 'MoneyRequestAttendeeSelector';
exports.default = (0, react_1.memo)(MoneyRequestAttendeeSelector, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.attendees, nextProps.attendees) && prevProps.iouType === nextProps.iouType);
