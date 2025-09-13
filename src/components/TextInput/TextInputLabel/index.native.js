"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function TextInputLabel({ label, labelScale, labelTranslateY, isMultiline }) {
    const styles = (0, useThemeStyles_1.default)();
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => styles.textInputLabelTransformation(labelTranslateY, labelScale));
    const animatedStyleForText = (0, react_native_reanimated_1.useAnimatedStyle)(() => styles.textInputLabelTransformation(labelTranslateY, labelScale, true));
    return (<react_native_reanimated_1.default.View style={[styles.textInputLabelContainer, animatedStyle]}>
            <react_native_reanimated_1.default.Text numberOfLines={!isMultiline ? 1 : undefined} ellipsizeMode={!isMultiline ? 'tail' : undefined} allowFontScaling={false} style={[styles.textInputLabel, animatedStyleForText]}>
                {label}
            </react_native_reanimated_1.default.Text>
        </react_native_reanimated_1.default.View>);
}
TextInputLabel.displayName = 'TextInputLabel';
exports.default = TextInputLabel;
