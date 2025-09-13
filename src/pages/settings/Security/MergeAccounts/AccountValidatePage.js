"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const ValidateCodeActionForm_1 = require("@components/ValidateCodeActionForm");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const MergeAccounts_1 = require("@userActions/MergeAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const getMergeErrorPage = (err) => {
    if (err.includes('403')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.TOO_MANY_ATTEMPTS;
    }
    if (err.includes('401 Cannot merge accounts - 2FA enabled')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_2FA;
    }
    if (err.includes('401 Not authorized - domain under control')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SAML_DOMAIN_CONTROL;
    }
    if (err.includes('405 Cannot merge account under invoicing')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_INVOICING;
    }
    if (err.includes('405 Cannot merge SmartScanner account')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_SMART_SCANNER;
    }
    if (err.includes('405 Cannot merge into unvalidated account')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ACCOUNT_UNVALIDATED;
    }
    if (err.includes('413')) {
        return CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_ACCOUNT_LOCKED;
    }
    return null;
};
const getAuthenticationErrorKey = (err) => {
    if (!err) {
        return null;
    }
    if (err.includes('Invalid validateCode')) {
        return 'mergeAccountsPage.accountValidate.errors.incorrectMagicCode';
    }
    return 'mergeAccountsPage.accountValidate.errors.fallback';
};
function AccountValidatePage() {
    const validateCodeFormRef = (0, react_1.useRef)(null);
    const navigation = (0, native_1.useNavigation)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, {
        selector: (data) => ({
            mergeWithValidateCode: data?.mergeWithValidateCode,
            getValidateCodeForAccountMerge: data?.getValidateCodeForAccountMerge,
        }),
        canBeMissing: true,
    });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const { params } = (0, native_1.useRoute)();
    const email = params.login ?? '';
    const mergeWithValidateCode = account?.mergeWithValidateCode;
    const getValidateCodeForAccountMerge = account?.getValidateCodeForAccountMerge;
    const isAccountMerged = mergeWithValidateCode?.isAccountMerged;
    const latestError = (0, ErrorUtils_1.getLatestErrorMessage)(mergeWithValidateCode);
    const errorPage = getMergeErrorPage(latestError);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!isAccountMerged || !email) {
            return;
        }
        return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.getRoute(email, 'success'), { forceReplace: true });
    }, [isAccountMerged, email]));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!errorPage || !email) {
            return;
        }
        return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.getRoute(email, errorPage), { forceReplace: true });
    }, [errorPage, email]));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        const task = react_native_1.InteractionManager.runAfterInteractions(() => {
            if (privateSubscription?.type !== CONST_1.default.SUBSCRIPTION.TYPE.INVOICING) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.getRoute(currentUserPersonalDetails.login ?? '', CONST_1.default.MERGE_ACCOUNT_RESULTS.ERR_INVOICING, ROUTES_1.default.SETTINGS_SECURITY));
        });
        return () => task.cancel();
    }, [privateSubscription?.type, currentUserPersonalDetails.login]));
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            (0, MergeAccounts_1.clearGetValidateCodeForAccountMerge)();
            (0, MergeAccounts_1.clearMergeWithValidateCode)();
        });
        return unsubscribe;
    }, [navigation]);
    const authenticationErrorKey = getAuthenticationErrorKey(latestError);
    const validateCodeError = !errorPage && authenticationErrorKey ? { authError: translate(authenticationErrorKey) } : undefined;
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID={AccountValidatePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('mergeAccountsPage.mergeAccount')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS.getRoute());
        }} shouldDisplayHelpButton={false}/>
            <ScrollView_1.default style={[styles.w100, styles.h100, styles.flex1]} contentContainerStyle={[styles.flexGrow1]}>
                <ValidateCodeActionForm_1.default descriptionPrimary={translate('mergeAccountsPage.accountValidate.confirmMerge')} descriptionPrimaryStyles={{ ...styles.mb8, ...styles.textStrong }} descriptionSecondary={<react_native_1.View style={[styles.w100]}>
                            <Text_1.default style={[styles.mb8]}>
                                {translate('mergeAccountsPage.accountValidate.lossOfUnsubmittedData')}
                                <Text_1.default style={styles.textStrong}>{email}</Text_1.default>.
                            </Text_1.default>
                            <Text_1.default>
                                {translate('mergeAccountsPage.accountValidate.enterMagicCode')}
                                <Text_1.default style={styles.textStrong}>{email}</Text_1.default>.
                            </Text_1.default>
                        </react_native_1.View>} descriptionSecondaryStyles={styles.mb8} handleSubmitForm={(code) => {
            (0, MergeAccounts_1.mergeWithValidateCode)(email, code);
        }} sendValidateCode={() => {
            (0, MergeAccounts_1.requestValidationCodeForAccountMerge)(email, true);
        }} shouldSkipInitialValidation clearError={() => (0, MergeAccounts_1.clearMergeWithValidateCode)()} validateError={validateCodeError} hasMagicCodeBeenSent={getValidateCodeForAccountMerge?.validateCodeResent} submitButtonText={translate('mergeAccountsPage.mergeAccount')} forwardedRef={validateCodeFormRef} isLoading={mergeWithValidateCode?.isLoading}/>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
AccountValidatePage.displayName = 'AccountValidatePage';
exports.default = AccountValidatePage;
