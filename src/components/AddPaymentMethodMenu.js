"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const IOU_1 = require("@libs/actions/IOU");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Expensicons = require("./Icon/Expensicons");
const PopoverMenu_1 = require("./PopoverMenu");
function AddPaymentMethodMenu({ isVisible, onClose, anchorPosition, anchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
}, anchorRef, iouReport, onItemSelected, shouldShowPersonalBankAccountOption = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const [restoreFocusType, setRestoreFocusType] = (0, react_1.useState)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    // Users can choose to pay with business bank account in case of Expense reports or in case of P2P IOU report
    // which then starts a bottom up flow and creates a Collect workspace where the payer is an admin and payee is an employee.
    const isIOU = (0, ReportUtils_1.isIOUReport)(iouReport);
    const canUseBusinessBankAccount = (0, ReportUtils_1.isExpenseReport)(iouReport) || (isIOU && !(0, ReportActionsUtils_1.hasRequestFromCurrentAccount)(iouReport?.reportID, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID));
    const canUsePersonalBankAccount = shouldShowPersonalBankAccountOption || isIOU;
    const isPersonalOnlyOption = canUsePersonalBankAccount && !canUseBusinessBankAccount;
    // We temporarily disabled P2P debit cards so we will automatically select the personal bank account option if there is no other option to select.
    (0, react_1.useEffect)(() => {
        if (!isVisible || !isPersonalOnlyOption) {
            return;
        }
        (0, IOU_1.completePaymentOnboarding)(CONST_1.default.PAYMENT_SELECTED.PBA);
        onItemSelected(CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT);
    }, [isPersonalOnlyOption, isVisible, onItemSelected]);
    if (isPersonalOnlyOption) {
        return null;
    }
    return (<PopoverMenu_1.default isVisible={isVisible} onClose={() => {
            setRestoreFocusType(undefined);
            onClose();
        }} anchorPosition={anchorPosition} anchorAlignment={anchorAlignment} anchorRef={anchorRef} onItemSelected={() => {
            setRestoreFocusType(CONST_1.default.MODAL.RESTORE_FOCUS_TYPE.DELETE);
            onClose();
        }} menuItems={[
            ...(canUsePersonalBankAccount
                ? [
                    {
                        text: translate('common.personalBankAccount'),
                        icon: Expensicons.Bank,
                        onSelected: () => {
                            (0, IOU_1.completePaymentOnboarding)(CONST_1.default.PAYMENT_SELECTED.PBA);
                            onItemSelected(CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT);
                        },
                    },
                ]
                : []),
            ...(canUseBusinessBankAccount
                ? [
                    {
                        text: translate('common.businessBankAccount'),
                        icon: Expensicons.Building,
                        onSelected: () => {
                            onItemSelected(CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT);
                        },
                    },
                ]
                : []),
            // Adding a debit card for P2P payments is temporarily disabled
            // ...[
            //     {
            //         text: translate('common.debitCard'),
            //         icon: Expensicons.CreditCard,
            //         onSelected: () => onItemSelected(CONST.PAYMENT_METHODS.DEBIT_CARD),
            //     },
            // ],
        ]} shouldEnableNewFocusManagement restoreFocusType={restoreFocusType}/>);
}
AddPaymentMethodMenu.displayName = 'AddPaymentMethodMenu';
exports.default = AddPaymentMethodMenu;
