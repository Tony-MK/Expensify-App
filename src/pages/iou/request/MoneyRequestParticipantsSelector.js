"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const pick_1 = require("lodash/pick");
const reject_1 = require("lodash/reject");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_permissions_1 = require("react-native-permissions");
const Button_1 = require("@components/Button");
const ContactPermissionModal_1 = require("@components/ContactPermissionModal");
const EmptySelectionListContent_1 = require("@components/EmptySelectionListContent");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ReferralProgramCTA_1 = require("@components/ReferralProgramCTA");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useContactImport_1 = require("@hooks/useContactImport");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useDismissedReferralBanners_1 = require("@hooks/useDismissedReferralBanners");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getPlatform_1 = require("@libs/getPlatform");
const goToSettings_1 = require("@libs/goToSettings");
const IOUUtils_1 = require("@libs/IOUUtils");
const memoize_1 = require("@libs/memoize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const Policy_1 = require("@userActions/Policy/Policy");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ImportContactButton_1 = require("./ImportContactButton");
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'MoneyRequestParticipantsSelector.getValidOptions' });
function MoneyRequestParticipantsSelector({ participants = CONST_1.default.EMPTY_ARRAY, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
onFinish = (_value) => { }, onParticipantsAdded, iouType, action, isPerDiemRequest = false, }, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const { contactPermissionState, contacts, setContactPermissionState, importAndSaveContacts } = (0, useContactImport_1.default)();
    const platform = (0, getPlatform_1.default)();
    const isNative = platform === CONST_1.default.PLATFORM.ANDROID || platform === CONST_1.default.PLATFORM.IOS;
    const showImportContacts = isNative && !(contactPermissionState === react_native_permissions_1.RESULTS.GRANTED || contactPermissionState === react_native_permissions_1.RESULTS.LIMITED);
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const referralContentType = CONST_1.default.REFERRAL_PROGRAM.CONTENT_TYPES.SUBMIT_EXPENSE;
    const { isOffline } = (0, useNetwork_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { isDismissed } = (0, useDismissedReferralBanners_1.default)({ referralContentType });
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(activePolicyID);
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { canBeMissing: true, initWithStoredValues: false });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true, selector: (session) => session?.email });
    const { options, areOptionsInitialized, initializeOptions } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const [textInputAutoFocus, setTextInputAutoFocus] = (0, react_1.useState)(!isNative);
    const selectionListRef = (0, react_1.useRef)(null);
    const cleanSearchTerm = (0, react_1.useMemo)(() => debouncedSearchTerm.trim().toLowerCase(), [debouncedSearchTerm]);
    const offlineMessage = isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : '';
    const isPaidGroupPolicy = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isPaidGroupPolicy)(policy), [policy]);
    const isIOUSplit = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isCategorizeOrShareAction = [CONST_1.default.IOU.ACTION.CATEGORIZE, CONST_1.default.IOU.ACTION.SHARE].some((option) => option === action);
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true });
    const hasBeenAddedToNudgeMigration = !!tryNewDot?.nudgeMigration?.timestamp;
    const canShowManagerMcTest = (0, react_1.useMemo)(() => !hasBeenAddedToNudgeMigration && action !== CONST_1.default.IOU.ACTION.SUBMIT, [hasBeenAddedToNudgeMigration, action]);
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchTerm.trim());
    }, [debouncedSearchTerm]);
    (0, react_1.useEffect)(() => {
        // This is necessary to ensure the options list is always up to date
        // e.g. if the approver was changed in the policy, we need to update the options list
        initializeOptions();
    }, [initializeOptions]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized || !didScreenTransitionEnd) {
            return {
                userToInvite: null,
                recentReports: [],
                personalDetails: [],
                currentUserOption: null,
                headerMessage: '',
            };
        }
        const optionList = memoizedGetValidOptions({
            reports: options.reports,
            personalDetails: options.personalDetails.concat(contacts),
        }, {
            betas,
            selectedOptions: participants,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            // If we are using this component in the "Submit expense" or the combined submit/track flow then we pass the includeOwnedWorkspaceChats argument so that the current user
            // sees the option to submit an expense from their admin on their own Expense Chat.
            includeOwnedWorkspaceChats: iouType === CONST_1.default.IOU.TYPE.SUBMIT || iouType === CONST_1.default.IOU.TYPE.CREATE || iouType === CONST_1.default.IOU.TYPE.SPLIT,
            // Sharing with an accountant involves inviting them to the workspace and that requires admin access.
            excludeNonAdminWorkspaces: action === CONST_1.default.IOU.ACTION.SHARE,
            // Per diem expenses should only be submitted to workspaces, not individual users
            includeP2P: !isCategorizeOrShareAction && !isPerDiemRequest,
            includeInvoiceRooms: iouType === CONST_1.default.IOU.TYPE.INVOICE,
            action,
            shouldSeparateSelfDMChat: iouType !== CONST_1.default.IOU.TYPE.INVOICE,
            shouldSeparateWorkspaceChat: true,
            includeSelfDM: !(0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action) && iouType !== CONST_1.default.IOU.TYPE.INVOICE,
            canShowManagerMcTest,
            isPerDiemRequest,
            showRBR: false,
        });
        const orderedOptions = (0, OptionsListUtils_1.orderOptions)(optionList);
        return {
            ...optionList,
            ...orderedOptions,
        };
    }, [
        action,
        contacts,
        areOptionsInitialized,
        betas,
        didScreenTransitionEnd,
        iouType,
        isCategorizeOrShareAction,
        options.personalDetails,
        options.reports,
        participants,
        isPerDiemRequest,
        canShowManagerMcTest,
    ]);
    const chatOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return {
                userToInvite: null,
                recentReports: [],
                personalDetails: [],
                currentUserOption: null,
                headerMessage: '',
                workspaceChats: [],
                selfDMChat: null,
            };
        }
        const newOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchTerm, countryCode, {
            canInviteUser: !isCategorizeOrShareAction && !isPerDiemRequest,
            selectedOptions: participants,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
            preferPolicyExpenseChat: isPaidGroupPolicy,
            preferRecentExpenseReports: action === CONST_1.default.IOU.ACTION.CREATE,
        });
        return newOptions;
    }, [areOptionsInitialized, defaultOptions, debouncedSearchTerm, participants, isPaidGroupPolicy, isCategorizeOrShareAction, action, isPerDiemRequest, countryCode]);
    const inputHelperText = (0, react_1.useMemo)(() => (0, OptionsListUtils_1.getHeaderMessage)((chatOptions.personalDetails ?? []).length + (chatOptions.recentReports ?? []).length + (chatOptions.workspaceChats ?? []).length !== 0 ||
        !(0, EmptyObject_1.isEmptyObject)(chatOptions.selfDMChat), !!chatOptions?.userToInvite, debouncedSearchTerm.trim(), participants.some((participant) => (0, OptionsListUtils_1.getPersonalDetailSearchTerms)(participant).join(' ').toLowerCase().includes(cleanSearchTerm))), [
        chatOptions.personalDetails,
        chatOptions.recentReports,
        chatOptions.selfDMChat,
        chatOptions?.userToInvite,
        chatOptions.workspaceChats,
        cleanSearchTerm,
        debouncedSearchTerm,
        participants,
    ]);
    /**
     * Returns the sections needed for the OptionsSelector
     * @returns {Array}
     */
    const [sections, header] = (0, react_1.useMemo)(() => {
        const newSections = [];
        if (!areOptionsInitialized || !didScreenTransitionEnd) {
            return [newSections, ''];
        }
        const formatResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(debouncedSearchTerm, participants.map((participant) => ({ ...participant, reportID: participant.reportID })), chatOptions.recentReports, chatOptions.personalDetails, personalDetails, true, undefined, reportAttributesDerived);
        newSections.push(formatResults.section);
        newSections.push({
            title: translate('workspace.common.workspace'),
            data: chatOptions.workspaceChats ?? [],
            shouldShow: (chatOptions.workspaceChats ?? []).length > 0,
        });
        newSections.push({
            title: translate('workspace.invoices.paymentMethods.personal'),
            data: chatOptions.selfDMChat ? [chatOptions.selfDMChat] : [],
            shouldShow: !!chatOptions.selfDMChat,
        });
        newSections.push({
            title: translate('common.recents'),
            data: isPerDiemRequest ? chatOptions.recentReports.filter((report) => report.isPolicyExpenseChat) : chatOptions.recentReports,
            shouldShow: (isPerDiemRequest ? chatOptions.recentReports.filter((report) => report.isPolicyExpenseChat) : chatOptions.recentReports).length > 0,
        });
        newSections.push({
            title: translate('common.contacts'),
            data: chatOptions.personalDetails,
            shouldShow: chatOptions.personalDetails.length > 0 && !isPerDiemRequest,
        });
        if (chatOptions.userToInvite &&
            !(0, OptionsListUtils_1.isCurrentUser)({
                ...chatOptions.userToInvite,
                accountID: chatOptions.userToInvite?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
                status: chatOptions.userToInvite?.status ?? undefined,
            }) &&
            !isPerDiemRequest) {
            newSections.push({
                title: undefined,
                data: [chatOptions.userToInvite].map((participant) => {
                    const isPolicyExpenseChat = participant?.isPolicyExpenseChat ?? false;
                    return isPolicyExpenseChat ? (0, OptionsListUtils_1.getPolicyExpenseReportOption)(participant, reportAttributesDerived) : (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails);
                }),
                shouldShow: true,
            });
        }
        let headerMessage = '';
        if (!showImportContacts) {
            headerMessage = inputHelperText;
        }
        return [newSections, headerMessage];
    }, [
        areOptionsInitialized,
        didScreenTransitionEnd,
        debouncedSearchTerm,
        participants,
        chatOptions.recentReports,
        chatOptions.personalDetails,
        chatOptions.workspaceChats,
        chatOptions.selfDMChat,
        chatOptions.userToInvite,
        personalDetails,
        translate,
        isPerDiemRequest,
        showImportContacts,
        reportAttributesDerived,
        inputHelperText,
    ]);
    /**
     * Adds a single participant to the expense
     *
     * @param {Object} option
     */
    const addSingleParticipant = (0, react_1.useCallback)((option) => {
        const newParticipants = [
            {
                ...(0, pick_1.default)(option, 'accountID', 'login', 'isPolicyExpenseChat', 'reportID', 'searchText', 'policyID', 'isSelfDM', 'text', 'phoneNumber', 'displayName'),
                selected: true,
                iouType,
            },
        ];
        if (iouType === CONST_1.default.IOU.TYPE.INVOICE) {
            const policyID = option.item && (0, ReportUtils_1.isInvoiceRoom)(option.item) ? option.policyID : (0, Policy_1.getInvoicePrimaryWorkspace)(currentUserLogin)?.id;
            newParticipants.push({
                policyID,
                isSender: true,
                selected: false,
                iouType,
            });
        }
        onParticipantsAdded(newParticipants);
        if (!option.isSelfDM) {
            onFinish();
        }
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want to trigger this callback when iouType changes
    [onFinish, onParticipantsAdded, currentUserLogin]);
    /**
     * Removes a selected option from list if already selected. If not already selected add this option to the list.
     * @param {Object} option
     */
    const addParticipantToSelection = (0, react_1.useCallback)((option) => {
        const isOptionSelected = (selectedOption) => {
            if (selectedOption.accountID && selectedOption.accountID === option?.accountID) {
                return true;
            }
            if (selectedOption.reportID && selectedOption.reportID === option?.reportID) {
                return true;
            }
            return false;
        };
        const isOptionInList = participants.some(isOptionSelected);
        let newSelectedOptions;
        if (isOptionInList) {
            newSelectedOptions = (0, reject_1.default)(participants, isOptionSelected);
        }
        else {
            newSelectedOptions = [
                ...participants,
                {
                    accountID: option.accountID,
                    login: option.login,
                    isPolicyExpenseChat: option.isPolicyExpenseChat,
                    reportID: option.reportID,
                    selected: true,
                    searchText: option.searchText,
                    iouType,
                },
            ];
        }
        onParticipantsAdded(newSelectedOptions);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want to trigger this callback when iouType changes
    [participants, onParticipantsAdded]);
    // Right now you can't split a request with a workspace and other additional participants
    // This is getting properly fixed in https://github.com/Expensify/App/issues/27508, but as a stop-gap to prevent
    // the app from crashing on native when you try to do this, we'll going to hide the button if you have a workspace and other participants
    const hasPolicyExpenseChatParticipant = participants.some((participant) => participant.isPolicyExpenseChat);
    const shouldShowSplitBillErrorMessage = participants.length > 1 && hasPolicyExpenseChatParticipant;
    const isAllowedToSplit = ![CONST_1.default.IOU.TYPE.PAY, CONST_1.default.IOU.TYPE.TRACK, CONST_1.default.IOU.TYPE.INVOICE].some((option) => option === iouType) &&
        ![CONST_1.default.IOU.ACTION.SHARE, CONST_1.default.IOU.ACTION.SUBMIT, CONST_1.default.IOU.ACTION.CATEGORIZE].some((option) => option === action);
    const handleConfirmSelection = (0, react_1.useCallback)((keyEvent, option) => {
        const shouldAddSingleParticipant = option && !participants.length;
        if (shouldShowSplitBillErrorMessage || (!participants.length && !option)) {
            return;
        }
        if (shouldAddSingleParticipant) {
            addSingleParticipant(option);
            return;
        }
        onFinish(CONST_1.default.IOU.TYPE.SPLIT);
    }, [shouldShowSplitBillErrorMessage, onFinish, addSingleParticipant, participants]);
    const showLoadingPlaceholder = (0, react_1.useMemo)(() => !areOptionsInitialized || !didScreenTransitionEnd, [areOptionsInitialized, didScreenTransitionEnd]);
    const optionLength = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return 0;
        }
        let length = 0;
        sections.forEach((section) => {
            length += section.data.length;
        });
        return length;
    }, [areOptionsInitialized, sections]);
    const shouldShowListEmptyContent = (0, react_1.useMemo)(() => optionLength === 0 && !showLoadingPlaceholder, [optionLength, showLoadingPlaceholder]);
    const shouldShowReferralBanner = !isDismissed && iouType !== CONST_1.default.IOU.TYPE.INVOICE && !shouldShowListEmptyContent;
    const initiateContactImportAndSetState = (0, react_1.useCallback)(() => {
        setContactPermissionState(react_native_permissions_1.RESULTS.GRANTED);
        react_native_1.InteractionManager.runAfterInteractions(importAndSaveContacts);
    }, [importAndSaveContacts, setContactPermissionState]);
    const footerContent = (0, react_1.useMemo)(() => {
        if (isDismissed && !shouldShowSplitBillErrorMessage && !participants.length) {
            return;
        }
        return (<>
                {shouldShowReferralBanner && !isCategorizeOrShareAction && (<ReferralProgramCTA_1.default referralContentType={referralContentType} style={[styles.flexShrink0, !!participants.length && !shouldShowSplitBillErrorMessage && styles.mb5]}/>)}

                {shouldShowSplitBillErrorMessage && (<FormHelpMessage_1.default style={[styles.ph1, styles.mb2]} isError message={translate('iou.error.splitExpenseMultipleParticipantsErrorMessage')}/>)}

                {!!participants.length && !isCategorizeOrShareAction && (<Button_1.default success text={translate('common.next')} onPress={handleConfirmSelection} pressOnEnter large isDisabled={shouldShowSplitBillErrorMessage}/>)}
                {isCategorizeOrShareAction && (<Button_1.default success text={translate('workspace.new.newWorkspace')} onPress={() => onFinish()} pressOnEnter large/>)}
            </>);
    }, [
        handleConfirmSelection,
        participants.length,
        isDismissed,
        referralContentType,
        shouldShowSplitBillErrorMessage,
        styles,
        translate,
        shouldShowReferralBanner,
        isCategorizeOrShareAction,
        onFinish,
    ]);
    const onSelectRow = (0, react_1.useCallback)((option) => {
        if (option.isPolicyExpenseChat && option.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(option.policyID)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(option.policyID));
            return;
        }
        if (isIOUSplit) {
            addParticipantToSelection(option);
            return;
        }
        addSingleParticipant(option);
    }, [isIOUSplit, addParticipantToSelection, addSingleParticipant]);
    const footerContentAbovePaginationComponent = (0, react_1.useMemo)(() => {
        if (!showImportContacts) {
            return null;
        }
        return (<MenuItem_1.default title={translate('contact.importContacts')} icon={Expensicons_1.UserPlus} onPress={goToSettings_1.default} shouldShowRightIcon style={styles.mb3}/>);
    }, [showImportContacts, styles.mb3, translate]);
    const ClickableImportContactTextComponent = (0, react_1.useMemo)(() => {
        if (debouncedSearchTerm.length || isSearchingForReports) {
            return;
        }
        return (<ImportContactButton_1.default showImportContacts={showImportContacts} inputHelperText={translate('contact.importContactsTitle')} isInSearch={false}/>);
    }, [debouncedSearchTerm, isSearchingForReports, showImportContacts, translate]);
    const EmptySelectionListContentWithPermission = (0, react_1.useMemo)(() => {
        return (<>
                {ClickableImportContactTextComponent}
                <EmptySelectionListContent_1.default contentType={iouType}/>
            </>);
    }, [iouType, ClickableImportContactTextComponent]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        focus: () => {
            if (!textInputAutoFocus) {
                return;
            }
            selectionListRef.current?.focusTextInput?.();
        },
    }));
    return (<>
            <ContactPermissionModal_1.default onGrant={initiateContactImportAndSetState} onDeny={setContactPermissionState} onFocusTextInput={() => {
            setTextInputAutoFocus(true);
            selectionListRef.current?.focusTextInput?.();
        }}/>
            <SelectionList_1.default onConfirm={handleConfirmSelection} sections={areOptionsInitialized ? sections : CONST_1.default.EMPTY_ARRAY} ListItem={InviteMemberListItem_1.default} textInputValue={searchTerm} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputHint={offlineMessage} onChangeText={setSearchTerm} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onSelectRow={onSelectRow} shouldSingleExecuteRowSelect canShowProductTrainingTooltip={canShowManagerMcTest} headerContent={<ImportContactButton_1.default showImportContacts={showImportContacts} inputHelperText={inputHelperText} isInSearch/>} footerContent={footerContent} listEmptyContent={EmptySelectionListContentWithPermission} footerContentAbovePagination={footerContentAbovePaginationComponent} headerMessage={header} showLoadingPlaceholder={showLoadingPlaceholder} canSelectMultiple={isIOUSplit && isAllowedToSplit} isLoadingNewOptions={!!isSearchingForReports} shouldShowListEmptyContent={shouldShowListEmptyContent} textInputAutoFocus={!isNative} ref={selectionListRef}/>
        </>);
}
MoneyRequestParticipantsSelector.displayName = 'MoneyTemporaryForRefactorRequestParticipantsSelector';
exports.default = (0, react_1.memo)((0, react_1.forwardRef)(MoneyRequestParticipantsSelector), (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.participants, nextProps.participants) && prevProps.iouType === nextProps.iouType);
