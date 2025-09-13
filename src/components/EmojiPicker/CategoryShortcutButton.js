"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function CategoryShortcutButton({ code, icon, onPress }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isHighlighted, setIsHighlighted] = (0, react_1.useState)(false);
    return (<Tooltip_1.default text={translate(`emojiPicker.headers.${code}`)} shiftVertical={-4}>
            <PressableWithoutFeedback_1.default shouldUseAutoHitSlop={false} onPress={onPress} onHoverIn={() => setIsHighlighted(true)} onHoverOut={() => setIsHighlighted(false)} style={({ pressed }) => [StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(false, pressed)), styles.categoryShortcutButton, isHighlighted && styles.emojiItemHighlighted]} accessibilityLabel={`emojiPicker.headers.${code}`} role={CONST_1.default.ROLE.BUTTON}>
                <Icon_1.default fill={theme.icon} src={icon} height={variables_1.default.iconSizeNormal} width={variables_1.default.iconSizeNormal}/>
            </PressableWithoutFeedback_1.default>
        </Tooltip_1.default>);
}
CategoryShortcutButton.displayName = 'CategoryShortcutButton';
exports.default = react_1.default.memo(CategoryShortcutButton);
