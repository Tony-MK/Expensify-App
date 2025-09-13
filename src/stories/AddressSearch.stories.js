"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStory = exports.Default = void 0;
const react_1 = require("react");
const AddressSearch_1 = require("@components/AddressSearch");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/AddressSearch',
    component: AddressSearch_1.default,
    args: {
        label: 'Enter street',
        errorText: '',
    },
};
function Template(props) {
    const [value, setValue] = (0, react_1.useState)('');
    return (<AddressSearch_1.default value={value} onInputChange={(inputValue) => setValue(inputValue)} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
const ErrorStory = Template.bind({});
exports.ErrorStory = ErrorStory;
ErrorStory.args = {
    errorText: 'The street you are looking for does not exist',
};
exports.default = story;
