"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddPaymentMethodMenu_1 = require("@components/AddPaymentMethodMenu");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const Popover_1 = require("@components/Popover");
const Section_1 = require("@components/Section");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaymentMethodState_1 = require("@hooks/usePaymentMethodState");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const getClickedTargetLocation_1 = require("@libs/getClickedTargetLocation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PaymentMethodList_1 = require("@pages/settings/Wallet/PaymentMethodList");
const variables_1 = require("@styles/variables");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Modal_1 = require("@userActions/Modal");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function WorkspaceInvoiceVBASection({ policyID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const { paymentMethod, setPaymentMethod, resetSelectedPaymentMethodData } = (0, usePaymentMethodState_1.default)();
    const addPaymentMethodAnchorRef = (0, react_1.useRef)(null);
    const paymentMethodButtonRef = (0, react_1.useRef)(null);
    const [shouldShowAddPaymentMenu, setShouldShowAddPaymentMenu] = (0, react_1.useState)(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = (0, react_1.useState)(false);
    const [shouldShowDefaultDeleteMenu, setShouldShowDefaultDeleteMenu] = (0, react_1.useState)(false);
    const [anchorPosition, setAnchorPosition] = (0, react_1.useState)({
        anchorPositionHorizontal: 0,
        anchorPositionVertical: 0,
        anchorPositionTop: 0,
        anchorPositionRight: 0,
    });
    const hasBankAccount = !(0, EmptyObject_1.isEmptyObject)(bankAccountList);
    const shouldShowEmptyState = !hasBankAccount;
    // Determines whether or not the modal popup is mounted from the bottom of the screen instead of the side mount on Web or Desktop screens
    const isPopoverBottomMount = anchorPosition.anchorPositionTop === 0 || shouldUseNarrowLayout;
    const shouldShowMakeDefaultButton = !paymentMethod.isSelectedPaymentMethodDefault;
    const transferBankAccountID = policy?.invoice?.bankAccount?.transferBankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
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
            anchorPositionHorizontal: position.x + (shouldShowEmptyState ? -variables_1.default.addPaymentMethodLeftSpacing : variables_1.default.addBankAccountLeftSpacing),
            anchorPositionVertical: position.y,
        });
    }, [shouldShowEmptyState, windowWidth]);
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
            setPaymentMethod({
                isSelectedPaymentMethodDefault: transferBankAccountID === methodID,
                selectedPaymentMethod: account ?? {},
                selectedPaymentMethodType: accountType,
                formattedSelectedPaymentMethod,
                methodID: methodID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            });
            setShouldShowDefaultDeleteMenu(true);
            setMenuPosition();
            return;
        }
        setShouldShowAddPaymentMenu(true);
        setMenuPosition();
    };
    /**
     * Hide the add payment modal
     */
    const hideAddPaymentMenu = () => {
        setShouldShowAddPaymentMenu(false);
    };
    /**
     * Hide the default / delete modal
     */
    const hideDefaultDeleteMenu = (0, react_1.useCallback)(() => {
        setShouldShowDefaultDeleteMenu(false);
        setShowConfirmDeleteModal(false);
    }, [setShouldShowDefaultDeleteMenu, setShowConfirmDeleteModal]);
    const deletePaymentMethod = (0, react_1.useCallback)(() => {
        const bankAccountID = paymentMethod.selectedPaymentMethod.bankAccountID;
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT && bankAccountID) {
            (0, BankAccounts_1.deletePaymentBankAccount)(bankAccountID);
        }
    }, [paymentMethod.selectedPaymentMethod.bankAccountID, paymentMethod.selectedPaymentMethodType]);
    const makeDefaultPaymentMethod = (0, react_1.useCallback)(() => {
        // Find the previous default payment method so we can revert if the MakeDefaultPaymentMethod command errors
        const paymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList ?? {}, {}, styles);
        const previousPaymentMethod = paymentMethods.find((method) => !!method.isDefault);
        const currentPaymentMethod = paymentMethods.find((method) => method.methodID === paymentMethod.methodID);
        if (paymentMethod.selectedPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
            (0, PaymentMethods_1.setInvoicingTransferBankAccount)(currentPaymentMethod?.methodID ?? CONST_1.default.DEFAULT_NUMBER_ID, policyID, previousPaymentMethod?.methodID ?? CONST_1.default.DEFAULT_NUMBER_ID);
        }
    }, [bankAccountList, styles, paymentMethod.selectedPaymentMethodType, paymentMethod.methodID, policyID]);
    /**
     * Navigate to the appropriate payment type addition screen
     */
    const addPaymentMethodTypePressed = (paymentType) => {
        hideAddPaymentMenu();
        if (paymentType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT || paymentType === CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT) {
            (0, BankAccounts_1.openPersonalBankAccountSetupView)({ policyID, source: 'invoice', isUserValidated });
            return;
        }
        throw new Error('Invalid payment method type selected');
    };
    return (<Section_1.default title={translate('common.bankAccounts')} subtitle={translate('workspace.invoices.bankAccountsSubtitle')} isCentralPane titleStyles={styles.accountSettingsSectionTitle} subtitleMuted>
            <PaymentMethodList_1.default shouldShowAddBankAccountButton={!hasBankAccount} shouldShowAddPaymentMethodButton={false} shouldShowEmptyListMessage={false} onPress={paymentMethodPressed} invoiceTransferBankAccountID={transferBankAccountID} activePaymentMethodID={transferBankAccountID} actionPaymentMethodType={shouldShowDefaultDeleteMenu ? paymentMethod.selectedPaymentMethodType : ''} buttonRef={addPaymentMethodAnchorRef} style={[styles.mt5, hasBankAccount && [shouldUseNarrowLayout ? styles.mhn5 : styles.mhn8]]} listItemStyle={shouldUseNarrowLayout ? styles.ph5 : styles.ph8}/>
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
                    makeDefaultPaymentMethod();
                    setShouldShowDefaultDeleteMenu(false);
                }} wrapperStyle={[styles.pv3, styles.ph5, !shouldUseNarrowLayout ? styles.sidebarPopover : {}]}/>)}
                        <MenuItem_1.default title={translate('common.delete')} icon={Expensicons.Trashcan} onPress={() => (0, Modal_1.close)(() => setShowConfirmDeleteModal(true))} wrapperStyle={[styles.pv3, styles.ph5, !shouldUseNarrowLayout ? styles.sidebarPopover : {}]}/>
                    </react_native_1.View>)}
            </Popover_1.default>
            <ConfirmModal_1.default isVisible={showConfirmDeleteModal} onConfirm={() => {
            deletePaymentMethod();
            hideDefaultDeleteMenu();
        }} onCancel={hideDefaultDeleteMenu} title={translate('walletPage.deleteAccount')} prompt={translate('walletPage.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} shouldShowCancelButton danger onModalHide={resetSelectedPaymentMethodData}/>
            <AddPaymentMethodMenu_1.default isVisible={shouldShowAddPaymentMenu} onClose={hideAddPaymentMenu} anchorPosition={{
            horizontal: anchorPosition.anchorPositionHorizontal,
            vertical: anchorPosition.anchorPositionVertical - CONST_1.default.MODAL.POPOVER_MENU_PADDING,
        }} onItemSelected={(method) => addPaymentMethodTypePressed(method)} anchorRef={addPaymentMethodAnchorRef} shouldShowPersonalBankAccountOption/>
        </Section_1.default>);
}
WorkspaceInvoiceVBASection.displayName = 'WorkspaceInvoiceVBASection';
exports.default = WorkspaceInvoiceVBASection;
