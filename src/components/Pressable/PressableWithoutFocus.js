"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const GenericPressable_1 = require("./GenericPressable");
/**
 * This component prevents the tapped element from capturing focus.
 * We need to blur this element when clicked as it opens modal that implements focus-trapping.
 * When the modal is closed it focuses back to the last active element.
 * Therefore it shifts the element to bring it back to focus.
 * https://github.com/Expensify/App/issues/6806
 */
function PressableWithoutFocus({ children, onPress, onLongPress, ...rest }) {
    const ref = (0, react_1.useRef)(null);
    const pressAndBlur = () => {
        ref?.current?.blur();
        onPress?.();
    };
    return (<GenericPressable_1.default onPress={pressAndBlur} onLongPress={onLongPress} ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
            {children}
        </GenericPressable_1.default>);
}
PressableWithoutFocus.displayName = 'PressableWithoutFocus';
exports.default = PressableWithoutFocus;
