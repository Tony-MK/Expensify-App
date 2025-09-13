"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disabled = exports.ErrorStory = exports.PickerWithValue = exports.Default = void 0;
const react_1 = require("react");
const Picker_1 = require("@components/Picker");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/Picker',
    component: Picker_1.default,
};
function Template(props) {
    const [value, setValue] = (0, react_1.useState)('');
    return (<Picker_1.default value={value} onInputChange={(e) => setValue(e)} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
Default.args = {
    label: 'Default picker',
    hintText: 'Default hint text',
    items: [
        {
            label: 'Orange',
            value: 'orange',
        },
        {
            label: 'Apple',
            value: 'apple',
        },
    ],
};
const PickerWithValue = Template.bind({});
exports.PickerWithValue = PickerWithValue;
PickerWithValue.args = {
    label: 'Picker with defined value',
    value: 'apple',
    hintText: 'Picker with hint text',
    items: [
        {
            label: 'Orange',
            value: 'orange',
        },
        {
            label: 'Apple',
            value: 'apple',
        },
    ],
};
const ErrorStory = Template.bind({});
exports.ErrorStory = ErrorStory;
ErrorStory.args = {
    label: 'Picker with error',
    hintText: 'Picker hint text',
    errorText: 'This field has an error.',
    items: [
        {
            label: 'Orange',
            value: 'orange',
        },
        {
            label: 'Apple',
            value: 'apple',
        },
    ],
};
const Disabled = Template.bind({});
exports.Disabled = Disabled;
Disabled.args = {
    label: 'Picker disabled',
    value: 'orange',
    isDisabled: true,
    hintText: 'Picker hint text',
    items: [
        {
            label: 'Orange',
            value: 'orange',
        },
        {
            label: 'Apple',
            value: 'apple',
        },
    ],
};
exports.default = story;
