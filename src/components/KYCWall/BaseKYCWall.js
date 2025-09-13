"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react-compiler/react-compiler */
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddPaymentMethodMenu_1 = require("@components/AddPaymentMethodMenu");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const BankAccounts_1 = require("@libs/actions/BankAccounts");
const IOU_1 = require("@libs/actions/IOU");
const Report_1 = require("@libs/actions/Report");
const getClickedTargetLocation_1 = require("@libs/getClickedTargetLocation");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const Policy_1 = require("@userActions/Policy/Policy");
const Wallet_1 = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const viewRef_1 = require("@src/types/utils/viewRef");
// This sets the Horizontal anchor position offset for POPOVER MENU.
const POPOVER_MENU_ANCHOR_POSITION_HORIZONTAL_OFFSET = 20;
// This component allows us to block various actions by forcing the user to first add a default payment method and successfully make it through our Know Your Customer flow
// before continuing to take whatever action they originally intended to take. It requires a button as a child and a native event so we can get the coordinates and use it
// to render the AddPaymentMethodMenu in the correct location.
function KYCWall({ addBankAccountRoute, addDebitCardRoute, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, chatReportID = '', children, enablePaymentsRoute, iouReport, onSelectPaymentMethod = () => { }, onSuccessfulKYC, shouldIncludeDebitCard = true, shouldListenForResize = false, source, shouldShowPersonalBankAccountOption = false, }) {
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [bankAccountList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`, { canBeMissing: true });
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const { formatPhoneNumber } = (0, useLocalize_1.default)();
    const anchorRef = (0, react_1.useRef)(null);
    const transferBalanceButtonRef = (0, react_1.useRef)(null);
    const [shouldShowAddPaymentMenu, setShouldShowAddPaymentMenu] = (0, react_1.useState)(false);
    const [anchorPosition, setAnchorPosition] = (0, react_1.useState)({
        anchorPositionVertical: 0,
        anchorPositionHorizontal: 0,
    });
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const getAnchorPosition = (0, react_1.useCallback)((domRect) => {
        if (anchorAlignment.vertical === CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP) {
            return {
                anchorPositionVertical: domRect.top + domRect.height + CONST_1.default.MODAL.POPOVER_MENU_PADDING,
                anchorPositionHorizontal: domRect.left + POPOVER_MENU_ANCHOR_POSITION_HORIZONTAL_OFFSET,
            };
        }
        return {
            anchorPositionVertical: domRect.top - CONST_1.default.MODAL.POPOVER_MENU_PADDING,
            anchorPositionHorizontal: domRect.left,
        };
    }, [anchorAlignment.vertical]);
    /**
     * Set position of the transfer payment menu
     */
    const setPositionAddPaymentMenu = ({ anchorPositionVertical, anchorPositionHorizontal }) => {
        setAnchorPosition({
            anchorPositionVertical,
            anchorPositionHorizontal,
        });
    };
    const setMenuPosition = (0, react_1.useCallback)(() => {
        if (!transferBalanceButtonRef.current) {
            return;
        }
        const buttonPosition = (0, getClickedTargetLocation_1.default)(transferBalanceButtonRef.current);
        const position = getAnchorPosition(buttonPosition);
        setPositionAddPaymentMenu(position);
    }, [getAnchorPosition]);
    const selectPaymentMethod = (0, react_1.useCallback)((paymentMethod, policy) => {
        if (paymentMethod) {
            onSelectPaymentMethod(paymentMethod);
        }
        if (paymentMethod === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT) {
            (0, BankAccounts_1.openPersonalBankAccountSetupView)({ shouldSetUpUSBankAccount: (0, ReportUtils_1.isIOUReport)(iouReport) });
        }
        else if (paymentMethod === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
            Navigation_1.default.navigate(addDebitCardRoute ?? ROUTES_1.default.HOME);
        }
        else if (paymentMethod === CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT || policy) {
            if (iouReport && (0, ReportUtils_1.isIOUReport)(iouReport)) {
                if (policy) {
                    const policyExpenseChatReportID = (0, ReportUtils_1.getPolicyExpenseChat)(iouReport.ownerAccountID, policy.id, allReports)?.reportID;
                    if (!policyExpenseChatReportID) {
                        const { policyExpenseChatReportID: newPolicyExpenseChatReportID } = (0, Report_1.moveIOUReportToPolicyAndInviteSubmitter)(iouReport.reportID, policy.id, formatPhoneNumber) ?? {};
                        (0, IOU_1.savePreferredPaymentMethod)(iouReport.policyID, policy.id, CONST_1.default.LAST_PAYMENT_METHOD.IOU, lastPaymentMethod?.[policy.id]);
                        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(newPolicyExpenseChatReportID));
                    }
                    else {
                        (0, Report_1.moveIOUReportToPolicy)(iouReport.reportID, policy.id, true);
                        (0, IOU_1.savePreferredPaymentMethod)(iouReport.policyID, policy.id, CONST_1.default.LAST_PAYMENT_METHOD.IOU, lastPaymentMethod?.[policy.id]);
                        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(policyExpenseChatReportID));
                    }
                    if (policy?.achAccount) {
                        return;
                    }
                    // Navigate to the bank account set up flow for this specific policy
                    Navigation_1.default.navigate(ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(policy.id));
                    return;
                }
                const { policyID, workspaceChatReportID, reportPreviewReportActionID, adminsChatReportID } = (0, Policy_1.createWorkspaceFromIOUPayment)(iouReport) ?? {};
                if (policyID && iouReport?.policyID) {
                    (0, IOU_1.savePreferredPaymentMethod)(iouReport.policyID, policyID, CONST_1.default.LAST_PAYMENT_METHOD.IOU, lastPaymentMethod?.[iouReport?.policyID]);
                }
                (0, IOU_1.completePaymentOnboarding)(CONST_1.default.PAYMENT_SELECTED.BBA, adminsChatReportID, policyID);
                if (workspaceChatReportID) {
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(workspaceChatReportID, reportPreviewReportActionID));
                }
                // Navigate to the bank account set up flow for this specific policy
                Navigation_1.default.navigate(ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(policyID));
                return;
            }
            const bankAccountRoute = addBankAccountRoute ?? (0, ReportUtils_1.getBankAccountRoute)(chatReport);
            Navigation_1.default.navigate(bankAccountRoute);
        }
    }, [addBankAccountRoute, addDebitCardRoute, chatReport, iouReport, onSelectPaymentMethod, formatPhoneNumber, lastPaymentMethod, allReports]);
    /**
     * Take the position of the button that calls this method and show the Add Payment method menu when the user has no valid payment method.
     * If they do have a valid payment method they are navigated to the "enable payments" route to complete KYC checks.
     * If they are already KYC'd we will continue whatever action is gated behind the KYC wall.
     *
     */
    const continueAction = (0, react_1.useCallback)((event, iouPaymentType, paymentMethod, policy) => {
        const currentSource = walletTerms?.source ?? source;
        /**
         * Set the source, so we can tailor the process according to how we got here.
         * We do not want to set this on mount, as the source can change upon completing the flow, e.g. when upgrading the wallet to Gold.
         */
        (0, Wallet_1.setKYCWallSource)(source, chatReportID);
        if (shouldShowAddPaymentMenu) {
            setShouldShowAddPaymentMenu(false);
            return;
        }
        // Use event target as fallback if anchorRef is null for safety
        const targetElement = anchorRef.current ?? event?.currentTarget;
        transferBalanceButtonRef.current = targetElement;
        const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(iouReport);
        const paymentCardList = fundList ?? {};
        // Check to see if user has a valid payment method on file and display the add payment popover if they don't
        if ((isExpenseReport && reimbursementAccount?.achData?.state !== CONST_1.default.BANK_ACCOUNT.STATE.OPEN) ||
            (!isExpenseReport && bankAccountList !== null && !(0, PaymentUtils_1.hasExpensifyPaymentMethod)(paymentCardList, bankAccountList, shouldIncludeDebitCard))) {
            Log_1.default.info('[KYC Wallet] User does not have valid payment method');
            if (!shouldIncludeDebitCard) {
                selectPaymentMethod(CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            if (paymentMethod || policy) {
                setShouldShowAddPaymentMenu(false);
                selectPaymentMethod(paymentMethod, policy);
                return;
            }
            if (iouPaymentType && isExpenseReport) {
                setShouldShowAddPaymentMenu(false);
                selectPaymentMethod(CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT);
                return;
            }
            const clickedElementLocation = (0, getClickedTargetLocation_1.default)(targetElement);
            const position = getAnchorPosition(clickedElementLocation);
            setPositionAddPaymentMenu(position);
            setShouldShowAddPaymentMenu(true);
            return;
        }
        if (!isExpenseReport) {
            // Ask the user to upgrade to a gold wallet as this means they have not yet gone through our Know Your Customer (KYC) checks
            const hasActivatedWallet = userWallet?.tierName && [CONST_1.default.WALLET.TIER_NAME.GOLD, CONST_1.default.WALLET.TIER_NAME.PLATINUM].some((name) => name === userWallet.tierName);
            if (!hasActivatedWallet && !policy) {
                Log_1.default.info('[KYC Wallet] User does not have active wallet');
                Navigation_1.default.navigate(enablePaymentsRoute);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            if (policy || (paymentMethod && (!hasActivatedWallet || paymentMethod !== CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT))) {
                setShouldShowAddPaymentMenu(false);
                selectPaymentMethod(paymentMethod, policy);
                return;
            }
        }
        Log_1.default.info('[KYC Wallet] User has valid payment method and passed KYC checks or did not need them');
        onSuccessfulKYC(iouPaymentType, currentSource);
    }, [
        bankAccountList,
        chatReportID,
        enablePaymentsRoute,
        fundList,
        getAnchorPosition,
        iouReport,
        onSuccessfulKYC,
        reimbursementAccount?.achData?.state,
        selectPaymentMethod,
        shouldIncludeDebitCard,
        shouldShowAddPaymentMenu,
        source,
        userWallet?.tierName,
        walletTerms?.source,
    ]);
    (0, react_1.useEffect)(() => {
        let dimensionsSubscription = null;
        PaymentMethods_1.kycWallRef.current = { continueAction };
        if (shouldListenForResize) {
            dimensionsSubscription = react_native_1.Dimensions.addEventListener('change', setMenuPosition);
        }
        return () => {
            if (shouldListenForResize && dimensionsSubscription) {
                dimensionsSubscription.remove();
            }
            PaymentMethods_1.kycWallRef.current = null;
        };
    }, [chatReportID, setMenuPosition, shouldListenForResize, continueAction]);
    return (<>
            <AddPaymentMethodMenu_1.default isVisible={shouldShowAddPaymentMenu} iouReport={iouReport} onClose={() => setShouldShowAddPaymentMenu(false)} anchorRef={anchorRef} anchorPosition={{
            vertical: anchorPosition.anchorPositionVertical,
            horizontal: anchorPosition.anchorPositionHorizontal,
        }} anchorAlignment={anchorAlignment} onItemSelected={(item) => {
            setShouldShowAddPaymentMenu(false);
            selectPaymentMethod(item);
        }} shouldShowPersonalBankAccountOption={shouldShowPersonalBankAccountOption}/>
            {children(continueAction, (0, viewRef_1.default)(anchorRef))}
        </>);
}
KYCWall.displayName = 'BaseKYCWall';
exports.default = KYCWall;
