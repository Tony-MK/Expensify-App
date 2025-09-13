"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccountUtils_1 = require("@libs/AccountUtils");
const App_1 = require("@userActions/App");
const LOCALES_1 = require("@src/CONST/LOCALES");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Picker_1 = require("./Picker");
function LocalePicker({ size = 'normal' }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [preferredLocale] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const locales = (0, react_1.useMemo)(() => {
        const sortedLocales = LOCALES_1.SORTED_LOCALES;
        return sortedLocales.map((locale) => ({
            value: locale,
            label: LOCALES_1.LOCALE_TO_LANGUAGE_STRING[locale],
            keyForList: locale,
            isSelected: preferredLocale === locale,
        }));
    }, [preferredLocale]);
    const shouldDisablePicker = AccountUtils_1.default.isValidateCodeFormSubmitting(account);
    return (<Picker_1.default label={size === 'normal' ? translate('languagePage.language') : null} onInputChange={(locale) => (0, App_1.setLocale)(locale, preferredLocale)} isDisabled={shouldDisablePicker} items={locales} shouldAllowDisabledStyle={false} shouldShowOnlyTextWhenDisabled={false} size={size} value={preferredLocale} containerStyles={size === 'small' ? styles.pickerContainerSmall : {}} backgroundColor={theme.signInPage}/>);
}
LocalePicker.displayName = 'LocalePicker';
exports.default = LocalePicker;
