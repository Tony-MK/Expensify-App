"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
function EmojiWithTooltip({ emojiCode, style = {} }) {
    const { preferredLocale } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const emoji = (0, EmojiUtils_1.findEmojiByCode)(emojiCode);
    const emojiName = (0, EmojiUtils_1.getLocalizedEmojiName)(emoji?.name, preferredLocale);
    const emojiTooltipContent = (0, react_1.useCallback)(() => (<react_native_1.View style={[styles.alignItemsCenter, styles.ph2]}>
                <react_native_1.View style={[styles.flexRow, styles.emojiTooltipWrapper]}>
                    <Text_1.default key={emojiCode} style={styles.onlyEmojisText}>
                        {emojiCode}
                    </Text_1.default>
                </react_native_1.View>
                <Text_1.default style={[styles.textMicro, styles.fontColorReactionLabel]}>{`:${emojiName}:`}</Text_1.default>
            </react_native_1.View>), [emojiCode, emojiName, styles.alignItemsCenter, styles.ph2, styles.flexRow, styles.emojiTooltipWrapper, styles.fontColorReactionLabel, styles.onlyEmojisText, styles.textMicro]);
    return (<Tooltip_1.default renderTooltipContent={emojiTooltipContent}>
            <react_native_1.View style={styles.dInlineBlock}>
                <Text_1.default style={[style, styles.cursorDefault]}>{emojiCode}</Text_1.default>
            </react_native_1.View>
        </Tooltip_1.default>);
}
EmojiWithTooltip.displayName = 'EmojiWithTooltip';
exports.default = EmojiWithTooltip;
