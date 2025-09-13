"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const DomUtils_1 = require("@libs/DomUtils");
const Visibility_1 = require("@libs/Visibility");
const BaseTextInput_1 = require("./BaseTextInput");
const styleConst = require("./styleConst");
function TextInput({ ref, ...props }) {
    const styles = (0, useThemeStyles_1.default)();
    const textInputRef = (0, react_1.useRef)(null);
    const removeVisibilityListenerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let removeVisibilityListener = removeVisibilityListenerRef.current;
        if (props.disableKeyboard) {
            textInputRef.current?.setAttribute('inputmode', 'none');
        }
        if (props.name) {
            textInputRef.current?.setAttribute('name', props.name);
        }
        removeVisibilityListener = Visibility_1.default.onVisibilityChange(() => {
            if (!(0, Browser_1.isMobileChrome)() || !Visibility_1.default.isVisible() || !textInputRef.current || DomUtils_1.default.getActiveElement() !== textInputRef.current) {
                return;
            }
            textInputRef.current.blur();
            textInputRef.current.focus();
        });
        return () => {
            if (!removeVisibilityListener) {
                return;
            }
            removeVisibilityListener();
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const isLabeledMultiline = !!props.label?.length && props.multiline;
    const labelAnimationStyle = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--active-label-translate-y': `${styleConst.ACTIVE_LABEL_TRANSLATE_Y}px`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--active-label-scale': `${styleConst.ACTIVE_LABEL_SCALE}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--label-transition-duration': `${styleConst.LABEL_ANIMATION_DURATION}ms`,
    };
    return (<BaseTextInput_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={(element) => {
            textInputRef.current = element;
            if (!ref) {
                return;
            }
            if (typeof ref === 'function') {
                ref(element);
                return;
            }
            // eslint-disable-next-line no-param-reassign
            ref.current = element;
        }} inputStyle={[styles.baseTextInput, styles.textInputDesktop, isLabeledMultiline ? styles.textInputMultiline : {}, props.inputStyle]} textInputContainerStyles={[labelAnimationStyle, props.textInputContainerStyles]}/>);
}
TextInput.displayName = 'TextInput';
exports.default = TextInput;
