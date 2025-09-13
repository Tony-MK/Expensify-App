"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitOnComplete = exports.AutoFocus = void 0;
const react_1 = require("react");
const MagicCodeInput_1 = require("@components/MagicCodeInput");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/MagicCodeInput',
    component: MagicCodeInput_1.default,
};
function Template(props) {
    const [value, setValue] = (0, react_1.useState)('');
    return (<MagicCodeInput_1.default value={value} onChangeText={setValue} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const AutoFocus = Template.bind({});
exports.AutoFocus = AutoFocus;
AutoFocus.args = {
    name: 'AutoFocus',
    autoFocus: true,
    autoComplete: 'one-time-code',
};
const SubmitOnComplete = Template.bind({});
exports.SubmitOnComplete = SubmitOnComplete;
SubmitOnComplete.args = {
    name: 'SubmitOnComplete',
    autoComplete: 'one-time-code',
    shouldSubmitOnComplete: true,
    onFulfill: () => console.debug('Submitted!'),
};
exports.default = story;
