"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OpacityView_1 = require("@components/OpacityView");
const variables_1 = require("@styles/variables");
const GenericPressable_1 = require("./GenericPressable");
function PressableWithFeedback({ children, wrapperStyle = [], needsOffscreenAlphaCompositing = false, pressDimmingValue = variables_1.default.pressDimValue, hoverDimmingValue = variables_1.default.hoverDimValue, dimAnimationDuration, shouldBlendOpacity, ref, ...rest }) {
    const [isPressed, setIsPressed] = (0, react_1.useState)(false);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    return (<OpacityView_1.default shouldDim={!shouldBlendOpacity && !!(!rest.disabled && (isPressed || isHovered))} dimmingValue={isPressed ? pressDimmingValue : hoverDimmingValue} dimAnimationDuration={dimAnimationDuration} style={wrapperStyle} needsOffscreenAlphaCompositing={needsOffscreenAlphaCompositing}>
            <GenericPressable_1.default ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} disabled={rest.disabled} onHoverIn={(event) => {
            setIsHovered(true);
            if (rest.onHoverIn) {
                rest.onHoverIn(event);
            }
        }} onHoverOut={(event) => {
            setIsHovered(false);
            if (rest.onHoverOut) {
                rest.onHoverOut(event);
            }
        }} onPressIn={(event) => {
            setIsPressed(true);
            if (rest.onPressIn) {
                rest.onPressIn(event);
            }
        }} onPressOut={(event) => {
            setIsPressed(false);
            if (rest.onPressOut) {
                rest.onPressOut(event);
            }
        }}>
                {(state) => (typeof children === 'function' ? children(state) : children)}
            </GenericPressable_1.default>
        </OpacityView_1.default>);
}
PressableWithFeedback.displayName = 'PressableWithFeedback';
exports.default = PressableWithFeedback;
