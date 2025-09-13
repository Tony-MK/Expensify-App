"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PaymentCardForm_1 = require("@components/AddPaymentCard/PaymentCardForm");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const RenderHTML_1 = require("@components/RenderHTML");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
function WorkspaceOwnerPaymentCardForm({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [shouldShowPaymentCardForm, setShouldShowPaymentCardForm] = (0, react_1.useState)(false);
    const policyID = policy?.id;
    const checkIfCanBeRendered = (0, react_1.useCallback)(() => {
        const changeOwnerErrors = Object.keys(policy?.errorFields?.changeOwner ?? {});
        if (changeOwnerErrors.at(0) !== CONST_1.default.POLICY.OWNERSHIP_ERRORS.NO_BILLING_CARD) {
            setShouldShowPaymentCardForm(false);
        }
        setShouldShowPaymentCardForm(true);
    }, [policy?.errorFields?.changeOwner]);
    (0, react_1.useEffect)(() => {
        (0, PaymentMethods_1.clearPaymentCardFormErrorAndSubmit)();
        checkIfCanBeRendered();
        return () => {
            (0, PaymentMethods_1.clearPaymentCardFormErrorAndSubmit)();
        };
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    []);
    (0, react_1.useEffect)(() => {
        checkIfCanBeRendered();
    }, [checkIfCanBeRendered]);
    const addPaymentCard = (0, react_1.useCallback)((values) => {
        const cardData = {
            cardNumber: (0, CardUtils_1.getMCardNumberString)(values.cardNumber),
            cardMonth: (0, CardUtils_1.getMonthFromExpirationDateString)(values.expirationDate),
            cardYear: (0, CardUtils_1.getYearFromExpirationDateString)(values.expirationDate),
            cardCVV: values.securityCode,
            addressName: values.nameOnCard,
            addressZip: values.addressZipCode,
            currency: values.currency,
        };
        (0, Policy_1.addBillingCardAndRequestPolicyOwnerChange)(policyID, cardData);
    }, [policyID]);
    return (<PaymentCardForm_1.default shouldShowPaymentCardForm={shouldShowPaymentCardForm} addPaymentCard={addPaymentCard} showCurrencyField submitButtonText={translate('workspace.changeOwner.addPaymentCardButtonText')} headerContent={<Text_1.default style={[styles.textHeadline, styles.mt3, styles.mb2, styles.ph5]}>{translate('workspace.changeOwner.addPaymentCardTitle')}</Text_1.default>} footerContent={<>
                    <react_native_1.View style={[styles.renderHTML, styles.mt5]}>
                        <RenderHTML_1.default html={translate('workspace.changeOwner.addPaymentCardReadAndAcceptText')}/>
                    </react_native_1.View>
                    <Section_1.default icon={Illustrations.ShieldYellow} cardLayout={Section_1.CARD_LAYOUT.ICON_ON_LEFT} title={translate('requestorStep.isMyDataSafe')} containerStyles={[styles.mh0, styles.mt5]}>
                        <react_native_1.View style={[styles.mt4, styles.ph2, styles.pb2]}>
                            <Text_1.default style={[styles.textSupportingNormal, styles.dFlex, styles.alignItemsCenter]}>
                                <Icon_1.default src={Expensicons.Checkmark} additionalStyles={[styles.mr3]} fill={theme.iconSuccessFill}/>
                                {translate('workspace.changeOwner.addPaymentCardPciCompliant')}
                            </Text_1.default>
                            <Text_1.default style={[styles.mt3, styles.textSupportingNormal, styles.dFlex, styles.alignItemsCenter]}>
                                <Icon_1.default src={Expensicons.Checkmark} additionalStyles={[styles.mr3]} fill={theme.iconSuccessFill}/>
                                {translate('workspace.changeOwner.addPaymentCardBankLevelEncrypt')}
                            </Text_1.default>
                            <Text_1.default style={[styles.mt3, styles.textSupportingNormal, styles.dFlex, styles.alignItemsCenter]}>
                                <Icon_1.default src={Expensicons.Checkmark} additionalStyles={[styles.mr3]} fill={theme.iconSuccessFill}/>
                                {translate('workspace.changeOwner.addPaymentCardRedundant')}
                            </Text_1.default>
                        </react_native_1.View>
                        <react_native_1.View style={[styles.renderHTML, styles.mt3]}>
                            <RenderHTML_1.default html={translate('workspace.changeOwner.addPaymentCardLearnMore')}/>
                        </react_native_1.View>
                    </Section_1.default>
                </>}/>);
}
WorkspaceOwnerPaymentCardForm.displayName = 'WorkspaceOwnerPaymentCardForm';
exports.default = WorkspaceOwnerPaymentCardForm;
