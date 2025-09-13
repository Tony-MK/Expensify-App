"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function HaveReadAndAgreeLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {`${translate('termsStep.haveReadAndAgree')}`}
            <TextLink_1.default href={CONST_1.default.ELECTRONIC_DISCLOSURES_URL}>{`${translate('termsStep.electronicDisclosures')}.`}</TextLink_1.default>
        </Text_1.default>);
}
function AgreeToTheLabel() {
    const { translate } = (0, useLocalize_1.default)();
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET);
    const walletAgreementUrl = userWallet?.walletProgramID && userWallet?.walletProgramID === CONST_1.default.WALLET.BANCORP_WALLET_PROGRAM_ID
        ? CONST_1.default.OLD_DOT_PUBLIC_URLS.BANCORP_WALLET_AGREEMENT_URL
        : CONST_1.default.OLD_DOT_PUBLIC_URLS.WALLET_AGREEMENT_URL;
    return (<Text_1.default>
            {`${translate('termsStep.agreeToThe')} `}
            <TextLink_1.default href={CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL}>{`${translate('common.privacy')} `}</TextLink_1.default>
            {`${translate('common.and')} `}
            <TextLink_1.default href={walletAgreementUrl}>{`${translate('termsStep.walletAgreement')}.`}</TextLink_1.default>
        </Text_1.default>);
}
function TermsStep({ onNext }) {
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
    const submit = () => {
        if (!hasAcceptedDisclosure || !hasAcceptedPrivacyPolicyAndWalletAgreement) {
            setError(true);
            return;
        }
        setError(false);
        onNext();
    };
    /** clear error */
    (0, react_1.useEffect)(() => {
        if (!hasAcceptedDisclosure || !hasAcceptedPrivacyPolicyAndWalletAgreement) {
            return;
        }
        setError(false);
    }, [hasAcceptedDisclosure, hasAcceptedPrivacyPolicyAndWalletAgreement]);
    return (<react_native_1.View style={[styles.flexGrow1, styles.ph5]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{translate('termsStep.checkTheBoxes')}</Text_1.default>
            <Text_1.default style={[styles.mt3, styles.mb3, styles.textSupporting]}>{translate('termsStep.agreeToTerms')}</Text_1.default>
            <react_native_1.View style={styles.flex1}>
                <CheckboxWithLabel_1.default accessibilityLabel={translate('termsStep.haveReadAndAgree')} style={[styles.mb4, styles.mt4]} onInputChange={toggleDisclosure} LabelComponent={HaveReadAndAgreeLabel}/>
                <CheckboxWithLabel_1.default accessibilityLabel={translate('termsStep.agreeToThe')} onInputChange={togglePrivacyPolicy} LabelComponent={AgreeToTheLabel}/>
            </react_native_1.View>
            <FormAlertWithSubmitButton_1.default buttonText={translate('termsStep.enablePayments')} onSubmit={submit} message={errorMessage} isAlertVisible={error || !!errorMessage} isLoading={!!walletTerms?.isLoading} containerStyles={[styles.mh0, styles.mv5]}/>
        </react_native_1.View>);
}
exports.default = TermsStep;
