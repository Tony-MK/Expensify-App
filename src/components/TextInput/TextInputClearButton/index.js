"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function TextInputClearButton({ style, onPressButton }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Tooltip_1.default text={translate('common.clear')}>
            <Pressable_1.PressableWithoutFeedback style={[styles.mt4, styles.mh1, style]} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.clear')} onMouseDown={(e) => {
            e.preventDefault();
        }} onPress={onPressButton}>
                <Icon_1.default src={Expensicons.Clear} width={20} height={20} fill={theme.icon}/>
            </Pressable_1.PressableWithoutFeedback>
        </Tooltip_1.default>);
}
TextInputClearButton.displayName = 'TextInputClearButton';
exports.default = TextInputClearButton;
