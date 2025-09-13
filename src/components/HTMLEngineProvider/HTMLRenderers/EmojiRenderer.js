"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const EmojiWithTooltip_1 = require("@components/EmojiWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function EmojiRenderer({ tnode, style: styleProp }) {
    const styles = (0, useThemeStyles_1.default)();
    const style = (0, react_1.useMemo)(() => {
        if ('islarge' in tnode.attributes) {
            return [styleProp, styles.onlyEmojisText];
        }
        if ('ismedium' in tnode.attributes) {
            return [styleProp, styles.emojisWithTextFontSize, styles.verticalAlignTopText];
        }
        return null;
    }, [tnode.attributes, styles, styleProp]);
    return (<EmojiWithTooltip_1.default style={[style, styles.cursorDefault, styles.emojiDefaultStyles]} emojiCode={'data' in tnode ? tnode.data : ''} isMedium={'ismedium' in tnode.attributes}/>);
}
EmojiRenderer.displayName = 'EmojiRenderer';
exports.default = EmojiRenderer;
