"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FixedFooter_1 = require("@components/FixedFooter");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const FormScrollView_1 = require("@components/FormScrollView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const DEFAULT_WALLET_ONFIDO_DATA = {
    applicantID: '',
    sdkToken: '',
    loading: false,
    errors: {},
    fixableErrors: [],
    hasAcceptedPrivacyPolicy: false,
};
function OnfidoPrivacy({ walletOnfidoData = DEFAULT_WALLET_ONFIDO_DATA }) {
    const { translate } = (0, useLocalize_1.default)();
    const formRef = (0, react_1.useRef)(null);
    const styles = (0, useThemeStyles_1.default)();
    if (!walletOnfidoData) {
        return;
    }
    const { isLoading = false, hasAcceptedPrivacyPolicy } = walletOnfidoData;
    const onfidoError = (0, ErrorUtils_1.getLatestErrorMessage)(walletOnfidoData) ?? '';
    const onfidoFixableErrors = walletOnfidoData?.fixableErrors ?? [];
    if (Array.isArray(onfidoError)) {
        onfidoError[0] += !(0, EmptyObject_1.isEmptyObject)(onfidoFixableErrors) ? `\n${onfidoFixableErrors.join('\n')}` : '';
    }
    return (<react_native_1.View style={[styles.flex1, styles.justifyContentBetween]}>
            {!hasAcceptedPrivacyPolicy ? (<>
                    <FormScrollView_1.default ref={formRef}>
                        <react_native_1.View style={[styles.mh5, styles.justifyContentCenter]}>
                            <Text_1.default style={[styles.mb5]}>
                                {translate('onfidoStep.acceptTerms')}
                                <TextLink_1.default href={CONST_1.default.ONFIDO_FACIAL_SCAN_POLICY_URL}>{translate('onfidoStep.facialScan')}</TextLink_1.default>
                                {', '}
                                <TextLink_1.default href={CONST_1.default.ONFIDO_PRIVACY_POLICY_URL}>{translate('common.privacy')}</TextLink_1.default>
                                {` ${translate('common.and')} `}
                                <TextLink_1.default href={CONST_1.default.ONFIDO_TERMS_OF_SERVICE_URL}>{translate('common.termsOfService')}</TextLink_1.default>.
                            </Text_1.default>
                        </react_native_1.View>
                    </FormScrollView_1.default>
                    <FixedFooter_1.default>
                        <FormAlertWithSubmitButton_1.default isAlertVisible={!!onfidoError} onSubmit={BankAccounts_1.openOnfidoFlow} onFixTheErrorsLinkPressed={() => {
                formRef.current?.scrollTo({ y: 0, animated: true });
            }} message={onfidoError} isLoading={isLoading} buttonText={onfidoError ? translate('onfidoStep.tryAgain') : translate('common.continue')} containerStyles={[styles.mh0, styles.mv0, styles.mb0]}/>
                    </FixedFooter_1.default>
                </>) : null}
            {hasAcceptedPrivacyPolicy && isLoading ? <FullscreenLoadingIndicator_1.default /> : null}
        </react_native_1.View>);
}
OnfidoPrivacy.displayName = 'OnfidoPrivacy';
exports.default = OnfidoPrivacy;
