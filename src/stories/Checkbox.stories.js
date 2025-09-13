"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const react_1 = require("react");
const Checkbox_1 = require("@components/Checkbox");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/Checkbox',
    component: Checkbox_1.default,
};
function Template(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Checkbox_1.default {...props}/>;
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
Default.args = {
    onPress: () => { },
    isChecked: true,
    accessibilityLabel: '',
};
exports.default = story;
