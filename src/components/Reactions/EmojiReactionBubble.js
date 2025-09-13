"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const Text_1 = require("@components/Text");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function EmojiReactionBubble({ onPress, onReactionListOpen = () => { }, emojiCodes, hasUserReacted = false, count = 0, isContextMenu = false, shouldBlockReactions = false }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<PressableWithSecondaryInteraction_1.default style={({ hovered, pressed }) => [
            styles.emojiReactionBubble,
            StyleUtils.getEmojiReactionBubbleStyle(hovered || pressed, hasUserReacted, isContextMenu),
            shouldBlockReactions && styles.cursorDisabled,
            styles.userSelectNone,
        ]} onPress={() => {
            if (shouldBlockReactions) {
                return;
            }
            onPress();
        }} onSecondaryInteraction={onReactionListOpen} ref={ref} enableLongPressWithHover={shouldUseNarrowLayout} onMouseDown={(event) => {
            // Allow text input blur when emoji reaction is right clicked
            if (event?.button === 2) {
                return;
            }
            // Prevent text input blur when emoji reaction is left clicked
            event.preventDefault();
        }} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={emojiCodes.join('')} accessible dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
            <Text_1.default style={[styles.emojiReactionBubbleText, StyleUtils.getEmojiReactionBubbleTextStyle(isContextMenu)]}>{emojiCodes.join('')}</Text_1.default>
            {count > 0 && <Text_1.default style={[styles.reactionCounterText, StyleUtils.getEmojiReactionCounterTextStyle(hasUserReacted)]}>{count}</Text_1.default>}
        </PressableWithSecondaryInteraction_1.default>);
}
EmojiReactionBubble.displayName = 'EmojiReactionBubble';
exports.default = react_1.default.forwardRef(EmojiReactionBubble);
