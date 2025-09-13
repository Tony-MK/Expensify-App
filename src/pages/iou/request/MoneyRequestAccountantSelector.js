"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick_1 = require("lodash/pick");
const react_1 = require("react");
const EmptySelectionListContent_1 = require("@components/EmptySelectionListContent");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useScreenWrapperTransitionStatus_1 = require("@hooks/useScreenWrapperTransitionStatus");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const memoize_1 = require("@libs/memoize");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const memoizedGetValidOptions = (0, memoize_1.default)(OptionsListUtils_1.getValidOptions, { maxSize: 5, monitoringName: 'MoneyRequestAccountantSelector.getValidOptions' });
function MoneyRequestAccountantSelector({ onFinish, onAccountantSelected, iouType, action }) {
    const { translate } = (0, useLocalize_1.default)();
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const { isOffline } = (0, useNetwork_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const { didScreenTransitionEnd } = (0, useScreenWrapperTransitionStatus_1.default)();
    const [countryCode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: false });
    const [betas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: false });
    const [isSearchingForReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_SEARCHING_FOR_REPORTS, { initWithStoredValues: false, canBeMissing: true });
    const { options, areOptionsInitialized } = (0, OptionListContextProvider_1.useOptionsList)({
        shouldInitialize: didScreenTransitionEnd,
    });
    const offlineMessage = isOffline ? `${translate('common.youAppearToBeOffline')} ${translate('search.resultsAreLimited')}` : '';
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    (0, react_1.useEffect)(() => {
        (0, Report_1.searchInServer)(debouncedSearchTerm.trim());
    }, [debouncedSearchTerm]);
    const defaultOptions = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized || !didScreenTransitionEnd) {
            (0, OptionsListUtils_1.getEmptyOptions)();
        }
        const optionList = memoizedGetValidOptions({
            reports: options.reports,
            personalDetails: options.personalDetails,
        }, {
            betas,
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            action,
        });
        const orderedOptions = (0, OptionsListUtils_1.orderOptions)(optionList);
        return {
            ...optionList,
            ...orderedOptions,
        };
    }, [action, areOptionsInitialized, betas, didScreenTransitionEnd, options.personalDetails, options.reports]);
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
        const newOptions = (0, OptionsListUtils_1.filterAndOrderOptions)(defaultOptions, debouncedSearchTerm, countryCode, {
            excludeLogins: CONST_1.default.EXPENSIFY_EMAILS_OBJECT,
            maxRecentReportsToShow: CONST_1.default.IOU.MAX_RECENT_REPORTS_TO_SHOW,
        });
        return newOptions;
    }, [areOptionsInitialized, defaultOptions, debouncedSearchTerm, countryCode]);
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
        const formatResults = (0, OptionsListUtils_1.formatSectionsFromSearchTerm)(debouncedSearchTerm, [], chatOptions.recentReports, chatOptions.personalDetails, personalDetails, true, undefined, reportAttributesDerived);
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
        const headerMessage = (0, OptionsListUtils_1.getHeaderMessage)((chatOptions.personalDetails ?? []).length + (chatOptions.recentReports ?? []).length !== 0, !!chatOptions?.userToInvite, debouncedSearchTerm.trim());
        return [newSections, headerMessage];
    }, [
        areOptionsInitialized,
        didScreenTransitionEnd,
        chatOptions.recentReports,
        chatOptions.personalDetails,
        chatOptions.userToInvite,
        debouncedSearchTerm,
        personalDetails,
        translate,
        reportAttributesDerived,
    ]);
    const selectAccountant = (0, react_1.useCallback)((option) => {
        onAccountantSelected((0, pick_1.default)(option, 'accountID', 'login'));
        onFinish();
    }, [onAccountantSelected, onFinish]);
    const handleConfirmSelection = (0, react_1.useCallback)((keyEvent, option) => {
        if (!option) {
            return;
        }
        selectAccountant(option);
    }, [selectAccountant]);
    const showLoadingPlaceholder = (0, react_1.useMemo)(() => !areOptionsInitialized || !didScreenTransitionEnd, [areOptionsInitialized, didScreenTransitionEnd]);
    const optionLength = (0, react_1.useMemo)(() => {
        if (!areOptionsInitialized) {
            return 0;
        }
        return sections.reduce((acc, section) => acc + section.data.length, 0);
    }, [areOptionsInitialized, sections]);
    const shouldShowListEmptyContent = (0, react_1.useMemo)(() => optionLength === 0 && !showLoadingPlaceholder, [optionLength, showLoadingPlaceholder]);
    return (<SelectionList_1.default onConfirm={handleConfirmSelection} sections={areOptionsInitialized ? sections : CONST_1.default.EMPTY_ARRAY} ListItem={InviteMemberListItem_1.default} textInputValue={searchTerm} textInputLabel={translate('selectionList.nameEmailOrPhoneNumber')} textInputHint={offlineMessage} onChangeText={setSearchTerm} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onSelectRow={selectAccountant} shouldSingleExecuteRowSelect listEmptyContent={<EmptySelectionListContent_1.default contentType={iouType}/>} headerMessage={header} showLoadingPlaceholder={showLoadingPlaceholder} isLoadingNewOptions={!!isSearchingForReports} shouldShowListEmptyContent={shouldShowListEmptyContent}/>);
}
MoneyRequestAccountantSelector.displayName = 'MoneyRequestAccountantSelector';
exports.default = (0, react_1.memo)(MoneyRequestAccountantSelector, (prevProps, nextProps) => prevProps.iouType === nextProps.iouType);
