"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlError = exports.Default = void 0;
const react_1 = require("react");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/FormAlertWithSubmitButton',
    component: FormAlertWithSubmitButton_1.default,
};
function Template(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <FormAlertWithSubmitButton_1.default {...props}/>;
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
const HtmlError = Template.bind({});
exports.HtmlError = HtmlError;
const defaultArgs = {
    isAlertVisible: true,
    onSubmit: () => { },
    buttonText: 'Submit',
};
Default.args = defaultArgs;
const html = '<em>This is</em> a <strong>test</strong>. None of <h1>these strings</h1> should display <del>as</del> <div>HTML</div>.';
HtmlError.args = { ...defaultArgs, isMessageHtml: true, message: html };
exports.default = story;
