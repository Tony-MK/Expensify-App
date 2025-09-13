"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const textRef_1 = require("@src/types/utils/textRef");
function TextInputLabel({ for: inputId = '', label, labelTranslateY, labelScale, isMultiline }) {
    const styles = (0, useThemeStyles_1.default)();
    const labelRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!inputId || !labelRef.current || !('setAttribute' in labelRef.current)) {
            return;
        }
        labelRef.current.setAttribute('for', inputId);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => styles.textInputLabelTransformation(labelTranslateY, labelScale));
    return (<react_native_reanimated_1.default.Text numberOfLines={!isMultiline ? 1 : undefined} ellipsizeMode={!isMultiline ? 'tail' : undefined} 
    // eslint-disable-next-line react-compiler/react-compiler
    ref={(0, textRef_1.default)(labelRef)} role={CONST_1.default.ROLE.PRESENTATION} style={[styles.textInputLabelContainer, styles.textInputLabel, animatedStyle, styles.pointerEventsNone]}>
            {label}
        </react_native_reanimated_1.default.Text>);
}
TextInputLabel.displayName = 'TextInputLabel';
exports.default = react_1.default.memo(TextInputLabel);
