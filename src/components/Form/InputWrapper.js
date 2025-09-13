"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RoomNameInput_1 = require("@components/RoomNameInput");
const TextInput_1 = require("@components/TextInput");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const FormContext_1 = require("./FormContext");
const textInputBasedComponents = [TextInput_1.default, RoomNameInput_1.default];
function computeComponentSpecificRegistrationParams({ InputComponent, shouldSubmitForm, multiline, autoGrowHeight, blurOnSubmit, }) {
    if (textInputBasedComponents.includes(InputComponent)) {
        const isEffectivelyMultiline = !!multiline || !!autoGrowHeight;
        // If the user can use the hardware keyboard, they have access to an alternative way of inserting a new line
        // (like a Shift+Enter keyboard shortcut). For simplicity, we assume that when there's no touch screen, it's a
        // desktop setup with a keyboard.
        const canUseHardwareKeyboard = !(0, DeviceCapabilities_1.canUseTouchScreen)();
        // We want to avoid a situation when the user can't insert a new line. For single-line inputs, it's not a problem and we
        // force-enable form submission. For multi-line inputs, ensure that it was requested to enable form submission for this specific
        // input and that alternative ways exist to add a new line.
        const shouldReallySubmitForm = isEffectivelyMultiline ? !!shouldSubmitForm && canUseHardwareKeyboard : true;
        return {
            // There are inputs that don't have onBlur methods, to simulate the behavior of onBlur in e.g. checkbox, we had to
            // use different methods like onPress. This introduced a problem that inputs that have the onBlur method were
            // calling some methods too early or twice, so we had to add this check to prevent that side effect.
            // For now this side effect happened only in `TextInput` components.
            shouldSetTouchedOnBlurOnly: true,
            blurOnSubmit: (isEffectivelyMultiline && shouldReallySubmitForm) || blurOnSubmit,
            shouldSubmitForm: shouldReallySubmitForm,
        };
    }
    return {
        shouldSetTouchedOnBlurOnly: false,
        // Forward the originally provided value
        blurOnSubmit,
        shouldSubmitForm: !!shouldSubmitForm,
    };
}
function InputWrapper({ ref, ...props }) {
    const { InputComponent, inputID, valueType = 'string', shouldSubmitForm: propShouldSubmitForm, ...rest } = props;
    const { registerInput } = (0, react_1.useContext)(FormContext_1.default);
    const { shouldSetTouchedOnBlurOnly, blurOnSubmit, shouldSubmitForm } = computeComponentSpecificRegistrationParams(props);
    // eslint-disable-next-line react-compiler/react-compiler
    const { key, ...registerInputProps } = registerInput(inputID, shouldSubmitForm, { ref, valueType, ...rest, shouldSetTouchedOnBlurOnly, blurOnSubmit });
    return (<InputComponent key={key} 
    // TODO: Sometimes we return too many props with register input, so we need to consider if it's better to make the returned type more general and disregard the issue, or we would like to omit the unused props somehow.
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...registerInputProps}/>);
}
InputWrapper.displayName = 'InputWrapper';
exports.default = InputWrapper;
