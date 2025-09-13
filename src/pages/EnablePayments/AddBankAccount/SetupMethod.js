"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getPlaidDesktopMessage_1 = require("@libs/getPlaidDesktopMessage");
const BankAccounts = require("@userActions/BankAccounts");
const Link = require("@userActions/Link");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const plaidDesktopMessage = (0, getPlaidDesktopMessage_1.default)();
function SetupMethod() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isPlaidDisabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_PLAID_DISABLED);
    return (<react_native_1.View>
            <Section_1.default icon={Illustrations.MoneyWings} title={translate('walletPage.addYourBankAccount')} titleStyles={[styles.textHeadlineLineHeightXXL]}>
                <react_native_1.View style={[styles.mv3]}>
                    <Text_1.default>{translate('walletPage.addBankAccountBody')}</Text_1.default>
                </react_native_1.View>
                {!!plaidDesktopMessage && (<react_native_1.View style={[styles.mv3, styles.flexRow, styles.justifyContentBetween]}>
                        <TextLink_1.default onPress={() => Link.openExternalLinkWithToken(ROUTES_1.default.SETTINGS_ENABLE_PAYMENTS)}>{translate(plaidDesktopMessage)}</TextLink_1.default>
                    </react_native_1.View>)}
                <Button_1.default icon={Expensicons.Bank} text={translate('bankAccount.addBankAccount')} onPress={() => {
            BankAccounts.openPersonalBankAccountSetupWithPlaid();
        }} isDisabled={!!isPlaidDisabled} style={[styles.mt4, styles.mb2]} iconStyles={styles.buttonCTAIcon} shouldShowRightIcon success large/>
            </Section_1.default>
        </react_native_1.View>);
}
SetupMethod.displayName = 'SetupMethod';
exports.default = SetupMethod;
