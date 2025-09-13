"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const PressableWithSecondaryInteraction_1 = require("./PressableWithSecondaryInteraction");
const Text_1 = require("./Text");
/**
 * A text component that copies the text to the clipboard when pressed.
 * This is different from the `copyValueToClipboard` component in that
 * here the copy functionality is incorporated into the text itself.
 * Long press this text to toggle the context menu containing the copy option.
 */
function TextWithCopy({ children, copyValue, ...rest }) {
    const popoverAnchor = (0, react_1.useRef)(null);
    const styles = (0, useThemeStyles_1.default)();
    const showCopyContextMenu = (event) => {
        if (!copyValue) {
            return;
        }
        (0, ReportActionContextMenu_1.showContextMenu)({
            type: CONST_1.default.CONTEXT_MENU_TYPES.TEXT,
            event,
            selection: copyValue,
            contextMenuAnchor: popoverAnchor.current,
        });
    };
    return (<PressableWithSecondaryInteraction_1.default ref={popoverAnchor} onSecondaryInteraction={showCopyContextMenu} accessibilityLabel={copyValue} accessible style={styles.cursorDefault}>
            <Text_1.default selectable={false} numberOfLines={1} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
                {children}
            </Text_1.default>
        </PressableWithSecondaryInteraction_1.default>);
}
exports.default = TextWithCopy;
