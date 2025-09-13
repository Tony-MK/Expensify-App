"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItem_1 = require("@components/MenuItem");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const TwoFactorAuthWrapper_1 = require("./TwoFactorAuthWrapper");
function EnabledPage() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email });
    const { translate } = (0, useLocalize_1.default)();
    const closeModal = (0, react_1.useCallback)(() => {
        setIsVisible(false);
    }, []);
    return (<TwoFactorAuthWrapper_1.default stepName={CONST_1.default.TWO_FACTOR_AUTH_STEPS.ENABLED} title={translate('twoFactorAuth.headerTitle')} shouldEnableKeyboardAvoidingView={false}>
            <ScrollView_1.default>
                <Section_1.default title={translate('twoFactorAuth.twoFactorAuthEnabled')} icon={Illustrations.ShieldYellow} containerStyles={[styles.twoFactorAuthSection, styles.mb0]}>
                    <react_native_1.View style={styles.mv3}>
                        <Text_1.default style={styles.textLabel}>{translate('twoFactorAuth.whatIsTwoFactorAuth')}</Text_1.default>
                    </react_native_1.View>
                </Section_1.default>
                <MenuItem_1.default title={translate('twoFactorAuth.disableTwoFactorAuth')} onPress={() => {
            if ((0, PolicyUtils_1.hasPolicyWithXeroConnection)(currentUserLogin)) {
                setIsVisible(true);
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_2FA_DISABLE);
        }} icon={Expensicons.Close} iconFill={theme.danger}/>
                <ConfirmModal_1.default title={translate('twoFactorAuth.twoFactorAuthCannotDisable')} prompt={translate('twoFactorAuth.twoFactorAuthRequired')} confirmText={translate('common.buttonConfirm')} onConfirm={closeModal} shouldShowCancelButton={false} onBackdropPress={closeModal} onCancel={closeModal} isVisible={isVisible}/>
            </ScrollView_1.default>
        </TwoFactorAuthWrapper_1.default>);
}
EnabledPage.displayName = 'EnabledPage';
exports.default = EnabledPage;
