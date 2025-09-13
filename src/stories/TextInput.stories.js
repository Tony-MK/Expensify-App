"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxLengthInput = exports.PrefixedInput = exports.AutoGrowHeightInput = exports.AutoGrowInput = exports.PlaceholderInput = exports.ForceActiveLabel = exports.ErrorInput = exports.DefaultValueInput = exports.DefaultInput = exports.AutoFocus = void 0;
exports.HintAndErrorInput = HintAndErrorInput;
const react_1 = require("react");
const TextInput_1 = require("@components/TextInput");
const variables_1 = require("@styles/variables");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/TextInput',
    component: TextInput_1.default,
};
function Template(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <TextInput_1.default {...props}/>;
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const AutoFocus = Template.bind({});
exports.AutoFocus = AutoFocus;
AutoFocus.args = {
    label: 'Auto-focused text input',
    name: 'AutoFocus',
    autoFocus: true,
};
const DefaultInput = Template.bind({});
exports.DefaultInput = DefaultInput;
DefaultInput.args = {
    label: 'Default text input',
    name: 'Default',
};
const DefaultValueInput = Template.bind({});
exports.DefaultValueInput = DefaultValueInput;
DefaultValueInput.args = {
    label: 'Default value input',
    name: 'DefaultValue',
    defaultValue: 'My default value',
};
const ErrorInput = Template.bind({});
exports.ErrorInput = ErrorInput;
ErrorInput.args = {
    label: 'Error input',
    name: 'InputWithError',
    errorText: "Oops! Looks like there's an error",
};
const ForceActiveLabel = Template.bind({});
exports.ForceActiveLabel = ForceActiveLabel;
ForceActiveLabel.args = {
    label: 'Force active label',
    placeholder: 'My placeholder text',
    forceActiveLabel: true,
};
const PlaceholderInput = Template.bind({});
exports.PlaceholderInput = PlaceholderInput;
PlaceholderInput.args = {
    label: 'Placeholder input',
    name: 'Placeholder',
    placeholder: 'My placeholder text',
};
const PrefixedInput = Template.bind({});
exports.PrefixedInput = PrefixedInput;
PrefixedInput.args = {
    label: 'Prefixed input',
    name: 'Prefixed',
    placeholder: 'My placeholder text',
    prefixCharacter: '@',
};
const MaxLengthInput = Template.bind({});
exports.MaxLengthInput = MaxLengthInput;
MaxLengthInput.args = {
    label: 'MaxLength input',
    name: 'MaxLength',
    placeholder: 'My placeholder text',
    maxLength: 50,
};
function HintAndErrorInput(props) {
    const [error, setError] = (0, react_1.useState)('');
    return (<TextInput_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onChangeText={(value) => {
            if (value && value.toLowerCase() === 'oops!') {
                setError("Oops! Looks like there's an error");
                return;
            }
            setError('');
        }} errorText={error}/>);
}
HintAndErrorInput.args = {
    label: 'HintAndError input',
    name: 'HintAndError',
    placeholder: 'My placeholder text',
    hint: 'Type "Oops!" to see the error',
};
// To use autoGrow we need to control the TextInput's value
function AutoGrowSupportInput(props) {
    const [value, setValue] = (0, react_1.useState)(props.value ?? '');
    react_1.default.useEffect(() => {
        setValue(props.value ?? '');
    }, [props.value]);
    return (<TextInput_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onChangeText={setValue} value={value}/>);
}
const AutoGrowInput = AutoGrowSupportInput.bind({});
exports.AutoGrowInput = AutoGrowInput;
AutoGrowInput.args = {
    label: 'Auto grow input',
    name: 'AutoGrow',
    placeholder: 'My placeholder text',
    autoGrow: true,
    textInputContainerStyles: [
        {
            minWidth: 150,
            maxWidth: 500,
        },
    ],
    value: '',
};
const AutoGrowHeightInput = AutoGrowSupportInput.bind({});
exports.AutoGrowHeightInput = AutoGrowHeightInput;
AutoGrowHeightInput.args = {
    label: 'Auto grow height input',
    name: 'AutoGrowHeight',
    placeholder: 'My placeholder text',
    autoGrowHeight: true,
    maxAutoGrowHeight: variables_1.default.textInputAutoGrowMaxHeight,
};
exports.default = story;
