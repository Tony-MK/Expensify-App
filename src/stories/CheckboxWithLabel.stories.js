"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithErrors = exports.WithLabelComponent = exports.Default = void 0;
const react_1 = require("react");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const Text_1 = require("@components/Text");
// eslint-disable-next-line no-restricted-imports
const index_1 = require("@styles/index");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/CheckboxWithLabel',
    component: CheckboxWithLabel_1.default,
};
function Template(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <CheckboxWithLabel_1.default {...props}/>;
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
const WithLabelComponent = Template.bind({});
exports.WithLabelComponent = WithLabelComponent;
const WithErrors = Template.bind({});
exports.WithErrors = WithErrors;
Default.args = {
    isChecked: true,
    label: 'Plain text label',
    onInputChange: () => { },
};
WithLabelComponent.args = {
    isChecked: true,
    onInputChange: () => { },
    LabelComponent: () => (<>
            <Text_1.default style={[index_1.defaultStyles.textLarge]}>Test</Text_1.default>
            <Text_1.default style={[index_1.defaultStyles.textMicroBold]}> Test </Text_1.default>
            <Text_1.default style={[index_1.defaultStyles.textMicroSupporting]}>Test</Text_1.default>
        </>),
};
WithErrors.args = {
    isChecked: false,
    errorText: 'Please accept Terms before continuing.',
    onInputChange: () => { },
    label: 'I accept the Terms & Conditions',
};
exports.default = story;
