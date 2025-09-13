"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useSidePanel_1 = require("@hooks/useSidePanel");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function HelpButton({ style }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { openSidePanel, shouldHideHelpButton } = (0, useSidePanel_1.default)();
    if (shouldHideHelpButton) {
        return null;
    }
    return (<Tooltip_1.default text={translate('common.help')}>
            <Pressable_1.PressableWithoutFeedback accessibilityLabel={translate('common.help')} style={[styles.flexRow, styles.touchableButtonImage, style]} onPress={openSidePanel}>
                <Icon_1.default src={Expensicons.QuestionMark} fill={theme.icon}/>
            </Pressable_1.PressableWithoutFeedback>
        </Tooltip_1.default>);
}
HelpButton.displayName = 'HelpButtonBase';
exports.default = HelpButton;
