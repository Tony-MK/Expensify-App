"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
exports.BaseInteractiveStepSubHeader = BaseInteractiveStepSubHeader;
/* eslint-disable react/jsx-props-no-spreading */
const react_1 = require("react");
const react_native_1 = require("react-native");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/InteractiveStepSubHeader',
    component: InteractiveStepSubHeader_1.default,
};
function Template(args) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <InteractiveStepSubHeader_1.default {...args}/>;
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
function BaseInteractiveStepSubHeader(props) {
    const ref = (0, react_1.useRef)(null);
    return (<react_native_1.View>
            <InteractiveStepSubHeader_1.default {...props} ref={ref}/>
            <react_native_1.Button onPress={() => ref.current?.moveNext()} title="Next"/>
        </react_native_1.View>);
}
const Default = Template.bind({});
exports.Default = Default;
Default.args = {
    stepNames: ['Initial', 'Step 1', 'Step 2', 'Step 3'],
    startStepIndex: 1,
    onStepSelected: () => { },
};
BaseInteractiveStepSubHeader.args = {
    stepNames: ['Initial', 'Step 1', 'Step 2', 'Step 3', 'Confirmation'],
    startStepIndex: 0,
    onStepSelected: () => { },
};
exports.default = story;
