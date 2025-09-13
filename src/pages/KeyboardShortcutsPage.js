"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const KeyboardShortcut_1 = require("@libs/KeyboardShortcut");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
function KeyboardShortcutsPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const backTo = route.params.backTo;
    const shortcuts = Object.values(CONST_1.default.KEYBOARD_SHORTCUTS)
        .map((shortcut) => {
        const platformAdjustedModifiers = KeyboardShortcut_1.default.getPlatformEquivalentForKeys(shortcut.modifiers);
        return {
            displayName: KeyboardShortcut_1.default.getDisplayName(shortcut.shortcutKey, platformAdjustedModifiers),
            descriptionKey: shortcut.descriptionKey,
        };
    })
        .filter((shortcut) => !!shortcut.descriptionKey);
    /**
     * Render the information of a single shortcut
     * @param shortcut - The shortcut to render
     */
    const renderShortcut = (shortcut) => (<MenuItem_1.default key={shortcut.displayName} title={shortcut.displayName} description={translate(`keyboardShortcutsPage.shortcuts.${shortcut.descriptionKey}`)} wrapperStyle={[styles.ph0, styles.cursorAuto]} interactive={false}/>);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={KeyboardShortcutsPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('keyboardShortcutsPage.title')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                <react_native_1.View style={[styles.ph5, styles.pv3]}>
                    <Text_1.default style={[styles.mb3, styles.webViewStyles.baseFontStyle]}>{translate('keyboardShortcutsPage.subtitle')}</Text_1.default>
                    {shortcuts.map(renderShortcut)}
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
KeyboardShortcutsPage.displayName = 'KeyboardShortcutsPage';
exports.default = KeyboardShortcutsPage;
