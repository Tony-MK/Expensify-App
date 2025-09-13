"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
function TextWithTooltip({ text, shouldShowTooltip, style, numberOfLines = 1, forwardedFSClass }) {
    const [showTooltip, setShowTooltip] = (0, react_1.useState)(false);
    return (<Tooltip_1.default shouldRender={showTooltip} text={text}>
            <Text_1.default style={style} numberOfLines={numberOfLines} onLayout={(e) => {
            const target = e.nativeEvent.target;
            if (!shouldShowTooltip) {
                return;
            }
            if (target.scrollWidth > target.offsetWidth) {
                setShowTooltip(true);
                return;
            }
            setShowTooltip(false);
        }} fsClass={forwardedFSClass}>
                {text}
            </Text_1.default>
        </Tooltip_1.default>);
}
TextWithTooltip.displayName = 'TextWithTooltip';
exports.default = TextWithTooltip;
