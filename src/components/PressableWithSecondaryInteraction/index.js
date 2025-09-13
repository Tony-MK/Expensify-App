"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
/** This is a special Pressable that calls onSecondaryInteraction when LongPressed, or right-clicked. */
function PressableWithSecondaryInteraction({ children, inline = false, style, wrapperStyle, enableLongPressWithHover = false, withoutFocusOnSecondaryInteraction = false, needsOffscreenAlphaCompositing = false, preventDefaultContextMenu = true, onSecondaryInteraction, activeOpacity = 1, opacityAnimationDuration, ref, ...rest }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const pressableRef = (0, react_1.useRef)(null);
    const executeSecondaryInteraction = (event) => {
        if ((0, DeviceCapabilities_1.hasHoverSupport)() && !enableLongPressWithHover) {
            return;
        }
        if (withoutFocusOnSecondaryInteraction && pressableRef.current) {
            pressableRef.current.blur();
        }
        onSecondaryInteraction?.(event);
    };
    (0, react_1.useEffect)(() => {
        if (!pressableRef.current) {
            return;
        }
        if (ref) {
            if (typeof ref === 'function') {
                ref(pressableRef.current);
            }
            else if (typeof ref === 'object') {
                // eslint-disable-next-line no-param-reassign
                ref.current = pressableRef.current;
            }
        }
        const element = pressableRef.current;
        /**
         * @param event - A right-click MouseEvent.
         * https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event
         */
        const executeSecondaryInteractionOnContextMenu = (event) => {
            if (!onSecondaryInteraction) {
                return;
            }
            event.stopPropagation();
            if (preventDefaultContextMenu) {
                event.preventDefault();
            }
            onSecondaryInteraction(event);
            /**
             * This component prevents the tapped element from capturing focus.
             * We need to blur this element when clicked as it opens modal that implements focus-trapping.
             * When the modal is closed it focuses back to the last active element.
             * Therefore it shifts the element to bring it back to focus.
             * https://github.com/Expensify/App/issues/14148
             */
            if (withoutFocusOnSecondaryInteraction) {
                element.blur();
            }
        };
        element.addEventListener('contextmenu', executeSecondaryInteractionOnContextMenu);
        return () => {
            element.removeEventListener('contextmenu', executeSecondaryInteractionOnContextMenu);
        };
    }, [ref, onSecondaryInteraction, preventDefaultContextMenu, withoutFocusOnSecondaryInteraction]);
    const inlineStyle = inline ? styles.dInline : {};
    // On Web, Text does not support LongPress events thus manage inline mode with styling instead of using Text.
    return (<PressableWithFeedback_1.default 
    // ESLint is disabled here to propagate all the props, enhancing PressableWithSecondaryInteraction's versatility across different use cases.
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} wrapperStyle={[StyleUtils.combineStyles((0, DeviceCapabilities_1.canUseTouchScreen)() ? [styles.userSelectNone, styles.noSelect] : [], inlineStyle), wrapperStyle]} onLongPress={onSecondaryInteraction ? executeSecondaryInteraction : undefined} pressDimmingValue={activeOpacity} dimAnimationDuration={opacityAnimationDuration} ref={pressableRef} style={(state) => [StyleUtils.parseStyleFromFunction(style, state), inlineStyle]} needsOffscreenAlphaCompositing={needsOffscreenAlphaCompositing}>
            {children}
        </PressableWithFeedback_1.default>);
}
PressableWithSecondaryInteraction.displayName = 'PressableWithSecondaryInteraction';
exports.default = PressableWithSecondaryInteraction;
