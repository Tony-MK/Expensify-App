"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const App_1 = require("@userActions/App");
const LOCALES_1 = require("@src/CONST/LOCALES");
function LanguagePage() {
    const { translate, preferredLocale } = (0, useLocalize_1.default)();
    const isOptionSelected = (0, react_1.useRef)(false);
    const locales = (0, react_1.useMemo)(() => {
        return LOCALES_1.SORTED_LOCALES.map((locale) => ({
            value: locale,
            text: LOCALES_1.LOCALE_TO_LANGUAGE_STRING[locale],
            keyForList: locale,
            isSelected: preferredLocale === locale,
        }));
    }, [preferredLocale]);
    const updateLanguage = (selectedLanguage) => {
        if (isOptionSelected.current) {
            return;
        }
        isOptionSelected.current = true;
        (0, App_1.setLocale)(selectedLanguage.value, preferredLocale);
        Navigation_1.default.goBack();
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={LanguagePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('languagePage.language')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <FullPageOfflineBlockingView_1.default>
                <SelectionList_1.default sections={[{ data: locales }]} ListItem={RadioListItem_1.default} onSelectRow={updateLanguage} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={locales.find((locale) => locale.isSelected)?.keyForList}/>
            </FullPageOfflineBlockingView_1.default>
        </ScreenWrapper_1.default>);
}
LanguagePage.displayName = 'LanguagePage';
exports.default = LanguagePage;
