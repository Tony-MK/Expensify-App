"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddPaymentMethodMenu_1 = require("@components/AddPaymentMethodMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const KYCWall_1 = require("@components/KYCWall");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const LottieAnimations_1 = require("@components/LottieAnimations");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Popover_1 = require("@components/Popover");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaymentMethodState_1 = require("@hooks/usePaymentMethodState");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const getClickedTargetLocation_1 = require("@libs/getClickedTargetLocation");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const PaymentMethodList_1 = require("@pages/settings/Wallet/PaymentMethodList");
const variables_1 = require("@styles/variables");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Modal_1 = require("@userActions/Modal");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function WalletPage({ shouldListenForResize = false }) {
    const [bankAccountList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [cardList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [fundList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, {
        canBeMissing: true,
        selector: (allFunds) => Object.fromEntries(Object.entries(allFunds ?? {}).filter(([, item]) => item.accountData?.additionalData?.isP2PDebitCard === true)),
    });
    const [isLoadingPaymentMethods = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_PAYMENT_METHODS, { canBeMissing: true });
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [walletTerms = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS, { canBeMissing: true });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: false });
    const [userAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [lastUsedPaymentMethods] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const isUserValidated = userAccount?.validated ?? false;
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const network = (0, useNetwork_1.default)();
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { paymentMethod, setPaymentMethod, resetSelectedPaymentMethodData } = (0, usePaymentMethodState_1.default)();
    const [shouldShowAddPaymentMenu, setShouldShowAddPaymentMenu] = (0, react_1.useState)(false);
    const [shouldShowDefaultDeleteMenu, setShouldShowDefaultDeleteMenu] = (0, react_1.useState)(false);
    const [shouldShowCardMenu, setShouldShowCardMenu] = (0, react_1.useState)(false);
    const [shouldShowLoadingSpinner, setShouldShowLoadingSpinner] = (0, react_1.useState)(false);
    const addPaymentMethodAnchorRef = (0, react_1.useRef)(null);
    const paymentMethodButtonRef = (0, react_1.useRef)(null);
    const [anchorPosition, setAnchorPosition] = (0, react_1.useState)({
        anchorPositionHorizontal: 0,
        anchorPositionVertical: 0,
        anchorPositionTop: 0,
        anchorPositionRight: 0,
    });
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = (0, react_1.useState)(false);
    const hasWallet = !(0, isEmpty_1.default)(userWallet);
    const hasActivatedWallet = [CONST_1.default.WALLET.TIER_NAME.GOLD, CONST_1.default.WALLET.TIER_NAME.PLATINUM].includes(userWallet?.tierName ?? '');
    const hasAssignedCard = !(0, isEmpty_1.default)(cardList);
    const isPendingOnfidoResult = userWallet?.isPendingOnfidoResult ?? false;
    const hasFailedOnfido = userWallet?.hasFailedOnfido ?? false;
    const updateShouldShowLoadingSpinner = (0, react_1.useCallback)(() => {
        // In order to prevent a loop, only update state of the spinner if there is a change
        const showLoadingSpinner = isLoadingPaymentMethods ?? false;
        if (showLoadingSpinner !== shouldShowLoadingSpinner) {
            setShouldShowLoadingSpinner(showLoadingSpinner && !network.isOffline);
        }
    }, [isLoadingPaymentMethods, network.isOffline, shouldShowLoadingSpinner]);
    const debounceSetShouldShowLoadingSpinner = (0, debounce_1.default)(updateShouldShowLoadingSpinner, CONST_1.default.TIMING.SHOW_LOADING_SPINNER_DEBOUNCE_TIME);
    /**
     * Set position of the payment menu
     */
    const setMenuPosition = (0, react_1.useCallback)(() => {
        if (!paymentMethodButtonRef.current) {
            return;
        }
        const position = (0, getClickedTargetLocation_1.default)(paymentMethodButtonRef.current);
        setAnchorPosition({
            anchorPositionTop: position.top + position.height - variables_1.default.bankAccountActionPopoverTopSpacing,
            // We want the position to be 23px to the right of the left border
            anchorPositionRight: windowWidth - position.right + variables_1.default.bankAccountActionPopoverRightSpacing,
            anchorPositionHorizontal: position.x + variables_1.default.addBankAccountLeftSpacing,
            anchorPositionVertical: position.y,
        });
    }, [windowWidth]);
    const getSelectedPaymentMethodID = (0, react_1.useCallback)(() => {
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
            return paymentMethod.selectedPaymentMethod.bankAccountID;
        }
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
            return paymentMethod.selectedPaymentMethod.fundID;
        }
    }, [paymentMethod.selectedPaymentMethod.bankAccountID, paymentMethod.selectedPaymentMethod.fundID, paymentMethod.selectedPaymentMethodType]);
    /**
     * Display the delete/default menu, or the add payment method menu
     */
    const paymentMethodPressed = (nativeEvent, accountType, account, icon, isDefault, methodID, description) => {
        if (shouldShowAddPaymentMenu) {
            setShouldShowAddPaymentMenu(false);
            return;
        }
        if (shouldShowDefaultDeleteMenu) {
            setShouldShowDefaultDeleteMenu(false);
            return;
        }
        paymentMethodButtonRef.current = nativeEvent?.currentTarget;
        // The delete/default menu
        if (accountType) {
            let formattedSelectedPaymentMethod = {
                title: '',
            };
            if (accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
                formattedSelectedPaymentMethod = {
                    title: account?.addressName ?? '',
                    icon,
                    description: description ?? (0, PaymentUtils_1.getPaymentMethodDescription)(accountType, account),
                    type: CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT,
                };
            }
            else if (accountType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
                formattedSelectedPaymentMethod = {
                    title: account?.addressName ?? '',
                    icon,
                    description: description ?? (0, PaymentUtils_1.getPaymentMethodDescription)(accountType, account),
                    type: CONST_1.default.PAYMENT_METHODS.DEBIT_CARD,
                };
            }
            setPaymentMethod({
                isSelectedPaymentMethodDefault: !!isDefault,
                selectedPaymentMethod: account ?? {},
                selectedPaymentMethodType: accountType,
                formattedSelectedPaymentMethod,
                methodID: methodID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            });
            setShouldShowDefaultDeleteMenu(true);
            setMenuPosition();
            return;
        }
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        if (isAccountLocked) {
            showLockedAccountModal();
            return;
        }
        setShouldShowAddPaymentMenu(true);
        setMenuPosition();
    };
    const assignedCardPressed = (nativeEvent, cardData, icon, cardID) => {
        if (shouldShowAddPaymentMenu) {
            setShouldShowAddPaymentMenu(false);
            return;
        }
        if (shouldShowDefaultDeleteMenu) {
            setShouldShowDefaultDeleteMenu(false);
            return;
        }
        if (shouldShowCardMenu) {
            setShouldShowCardMenu(false);
            return;
        }
        paymentMethodButtonRef.current = nativeEvent?.currentTarget;
        setPaymentMethod({
            isSelectedPaymentMethodDefault: false,
            selectedPaymentMethod: {},
            formattedSelectedPaymentMethod: {
                title: (0, CardUtils_1.maskCardNumber)(cardData?.cardName, cardData?.bank),
                description: cardData ? (0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(cardData.domainName) : '',
                icon,
            },
            selectedPaymentMethodType: '',
            methodID: cardID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        });
        setShouldShowCardMenu(true);
        setMenuPosition();
    };
    /**
     * Hide the add payment modal
     */
    const hideAddPaymentMenu = () => {
        setShouldShowAddPaymentMenu(false);
    };
    /**
     * Navigate to the appropriate payment type addition screen
     */
    const addPaymentMethodTypePressed = (paymentType) => {
        hideAddPaymentMenu();
        if (paymentType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADD_DEBIT_CARD);
            return;
        }
        if (paymentType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT || paymentType === CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT) {
            (0, BankAccounts_1.openPersonalBankAccountSetupView)({});
            return;
        }
        throw new Error('Invalid payment method type selected');
    };
    /**
     * Hide the default / delete modal
     */
    const hideDefaultDeleteMenu = (0, react_1.useCallback)(() => {
        setShouldShowDefaultDeleteMenu(false);
        setShowConfirmDeleteModal(false);
    }, [setShouldShowDefaultDeleteMenu, setShowConfirmDeleteModal]);
    const hideCardMenu = (0, react_1.useCallback)(() => {
        setShouldShowCardMenu(false);
    }, [setShouldShowCardMenu]);
    const makeDefaultPaymentMethod = (0, react_1.useCallback)(() => {
        const paymentCardList = fundList ?? {};
        // Find the previous default payment method so we can revert if the MakeDefaultPaymentMethod command errors
        const paymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList ?? {}, paymentCardList, styles);
        const previousPaymentMethod = paymentMethods.find((method) => !!method.isDefault);
        const currentPaymentMethod = paymentMethods.find((method) => method.methodID === paymentMethod.methodID);
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
            (0, PaymentMethods_1.makeDefaultPaymentMethod)(paymentMethod.selectedPaymentMethod.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, 0, previousPaymentMethod, currentPaymentMethod);
        }
        else if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
            (0, PaymentMethods_1.makeDefaultPaymentMethod)(0, paymentMethod.selectedPaymentMethod.fundID ?? CONST_1.default.DEFAULT_NUMBER_ID, previousPaymentMethod, currentPaymentMethod);
        }
    }, [
        paymentMethod.methodID,
        paymentMethod.selectedPaymentMethod.bankAccountID,
        paymentMethod.selectedPaymentMethod.fundID,
        paymentMethod.selectedPaymentMethodType,
        bankAccountList,
        fundList,
        styles,
    ]);
    const deletePaymentMethod = (0, react_1.useCallback)(() => {
        const bankAccountID = paymentMethod.selectedPaymentMethod.bankAccountID;
        const fundID = paymentMethod.selectedPaymentMethod.fundID;
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT && bankAccountID) {
            const bankAccount = bankAccountList?.[paymentMethod.methodID] ?? {};
            (0, BankAccounts_1.deletePaymentBankAccount)(bankAccountID, lastUsedPaymentMethods, bankAccount);
        }
        else if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD && fundID) {
            (0, PaymentMethods_1.deletePaymentCard)(fundID);
        }
    }, [
        paymentMethod.selectedPaymentMethod.bankAccountID,
        paymentMethod.selectedPaymentMethod.fundID,
        paymentMethod.selectedPaymentMethodType,
        lastUsedPaymentMethods,
        paymentMethod.methodID,
        bankAccountList,
    ]);
    /**
     * Navigate to the appropriate page after completing the KYC flow, depending on what initiated it
     */
    const navigateToWalletOrTransferBalancePage = (source) => {
        Navigation_1.default.navigate(source === CONST_1.default.KYC_WALL_SOURCE.ENABLE_WALLET ? ROUTES_1.default.SETTINGS_WALLET : ROUTES_1.default.SETTINGS_WALLET_TRANSFER_BALANCE);
    };
    (0, react_1.useEffect)(() => {
        // If the user was previously offline, skip debouncing showing the loader
        if (!network.isOffline) {
            updateShouldShowLoadingSpinner();
        }
        else {
            debounceSetShouldShowLoadingSpinner();
        }
    }, [network.isOffline, debounceSetShouldShowLoadingSpinner, updateShouldShowLoadingSpinner]);
    (0, react_1.useEffect)(() => {
        if (network.isOffline) {
            return;
        }
        (0, PaymentMethods_1.openWalletPage)();
    }, [network.isOffline]);
    (0, react_1.useLayoutEffect)(() => {
        if (!shouldListenForResize || (!shouldShowAddPaymentMenu && !shouldShowDefaultDeleteMenu && !shouldShowCardMenu)) {
            return;
        }
        if (shouldShowAddPaymentMenu) {
            (0, debounce_1.default)(setMenuPosition, CONST_1.default.TIMING.RESIZE_DEBOUNCE_TIME)();
            return;
        }
        setMenuPosition();
        // This effect is intended to update menu position only on window dimension change.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [windowWidth, windowHeight]);
    (0, react_1.useEffect)(() => {
        if (!shouldShowDefaultDeleteMenu) {
            return;
        }
        // We should reset selected payment method state values and close corresponding modals if the selected payment method is deleted
        let shouldResetPaymentMethodData = false;
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT && (0, isEmpty_1.default)(bankAccountList?.[paymentMethod.methodID])) {
            shouldResetPaymentMethodData = true;
        }
        else if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD && (0, isEmpty_1.default)(fundList?.[paymentMethod.methodID])) {
            shouldResetPaymentMethodData = true;
        }
        if (shouldResetPaymentMethodData) {
            // Close corresponding selected payment method modals which are open
            if (shouldShowDefaultDeleteMenu) {
                hideDefaultDeleteMenu();
            }
        }
    }, [hideDefaultDeleteMenu, paymentMethod.methodID, paymentMethod.selectedPaymentMethodType, bankAccountList, fundList, shouldShowDefaultDeleteMenu]);
    // Don't show "Make default payment method" button if it's the only payment method or if it's already the default
    const isCurrentPaymentMethodDefault = () => {
        const hasMultiplePaymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList ?? {}, fundList ?? {}, styles).length > 1;
        if (hasMultiplePaymentMethods) {
            if (paymentMethod.formattedSelectedPaymentMethod.type === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
                return paymentMethod.selectedPaymentMethod.bankAccountID === userWallet?.walletLinkedAccountID;
            }
            if (paymentMethod.formattedSelectedPaymentMethod.type === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
                return paymentMethod.selectedPaymentMethod.fundID === userWallet?.walletLinkedAccountID;
            }
        }
        return true;
    };
    const shouldShowMakeDefaultButton = !isCurrentPaymentMethodDefault() &&
        !(paymentMethod.formattedSelectedPaymentMethod.type === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT && paymentMethod.selectedPaymentMethod.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS);
    const shouldShowEnableGlobalReimbursementsButton = isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND) &&
        paymentMethod.selectedPaymentMethod.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS &&
        !paymentMethod.selectedPaymentMethod?.additionalData?.corpay?.achAuthorizationForm;
    // Determines whether or not the modal popup is mounted from the bottom of the screen instead of the side mount on Web or Desktop screens
    const isPopoverBottomMount = anchorPosition.anchorPositionTop === 0 || shouldUseNarrowLayout;
    const alertTextStyle = [styles.inlineSystemMessage, styles.flexShrink1];
    const alertViewStyle = [styles.flexRow, styles.alignItemsCenter, styles.w100];
    const headerWithBackButton = (<HeaderWithBackButton_1.default title={translate('common.wallet')} icon={Illustrations.MoneyIntoWallet} shouldUseHeadlineHeader shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter onBackButtonPress={Navigation_1.default.popToSidebar}/>);
    if (isLoadingApp) {
        return (<ScreenWrapper_1.default testID={WalletPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                {headerWithBackButton}
                <react_native_1.View style={styles.flex1}>
                    <FullscreenLoadingIndicator_1.default />
                </react_native_1.View>
            </ScreenWrapper_1.default>);
    }
    return (<>
            <ScreenWrapper_1.default testID={WalletPage.displayName} shouldShowOfflineIndicatorInWideScreen>
                {headerWithBackButton}
                <ScrollView_1.default style={styles.pt3}>
                    <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <OfflineWithFeedback_1.default style={styles.flex1} contentContainerStyle={styles.flex1} onClose={PaymentMethods_1.clearWalletError} errors={userWallet?.errors} errorRowStyles={[styles.ph6]}>
                            <Section_1.default subtitle={translate('walletPage.addBankAccountToSendAndReceive')} title={translate('common.bankAccounts')} isCentralPane subtitleMuted titleStyles={styles.accountSettingsSectionTitle} illustration={LottieAnimations_1.default.BankVault} illustrationStyle={styles.walletIllustration} illustrationContainerStyle={{ height: 220 }} illustrationBackgroundColor="#411103">
                                <PaymentMethodList_1.default shouldShowAddPaymentMethodButton={false} shouldShowEmptyListMessage={false} onPress={paymentMethodPressed} actionPaymentMethodType={shouldShowDefaultDeleteMenu ? paymentMethod.selectedPaymentMethodType : ''} activePaymentMethodID={shouldShowDefaultDeleteMenu ? getSelectedPaymentMethodID() : ''} buttonRef={addPaymentMethodAnchorRef} onListContentSizeChange={shouldShowAddPaymentMenu || shouldShowDefaultDeleteMenu ? setMenuPosition : () => { }} style={[styles.mt5, [shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8]]} listItemStyle={shouldUseNarrowLayout ? styles.ph5 : styles.ph8} shouldShowBankAccountSections/>
                            </Section_1.default>

                            {hasAssignedCard ? (<Section_1.default subtitle={translate('walletPage.assignedCardsDescription')} title={translate('walletPage.assignedCards')} isCentralPane subtitleMuted titleStyles={styles.accountSettingsSectionTitle}>
                                    <PaymentMethodList_1.default shouldShowAddBankAccount={false} shouldShowAddPaymentMethodButton={false} shouldShowAssignedCards shouldShowEmptyListMessage={false} onPress={assignedCardPressed} style={[styles.mt5, [shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8]]} listItemStyle={shouldUseNarrowLayout ? styles.ph5 : styles.ph8} actionPaymentMethodType={shouldShowCardMenu ? paymentMethod.selectedPaymentMethodType : ''} activePaymentMethodID={shouldShowCardMenu ? paymentMethod.methodID : ''} buttonRef={addPaymentMethodAnchorRef} onListContentSizeChange={shouldShowCardMenu ? setMenuPosition : () => { }}/>
                                </Section_1.default>) : null}

                            {hasWallet && (<Section_1.default subtitle={translate(`walletPage.sendAndReceiveMoney`)} title={translate('walletPage.expensifyWallet')} isCentralPane subtitleMuted titleStyles={styles.accountSettingsSectionTitle} childrenStyles={shouldShowLoadingSpinner ? styles.mt7 : styles.mt5}>
                                    <>
                                        {shouldShowLoadingSpinner && (<react_native_1.ActivityIndicator color={theme.spinner} size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.mb5]}/>)}
                                        {!shouldShowLoadingSpinner && hasActivatedWallet && (<OfflineWithFeedback_1.default pendingAction={CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD} errors={walletTerms?.errors} onClose={PaymentMethods_1.clearWalletTermsError} errorRowStyles={[styles.ml10, styles.mr2]} style={[styles.mb2]}>
                                                <MenuItemWithTopDescription_1.default description={translate('walletPage.balance')} title={(0, CurrencyUtils_1.convertToDisplayString)(userWallet?.currentBalance ?? 0)} titleStyle={styles.textHeadlineH2} interactive={false} wrapperStyle={styles.sectionMenuItemTopDescription} copyValue={(0, CurrencyUtils_1.convertToDisplayString)(userWallet?.currentBalance ?? 0)}/>
                                            </OfflineWithFeedback_1.default>)}

                                        <KYCWall_1.default onSuccessfulKYC={(_iouPaymentType, source) => navigateToWalletOrTransferBalancePage(source)} onSelectPaymentMethod={(selectedPaymentMethod) => {
                if (hasActivatedWallet || selectedPaymentMethod !== CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
                    return;
                }
                // To allow upgrading to a gold wallet, continue with the KYC flow after adding a bank account
                (0, BankAccounts_1.setPersonalBankAccountContinueKYCOnSuccess)(ROUTES_1.default.SETTINGS_WALLET);
            }} enablePaymentsRoute={ROUTES_1.default.SETTINGS_ENABLE_PAYMENTS} addDebitCardRoute={ROUTES_1.default.SETTINGS_ADD_DEBIT_CARD} source={hasActivatedWallet ? CONST_1.default.KYC_WALL_SOURCE.TRANSFER_BALANCE : CONST_1.default.KYC_WALL_SOURCE.ENABLE_WALLET} shouldIncludeDebitCard={hasActivatedWallet}>
                                            {(triggerKYCFlow, buttonRef) => {
                if (shouldShowLoadingSpinner) {
                    return null;
                }
                if (hasActivatedWallet) {
                    return (<MenuItem_1.default ref={buttonRef} title={translate('common.transferBalance')} icon={Expensicons.Transfer} onPress={triggerKYCFlow} shouldShowRightIcon disabled={network.isOffline} wrapperStyle={[
                            styles.transferBalance,
                            shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8,
                            shouldUseNarrowLayout ? styles.ph5 : styles.ph8,
                        ]}/>);
                }
                if (isPendingOnfidoResult) {
                    return (<react_native_1.View style={alertViewStyle}>
                                                            <Icon_1.default src={Expensicons.Hourglass} fill={theme.icon}/>

                                                            <Text_1.default style={alertTextStyle}>{translate('walletPage.walletActivationPending')}</Text_1.default>
                                                        </react_native_1.View>);
                }
                if (hasFailedOnfido) {
                    return (<react_native_1.View style={alertViewStyle}>
                                                            <Icon_1.default src={Expensicons.Exclamation} fill={theme.icon}/>

                                                            <Text_1.default style={alertTextStyle}>{translate('walletPage.walletActivationFailed')}</Text_1.default>
                                                        </react_native_1.View>);
                }
                return (<MenuItem_1.default title={translate('walletPage.enableWallet')} icon={Expensicons.Wallet} ref={buttonRef} onPress={() => {
                        if (isActingAsDelegate) {
                            showDelegateNoAccessModal();
                            return;
                        }
                        if (isAccountLocked) {
                            showLockedAccountModal();
                            return;
                        }
                        if (!isUserValidated) {
                            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(ROUTES_1.default.SETTINGS_WALLET, ROUTES_1.default.SETTINGS_ENABLE_PAYMENTS));
                            return;
                        }
                        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ENABLE_PAYMENTS);
                    }} disabled={network.isOffline} wrapperStyle={[
                        styles.transferBalance,
                        shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8,
                        shouldUseNarrowLayout ? styles.ph5 : styles.ph8,
                    ]}/>);
            }}
                                        </KYCWall_1.default>
                                    </>
                                </Section_1.default>)}
                        </OfflineWithFeedback_1.default>
                    </react_native_1.View>
                </ScrollView_1.default>
                <Popover_1.default isVisible={shouldShowDefaultDeleteMenu} onClose={hideDefaultDeleteMenu} anchorPosition={{
            top: anchorPosition.anchorPositionTop,
            right: anchorPosition.anchorPositionRight,
        }} anchorRef={paymentMethodButtonRef}>
                    {!showConfirmDeleteModal && (<react_native_1.View style={[
                !shouldUseNarrowLayout
                    ? {
                        ...styles.sidebarPopover,
                        ...styles.pv4,
                    }
                    : styles.pt5,
            ]}>
                            {isPopoverBottomMount && (<MenuItem_1.default title={paymentMethod.formattedSelectedPaymentMethod.title} icon={paymentMethod.formattedSelectedPaymentMethod.icon?.icon} iconHeight={paymentMethod.formattedSelectedPaymentMethod.icon?.iconHeight ?? paymentMethod.formattedSelectedPaymentMethod.icon?.iconSize} iconWidth={paymentMethod.formattedSelectedPaymentMethod.icon?.iconWidth ?? paymentMethod.formattedSelectedPaymentMethod.icon?.iconSize} iconStyles={paymentMethod.formattedSelectedPaymentMethod.icon?.iconStyles} description={paymentMethod.formattedSelectedPaymentMethod.description} wrapperStyle={[styles.mb4, styles.ph5, styles.pv0]} interactive={false} displayInDefaultIconColor/>)}
                            {shouldShowMakeDefaultButton && (<MenuItem_1.default title={translate('walletPage.setDefaultConfirmation')} icon={Expensicons.Star} onPress={() => {
                    if (isActingAsDelegate) {
                        (0, Modal_1.close)(() => {
                            showDelegateNoAccessModal();
                        });
                        return;
                    }
                    if (isAccountLocked) {
                        (0, Modal_1.close)(() => showLockedAccountModal());
                        return;
                    }
                    makeDefaultPaymentMethod();
                    setShouldShowDefaultDeleteMenu(false);
                }} wrapperStyle={[styles.pv3, styles.ph5, !shouldUseNarrowLayout ? styles.sidebarPopover : {}]} numberOfLinesTitle={0}/>)}
                            <MenuItem_1.default title={translate('common.delete')} icon={Expensicons.Trashcan} onPress={() => {
                if (isActingAsDelegate) {
                    (0, Modal_1.close)(() => {
                        showDelegateNoAccessModal();
                    });
                    return;
                }
                if (isAccountLocked) {
                    (0, Modal_1.close)(() => showLockedAccountModal());
                    return;
                }
                (0, Modal_1.close)(() => setShowConfirmDeleteModal(true));
            }} wrapperStyle={[styles.pv3, styles.ph5, !shouldUseNarrowLayout ? styles.sidebarPopover : {}]}/>
                            {shouldShowEnableGlobalReimbursementsButton && (<MenuItem_1.default title={translate('common.enableGlobalReimbursements')} icon={Expensicons.Globe} onPress={() => {
                    if (isActingAsDelegate) {
                        (0, Modal_1.close)(() => {
                            showDelegateNoAccessModal();
                        });
                        return;
                    }
                    if (isAccountLocked) {
                        (0, Modal_1.close)(() => showLockedAccountModal());
                        return;
                    }
                    (0, Modal_1.close)(() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_ENABLE_GLOBAL_REIMBURSEMENTS.getRoute(paymentMethod.selectedPaymentMethod.bankAccountID)));
                }} wrapperStyle={[styles.pv3, styles.ph5, !shouldUseNarrowLayout ? styles.sidebarPopover : {}]}/>)}
                        </react_native_1.View>)}
                </Popover_1.default>
                <Popover_1.default isVisible={shouldShowCardMenu} onClose={hideCardMenu} anchorPosition={{
            top: anchorPosition.anchorPositionTop,
            right: anchorPosition.anchorPositionRight,
        }} anchorRef={paymentMethodButtonRef}>
                    <react_native_1.View style={[
            !shouldUseNarrowLayout
                ? {
                    ...styles.sidebarPopover,
                    ...styles.pv4,
                }
                : styles.pt5,
        ]}>
                        {isPopoverBottomMount && (<MenuItem_1.default title={paymentMethod.formattedSelectedPaymentMethod.title} icon={paymentMethod.formattedSelectedPaymentMethod.icon?.icon} iconHeight={paymentMethod.formattedSelectedPaymentMethod.icon?.iconHeight ?? paymentMethod.formattedSelectedPaymentMethod.icon?.iconSize} iconWidth={paymentMethod.formattedSelectedPaymentMethod.icon?.iconWidth ?? paymentMethod.formattedSelectedPaymentMethod.icon?.iconSize} iconStyles={paymentMethod.formattedSelectedPaymentMethod.icon?.iconStyles} description={paymentMethod.formattedSelectedPaymentMethod.description} wrapperStyle={[styles.mb4, styles.ph5, styles.pv0]} interactive={false} displayInDefaultIconColor/>)}
                        <MenuItem_1.default icon={Expensicons.MoneySearch} title={translate('workspace.common.viewTransactions')} onPress={() => {
            hideCardMenu();
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                query: (0, SearchQueryUtils_1.buildCannedSearchQuery)({
                    type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE,
                    status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
                    cardID: String(paymentMethod.methodID),
                }),
            }));
        }}/>
                    </react_native_1.View>
                </Popover_1.default>
                <ConfirmModal_1.default isVisible={showConfirmDeleteModal} onConfirm={() => {
            hideDefaultDeleteMenu();
            deletePaymentMethod();
        }} onCancel={hideDefaultDeleteMenu} title={translate('walletPage.deleteAccount')} prompt={translate('walletPage.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} shouldShowCancelButton danger onModalHide={resetSelectedPaymentMethodData}/>
            </ScreenWrapper_1.default>
            <AddPaymentMethodMenu_1.default isVisible={shouldShowAddPaymentMenu} onClose={hideAddPaymentMenu} anchorPosition={{
            horizontal: anchorPosition.anchorPositionHorizontal,
            vertical: anchorPosition.anchorPositionVertical - CONST_1.default.MODAL.POPOVER_MENU_PADDING,
        }} onItemSelected={(method) => addPaymentMethodTypePressed(method)} anchorRef={addPaymentMethodAnchorRef} shouldShowPersonalBankAccountOption/>
        </>);
}
WalletPage.displayName = 'WalletPage';
exports.default = WalletPage;
