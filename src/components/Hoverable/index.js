"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const mergeRefs_1 = require("@libs/mergeRefs");
const ValueUtils_1 = require("@libs/ValueUtils");
const ActiveHoverable_1 = require("./ActiveHoverable");
/**
 * It is necessary to create a Hoverable component instead of relying solely on Pressable support for hover state,
 * because nesting Pressables causes issues where the hovered state of the child cannot be easily propagated to the
 * parent. https://github.com/necolas/react-native-web/issues/1875
 */
function Hoverable({ isDisabled, ref, ...props }) {
    // If Hoverable is disabled, just render the child without additional logic or event listeners.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (isDisabled || !(0, DeviceCapabilities_1.hasHoverSupport)()) {
        const child = (0, ValueUtils_1.getReturnValue)(props.children, false);
        // eslint-disable-next-line react-compiler/react-compiler
        return (0, react_1.cloneElement)(child, { ref: (0, mergeRefs_1.default)(ref, child.props.ref) });
    }
    return (<ActiveHoverable_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
exports.default = Hoverable;
