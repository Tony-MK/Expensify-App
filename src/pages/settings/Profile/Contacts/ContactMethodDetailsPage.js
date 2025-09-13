"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const ErrorMessageRow_1 = require("@components/ErrorMessageRow");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MenuItem_1 = require("@components/MenuItem");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const ValidateCodeActionForm_1 = require("@components/ValidateCodeActionForm");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const User_1 = require("@libs/actions/User");
const Browser_1 = require("@libs/Browser");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const Modal_1 = require("@userActions/Modal");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const keyboard_1 = require("@src/utils/keyboard");
function ContactMethodDetailsPage({ route }) {
    const [loginList, loginListResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [session, sessionResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [myDomainSecurityGroups, myDomainSecurityGroupsResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MY_DOMAIN_SECURITY_GROUPS, { canBeMissing: true });
    const [securityGroups, securityGroupsResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.SECURITY_GROUP, { canBeMissing: true });
    const [isLoadingReportData = true, isLoadingReportDataResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_REPORT_DATA, { canBeMissing: true });
    const [isValidateCodeFormVisible, setIsValidateCodeFormVisible] = (0, react_1.useState)(true);
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const isLoadingOnyxValues = (0, isLoadingOnyxValue_1.default)(loginListResult, sessionResult, myDomainSecurityGroupsResult, securityGroupsResult, isLoadingReportDataResult);
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const { formatPhoneNumber, translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = (0, react_1.useState)(false);
    const validateCodeFormRef = (0, react_1.useRef)(null);
    const backTo = route.params.backTo;
    /**
     * Gets the current contact method from the route params
     */
    const contactMethod = (0, react_1.useMemo)(() => {
        const contactMethodParam = route.params.contactMethod;
        // We find the number of times the url is encoded based on the last % sign and remove them.
        const lastPercentIndex = contactMethodParam.lastIndexOf('%');
        const encodePercents = contactMethodParam.substring(lastPercentIndex).match(new RegExp('25', 'g'));
        let numberEncodePercents = encodePercents?.length ?? 0;
        const beforeAtSign = contactMethodParam.substring(0, lastPercentIndex).replace(CONST_1.default.REGEX.ENCODE_PERCENT_CHARACTER, (match) => {
            if (numberEncodePercents > 0) {
                numberEncodePercents--;
                return '%';
            }
            return match;
        });
        const afterAtSign = contactMethodParam.substring(lastPercentIndex).replace(CONST_1.default.REGEX.ENCODE_PERCENT_CHARACTER, '%');
        return (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(decodeURIComponent(beforeAtSign + afterAtSign));
    }, [route.params.contactMethod]);
    const loginData = (0, react_1.useMemo)(() => loginList?.[contactMethod], [loginList, contactMethod]);
    const isDefaultContactMethod = (0, react_1.useMemo)(() => session?.email === loginData?.partnerUserID, [session?.email, loginData?.partnerUserID]);
    const validateLoginError = (0, ErrorUtils_1.getEarliestErrorField)(loginData, 'validateLogin');
    const prevPendingDeletedLogin = (0, usePrevious_1.default)(loginData?.pendingFields?.deletedLogin);
    /**
     * Attempt to set this contact method as user's "Default contact method"
     */
    const setAsDefault = (0, react_1.useCallback)(() => {
        (0, User_1.setContactMethodAsDefault)(contactMethod, formatPhoneNumber, backTo);
    }, [contactMethod, backTo, formatPhoneNumber]);
    /**
     * Checks if the user is allowed to change their default contact method. This should only be allowed if:
     * 1. The viewed contact method is not already their default contact method
     * 2. The viewed contact method is validated
     * 3. If the user is on a private domain, their security group must allow primary login switching
     */
    const canChangeDefaultContactMethod = (0, react_1.useMemo)(() => {
        // Cannot set this contact method as default if:
        // 1. This contact method is already their default
        // 2. This contact method is not validated
        if (isDefaultContactMethod || !loginData?.validatedDate) {
            return false;
        }
        const domainName = expensify_common_1.Str.extractEmailDomain(session?.email ?? '');
        const primaryDomainSecurityGroupID = myDomainSecurityGroups?.[domainName];
        // If there's no security group associated with the user for the primary domain,
        // default to allowing the user to change their default contact method.
        if (!primaryDomainSecurityGroupID) {
            return true;
        }
        // Allow user to change their default contact method if they don't have a security group OR if their security group
        // does NOT restrict primary login switching.
        return !securityGroups?.[`${ONYXKEYS_1.default.COLLECTION.SECURITY_GROUP}${primaryDomainSecurityGroupID}`]?.enableRestrictedPrimaryLogin;
    }, [isDefaultContactMethod, loginData?.validatedDate, session?.email, myDomainSecurityGroups, securityGroups]);
    /**
     * Toggle delete confirm modal visibility
     */
    const toggleDeleteModal = (0, react_1.useCallback)((isOpen) => {
        if ((0, DeviceCapabilities_1.canUseTouchScreen)() && isOpen) {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                setIsDeleteModalOpen(isOpen);
            });
            react_native_1.Keyboard.dismiss();
        }
        else {
            setIsDeleteModalOpen(isOpen);
        }
    }, []);
    /**
     * Delete the contact method and hide the modal
     */
    const confirmDeleteAndHideModal = (0, react_1.useCallback)(() => {
        toggleDeleteModal(false);
        (0, User_1.deleteContactMethod)(contactMethod, loginList ?? {}, backTo);
    }, [contactMethod, loginList, toggleDeleteModal, backTo]);
    const prevValidatedDate = (0, usePrevious_1.default)(loginData?.validatedDate);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (prevValidatedDate || !loginData?.validatedDate || !loginData) {
            return;
        }
        // Navigate to methods page on successful magic code verification
        // validatedDate property is responsible to decide the status of the magic code verification
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo));
    }, [prevValidatedDate, loginData?.validatedDate, isDefaultContactMethod, backTo, loginData]);
    (0, react_1.useEffect)(() => {
        setIsValidateCodeFormVisible(!loginData?.validatedDate);
    }, [loginData?.validatedDate, loginData?.errorFields?.addedLogin]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (!loginData?.partnerUserID || loginData?.validatedDate || prevPendingDeletedLogin) {
            return;
        }
        (0, User_1.resetContactMethodValidateCodeSentState)(contactMethod);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- The prevPendingDeletedLogin is a ref, so no need to add it to dependencies.
    }, [contactMethod, loginData?.partnerUserID, loginData?.validatedDate]);
    const getThreeDotsMenuItems = (0, react_1.useCallback)(() => {
        const menuItems = [];
        if (isValidateCodeFormVisible && !isDefaultContactMethod) {
            menuItems.push({
                icon: Expensicons_1.Trashcan,
                text: translate('common.remove'),
                onSelected: () => (0, Modal_1.close)(() => toggleDeleteModal(true)),
            });
        }
        return menuItems;
    }, [isValidateCodeFormVisible, translate, toggleDeleteModal, isDefaultContactMethod]);
    if (isLoadingOnyxValues || (isLoadingReportData && (0, EmptyObject_1.isEmptyObject)(loginList))) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    if (!contactMethod || !loginData) {
        return (<ScreenWrapper_1.default testID={ContactMethodDetailsPage.displayName}>
                <FullPageNotFoundView_1.default shouldShow linkTranslationKey="contacts.goBackContactMethods" onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo))} onLinkPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo))}/>
            </ScreenWrapper_1.default>);
    }
    // Replacing spaces with "hard spaces" to prevent breaking the number
    const formattedContactMethod = expensify_common_1.Str.isSMSLogin(contactMethod) ? formatPhoneNumber(contactMethod) : contactMethod;
    const hasMagicCodeBeenSent = !!loginData.validateCodeSent;
    const isFailedAddContactMethod = !!loginData.errorFields?.addedLogin;
    const isFailedRemovedContactMethod = !!loginData.errorFields?.deletedLogin;
    const shouldSkipInitialValidation = route.params?.shouldSkipInitialValidation === 'true';
    const getDeleteConfirmationModal = () => (<ConfirmModal_1.default title={translate('contacts.removeContactMethod')} onConfirm={confirmDeleteAndHideModal} onCancel={() => toggleDeleteModal(false)} onModalHide={() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                validateCodeFormRef.current?.focusLastSelected?.();
            });
        }} prompt={translate('contacts.removeAreYouSure')} confirmText={translate('common.yesContinue')} cancelText={translate('common.cancel')} isVisible={isDeleteModalOpen && !isDefaultContactMethod} danger/>);
    const getMenuItems = () => (<>
            {canChangeDefaultContactMethod ? (<OfflineWithFeedback_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(loginData, 'defaultLogin')} errorRowStyles={[themeStyles.ml8, themeStyles.mr5]} onClose={() => (0, User_1.clearContactMethodErrors)(contactMethod, 'defaultLogin')}>
                    <MenuItem_1.default title={translate('contacts.setAsDefault')} icon={Expensicons_1.Star} onPress={isAccountLocked ? showLockedAccountModal : setAsDefault}/>
                </OfflineWithFeedback_1.default>) : null}
            {isDefaultContactMethod ? (<OfflineWithFeedback_1.default pendingAction={loginData.pendingFields?.defaultLogin} errors={(0, ErrorUtils_1.getLatestErrorField)(loginData, isFailedRemovedContactMethod ? 'deletedLogin' : 'defaultLogin')} errorRowStyles={[themeStyles.ml8, themeStyles.mr5]} onClose={() => (0, User_1.clearContactMethodErrors)(contactMethod, isFailedRemovedContactMethod ? 'deletedLogin' : 'defaultLogin')}>
                    <Text_1.default style={[themeStyles.ph5, themeStyles.mv3]}>{translate('contacts.yourDefaultContactMethod')}</Text_1.default>
                </OfflineWithFeedback_1.default>) : (<OfflineWithFeedback_1.default pendingAction={loginData.pendingFields?.deletedLogin} errors={(0, ErrorUtils_1.getLatestErrorField)(loginData, 'deletedLogin')} errorRowStyles={[themeStyles.mt6, themeStyles.ph5]} onClose={() => (0, User_1.clearContactMethodErrors)(contactMethod, 'deletedLogin')}>
                    <MenuItem_1.default title={translate('common.remove')} icon={Expensicons_1.Trashcan} iconFill={theme.danger} onPress={() => {
                if (isActingAsDelegate) {
                    showDelegateNoAccessModal();
                    return;
                }
                toggleDeleteModal(true);
            }}/>
                </OfflineWithFeedback_1.default>)}
        </>);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight onEntryTransitionEnd={() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                validateCodeFormRef.current?.focus?.();
            });
        }} testID={ContactMethodDetailsPage.displayName} focusTrapSettings={{
            focusTrapOptions: (0, Browser_1.isMobileSafari)()
                ? undefined
                : {
                    // We need to check this because focusing the input form interferes with the transition animation:
                    // https://github.com/Expensify/App/issues/53884#issuecomment-2594568960
                    checkCanFocusTrap: (trapContainers) => {
                        return new Promise((resolve) => {
                            const interval = setInterval(() => {
                                const trapContainer = trapContainers.at(0);
                                if (!trapContainer || getComputedStyle(trapContainer).visibility !== 'hidden') {
                                    resolve();
                                    clearInterval(interval);
                                }
                            }, 5);
                        });
                    },
                },
        }}>
            <HeaderWithBackButton_1.default title={formattedContactMethod} threeDotsMenuItems={getThreeDotsMenuItems()} shouldShowThreeDotsButton={getThreeDotsMenuItems().length > 0} shouldOverlayDots onThreeDotsButtonPress={() => {
            // Hide the keyboard when the user clicks the three-dot menu.
            // Use blurActiveElement() for mWeb and KeyboardUtils.dismiss() for native apps.
            (0, blurActiveElement_1.default)();
            keyboard_1.default.dismiss();
        }}/>
            <ScrollView_1.default keyboardShouldPersistTaps="handled" contentContainerStyle={themeStyles.flexGrow1} style={[themeStyles.w100, themeStyles.h100, themeStyles.flex1]}>
                {isFailedAddContactMethod && (<ErrorMessageRow_1.default errors={(0, ErrorUtils_1.getLatestErrorField)(loginData, 'addedLogin')} errorRowStyles={[themeStyles.mh5, themeStyles.mv3]} onClose={() => {
                (0, User_1.clearContactMethod)(contactMethod);
                (0, User_1.clearUnvalidatedNewContactMethodAction)();
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo));
            }} canDismissError/>)}
                {isValidateCodeFormVisible && !!loginData && !loginData.validatedDate && (<ValidateCodeActionForm_1.default hasMagicCodeBeenSent={hasMagicCodeBeenSent} handleSubmitForm={(validateCode) => (0, User_1.validateSecondaryLogin)(loginList, contactMethod, validateCode, formatPhoneNumber)} validateError={!(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? validateLoginError : (0, ErrorUtils_1.getLatestErrorField)(loginData, 'validateCodeSent')} clearError={() => {
                // When removing unverified contact methods, the ValidateCodeActionForm unmounts and triggers clearError.
                // This causes loginData to become an object, which makes sendValidateCode trigger, so we add this check to prevent clearing the error.
                if (!loginData.partnerUserID) {
                    return;
                }
                (0, User_1.clearContactMethodErrors)(contactMethod, !(0, EmptyObject_1.isEmptyObject)(validateLoginError) ? 'validateLogin' : 'validateCodeSent');
            }} sendValidateCode={() => {
                if (!loginData.partnerUserID) {
                    return;
                }
                (0, User_1.requestContactMethodValidateCode)(contactMethod);
            }} descriptionPrimary={translate('contacts.enterMagicCode', { contactMethod: formattedContactMethod })} forwardedRef={validateCodeFormRef} shouldSkipInitialValidation={shouldSkipInitialValidation}/>)}

                {!isValidateCodeFormVisible && !!loginData.validatedDate && getMenuItems()}
                {getDeleteConfirmationModal()}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
ContactMethodDetailsPage.displayName = 'ContactMethodDetailsPage';
exports.default = ContactMethodDetailsPage;
