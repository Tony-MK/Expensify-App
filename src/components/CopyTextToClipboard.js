"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const Clipboard_1 = require("@libs/Clipboard");
const Expensicons = require("./Icon/Expensicons");
const PressableWithDelayToggle_1 = require("./Pressable/PressableWithDelayToggle");
function CopyTextToClipboard({ text, textStyles, urlToCopy, accessibilityRole, iconHeight, iconStyles, iconWidth, shouldHaveActiveBackground, shouldUseButtonBackground, styles, }) {
    const { translate } = (0, useLocalize_1.default)();
    const copyToClipboard = (0, react_1.useCallback)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing doesn't achieve the same result in this case
        Clipboard_1.default.setString(urlToCopy || text || '');
    }, [text, urlToCopy]);
    return (<PressableWithDelayToggle_1.default text={text} tooltipText={translate('reportActionContextMenu.copyToClipboard')} tooltipTextChecked={translate('reportActionContextMenu.copied')} icon={Expensicons.Copy} textStyles={textStyles} onPress={copyToClipboard} accessible accessibilityLabel={translate('reportActionContextMenu.copyToClipboard')} accessibilityRole={accessibilityRole} shouldHaveActiveBackground={shouldHaveActiveBackground} iconWidth={iconWidth} iconHeight={iconHeight} iconStyles={iconStyles} styles={styles} shouldUseButtonBackground={shouldUseButtonBackground}/>);
}
CopyTextToClipboard.displayName = 'CopyTextToClipboard';
exports.default = CopyTextToClipboard;
