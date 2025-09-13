"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const FixedFooter_1 = require("@components/FixedFooter");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const TwoFactorAuthForm_1 = require("./TwoFactorAuthForm");
const TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
function DisablePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    const formRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (account?.requiresTwoFactorAuth) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_DISABLED, { forceReplace: true });
    }, [account?.requiresTwoFactorAuth]);
    const closeModal = (0, react_1.useCallback)(() => {
        (0, Session_1.clearDisableTwoFactorAuthErrors)();
        // Go back to the previous page because the user can't disable 2FA and this page is no longer relevant
        Navigation_1.default.goBack();
    }, []);
    return (<TwoFactorAuthWrapper_1.default stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.DISABLE} title={translate('twoFactorAuth.disableTwoFactorAuth')}>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                <react_native_1.View style={[styles.ph5, styles.mt3]}>
                    <Text_1.default>{translate('twoFactorAuth.explainProcessToRemove')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mh5, styles.mb4, styles.mt3]}>
                    <TwoFactorAuthForm_1.default innerRef={formRef} validateInsteadOfDisable={false}/>
                </react_native_1.View>
            </ScrollView_1.default>
            <FixedFooter_1.default style={[styles.mt2, styles.pt2]}>
                <Button_1.default success large text={translate('twoFactorAuth.disable')} isLoading={account?.isLoading} onPress={() => {
            if (!formRef.current) {
                return;
            }
            formRef.current.validateAndSubmitForm();
        }}/>
            </FixedFooter_1.default>
            <ConfirmModal_1.default title={translate('twoFactorAuth.twoFactorAuthCannotDisable')} prompt={translate('twoFactorAuth.twoFactorAuthRequired')} confirmText={translate('common.buttonConfirm')} onConfirm={closeModal} shouldShowCancelButton={false} onBackdropPress={closeModal} onCancel={closeModal} isVisible={!(0, isEmpty_1.default)(account?.errorFields?.requiresTwoFactorAuth ?? {})}/>
        </TwoFactorAuthWrapper_1.default>);
}
DisablePage.displayName = 'DisablePage';
exports.default = DisablePage;
