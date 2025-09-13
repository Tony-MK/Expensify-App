"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PaymentCardForm_1 = require("@components/AddPaymentCard/PaymentCardForm");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const PaymentMethods = require("@userActions/PaymentMethods");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function DebitCardPage() {
    // Temporarily disabled
    return <NotFoundPage_1.default />;
    const { translate } = (0, useLocalize_1.default)();
    const [formData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM);
    const prevFormDataSetupComplete = (0, usePrevious_1.default)(!!formData?.setupComplete);
    const nameOnCardRef = (0, react_1.useRef)(null);
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.accountID ?? 0 });
    /**
     * Reset the form values on the mount and unmount so that old errors don't show when this form is displayed again.
     */
    (0, react_1.useEffect)(() => {
        PaymentMethods.clearPaymentCardFormErrorAndSubmit();
        return () => {
            PaymentMethods.clearPaymentCardFormErrorAndSubmit();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (prevFormDataSetupComplete || !formData?.setupComplete) {
            return;
        }
        PaymentMethods.continueSetup();
    }, [prevFormDataSetupComplete, formData?.setupComplete]);
    const addPaymentCard = (0, react_1.useCallback)((params) => {
        PaymentMethods.addPaymentCard(accountID ?? 0, params);
    }, [accountID]);
    return (<ScreenWrapper_1.default onEntryTransitionEnd={() => nameOnCardRef.current?.focus()} includeSafeAreaPaddingBottom={false} testID={DebitCardPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('addDebitCardPage.addADebitCard')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <PaymentCardForm_1.default showAcceptTerms shouldShowPaymentCardForm showAddressField isDebitCard showStateSelector addPaymentCard={addPaymentCard} submitButtonText={translate('common.save')}/>
        </ScreenWrapper_1.default>);
}
DebitCardPage.displayName = 'DebitCardPage';
exports.default = DebitCardPage;
