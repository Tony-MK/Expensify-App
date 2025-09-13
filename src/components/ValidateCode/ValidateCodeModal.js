"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ExpensifyWordmark_1 = require("@components/ExpensifyWordmark");
const Icon_1 = require("@components/Icon");
const Illustrations_1 = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ValidateCodeModal({ code, accountID }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
    const signInHere = (0, react_1.useCallback)(() => (0, Session_1.signInWithValidateCode)(accountID, code), [accountID, code]);
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<FullPageNotFoundView_1.default testID="validate-code-not-found" shouldShow={!(0, ValidationUtils_1.isValidValidateCode)(code)} shouldShowBackButton={shouldUseNarrowLayout} onLinkPress={() => {
            Navigation_1.default.goBack();
        }}>
            <react_native_1.View style={styles.deeplinkWrapperContainer} testID="validate-code">
                <react_native_1.View style={styles.deeplinkWrapperMessage}>
                    <react_native_1.View style={styles.mb2}>
                        <Icon_1.default width={variables_1.default.modalTopIconWidth} height={variables_1.default.modalTopIconHeight} src={Illustrations_1.MagicCode}/>
                    </react_native_1.View>
                    <Text_1.default style={[styles.textHeadline, styles.textXXLarge, styles.textAlignCenter]}>{translate('validateCodeModal.title')}</Text_1.default>
                    <react_native_1.View style={[styles.mt2, styles.mb2]}>
                        <Text_1.default style={styles.textAlignCenter}>
                            {translate('validateCodeModal.description')}
                            {!session?.authToken && (<>
                                    {translate('validateCodeModal.or')} <TextLink_1.default onPress={signInHere}>{translate('validateCodeModal.signInHere')}</TextLink_1.default>
                                </>)}
                            .
                        </Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={styles.mt6}>
                        <Text_1.default style={styles.validateCodeDigits}>{code}</Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mt6]}>
                        <Text_1.default style={styles.textAlignCenter}>{translate('validateCodeModal.doNotShare')}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={styles.deeplinkWrapperFooter}>
                    <Icon_1.default width={variables_1.default.modalWordmarkWidth} height={variables_1.default.modalWordmarkHeight} fill={theme.success} src={ExpensifyWordmark_1.default}/>
                </react_native_1.View>
            </react_native_1.View>
        </FullPageNotFoundView_1.default>);
}
ValidateCodeModal.displayName = 'ValidateCodeModal';
exports.default = ValidateCodeModal;
