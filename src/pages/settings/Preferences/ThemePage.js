"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ThemePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [preferredTheme] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_THEME);
    const isOptionSelected = (0, react_1.useRef)(false);
    const { DEFAULT, FALLBACK, ...themes } = CONST_1.default.THEME;
    const localesToThemes = Object.values(themes).map((theme) => ({
        value: theme,
        text: translate(`themePage.themes.${theme}.label`),
        keyForList: theme,
        isSelected: (preferredTheme ?? CONST_1.default.THEME.DEFAULT) === theme,
    }));
    const updateTheme = (selectedTheme) => {
        if (isOptionSelected.current) {
            return;
        }
        isOptionSelected.current = true;
        (0, User_1.updateTheme)(selectedTheme.value);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={ThemePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('themePage.theme')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <Text_1.default style={[styles.mh5, styles.mv4]}>{translate('themePage.chooseThemeBelowOrSync')}</Text_1.default>
            <SelectionList_1.default sections={[{ data: localesToThemes }]} ListItem={RadioListItem_1.default} onSelectRow={updateTheme} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={localesToThemes.find((theme) => theme.isSelected)?.keyForList}/>
        </ScreenWrapper_1.default>);
}
ThemePage.displayName = 'ThemePage';
exports.default = ThemePage;
