"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
/** This is a special Pressable that calls onSecondaryInteraction when LongPressed. */
function PressableWithSecondaryInteraction({ children, onSecondaryInteraction, inline = false, needsOffscreenAlphaCompositing = false, suppressHighlighting = false, activeOpacity = 1, preventDefaultContextMenu, withoutFocusOnSecondaryInteraction, enableLongPressWithHover, ref, ...rest }) {
    const executeSecondaryInteraction = (event) => {
        event.preventDefault();
        onSecondaryInteraction?.(event);
    };
    // Use Text node for inline mode to prevent content overflow.
    if (inline) {
        return (<Text_1.default 
        // ESLint is disabled here to propagate all the props, enhancing PressableWithSecondaryInteraction's versatility across different use cases.
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest} suppressHighlighting={suppressHighlighting} onLongPress={onSecondaryInteraction ? executeSecondaryInteraction : undefined}>
                {children}
            </Text_1.default>);
    }
    return (<PressableWithFeedback_1.default 
    // ESLint is disabled here to propagate all the props, enhancing PressableWithSecondaryInteraction's versatility across different use cases.
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} ref={ref} onLongPress={onSecondaryInteraction ? executeSecondaryInteraction : undefined} needsOffscreenAlphaCompositing={needsOffscreenAlphaCompositing} pressDimmingValue={activeOpacity}>
            {children}
        </PressableWithFeedback_1.default>);
}
PressableWithSecondaryInteraction.displayName = 'PressableWithSecondaryInteraction';
exports.default = PressableWithSecondaryInteraction;
