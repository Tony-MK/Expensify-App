"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils = require("@libs/ErrorUtils");
const BankAccounts = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const LongTermsForm_1 = require("./TermsPage/LongTermsForm");
const ShortTermsForm_1 = require("./TermsPage/ShortTermsForm");
function HaveReadAndAgreeLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {`${translate('termsStep.haveReadAndAgree')}`}
            <TextLink_1.default href={CONST_1.default.ELECTRONIC_DISCLOSURES_URL}>{`${translate('termsStep.electronicDisclosures')}.`}</TextLink_1.default>
        </Text_1.default>);
}
function AgreeToTheLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {`${translate('termsStep.agreeToThe')} `}
            <TextLink_1.default href={CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL}>{`${translate('common.privacy')} `}</TextLink_1.default>
            {`${translate('common.and')} `}
            <TextLink_1.default href={CONST_1.default.OLD_DOT_PUBLIC_URLS.WALLET_AGREEMENT_URL}>{`${translate('termsStep.walletAgreement')}.`}</TextLink_1.default>
        </Text_1.default>);
}
function TermsStep(props) {
    const styles = (0, useThemeStyles_1.default)();
    const [hasAcceptedDisclosure, setHasAcceptedDisclosure] = (0, react_1.useState)(false);
    const [hasAcceptedPrivacyPolicyAndWalletAgreement, setHasAcceptedPrivacyPolicyAndWalletAgreement] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS);
    const errorMessage = error ? translate('common.error.acceptTerms') : (ErrorUtils.getLatestErrorMessage(walletTerms ?? {}) ?? '');
    const toggleDisclosure = () => {
        setHasAcceptedDisclosure(!hasAcceptedDisclosure);
    };
    const togglePrivacyPolicy = () => {
        setHasAcceptedPrivacyPolicyAndWalletAgreement(!hasAcceptedPrivacyPolicyAndWalletAgreement);
    };
    /** clear error */
    (0, react_1.useEffect)(() => {
        if (!hasAcceptedDisclosure || !hasAcceptedPrivacyPolicyAndWalletAgreement) {
            return;
        }
        setError(false);
    }, [hasAcceptedDisclosure, hasAcceptedPrivacyPolicyAndWalletAgreement]);
    return (<>
            <HeaderWithBackButton_1.default title={translate('termsStep.headerTitle')}/>

            <ScrollView_1.default style={styles.flex1} contentContainerStyle={styles.ph5}>
                <ShortTermsForm_1.default userWallet={props.userWallet}/>
                <LongTermsForm_1.default />
                <CheckboxWithLabel_1.default accessibilityLabel={translate('termsStep.haveReadAndAgree')} style={[styles.mb4, styles.mt4]} onInputChange={toggleDisclosure} LabelComponent={HaveReadAndAgreeLabel}/>
                <CheckboxWithLabel_1.default accessibilityLabel={translate('termsStep.agreeToThe')} onInputChange={togglePrivacyPolicy} LabelComponent={AgreeToTheLabel}/>
                <FormAlertWithSubmitButton_1.default buttonText={translate('termsStep.enablePayments')} onSubmit={() => {
            if (!hasAcceptedDisclosure || !hasAcceptedPrivacyPolicyAndWalletAgreement) {
                setError(true);
                return;
            }
            setError(false);
            BankAccounts.acceptWalletTerms({
                hasAcceptedTerms: hasAcceptedDisclosure && hasAcceptedPrivacyPolicyAndWalletAgreement,
                reportID: walletTerms?.chatReportID ?? '-1',
            });
        }} message={errorMessage} isAlertVisible={error || !!errorMessage} isLoading={!!walletTerms?.isLoading} containerStyles={[styles.mh0, styles.mv4]}/>
            </ScrollView_1.default>
        </>);
}
TermsStep.displayName = 'TermsPage';
exports.default = TermsStep;
