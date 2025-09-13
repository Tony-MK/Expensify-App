"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Tooltip_1 = require("@components/Tooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function IconButton({ src, fill = 'white', onPress, style, hoverStyle, tooltipText = '', small = false, shouldForceRenderingTooltipBelow = false }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Tooltip_1.default text={tooltipText} shouldForceRenderingBelow={shouldForceRenderingTooltipBelow}>
            <PressableWithFeedback_1.default accessibilityLabel={tooltipText} onPress={onPress} style={[styles.videoIconButton, style]} hoverStyle={[styles.videoIconButtonHovered, hoverStyle]} role={CONST_1.default.ROLE.BUTTON}>
                <Icon_1.default src={src} fill={fill} small={small}/>
            </PressableWithFeedback_1.default>
        </Tooltip_1.default>);
}
IconButton.displayName = 'IconButton';
exports.default = IconButton;
