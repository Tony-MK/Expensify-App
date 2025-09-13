"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const react_1 = require("react");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const PopoverMenu_1 = require("@components/PopoverMenu");
// eslint-disable-next-line no-restricted-imports
const dark_1 = require("@styles/theme/themes/dark");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/PopoverMenu',
    component: PopoverMenu_1.default,
};
function Template(props) {
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    return (<>
            <MenuItem_1.default title="Add payment Methods" icon={Expensicons.Plus} onPress={toggleVisibility} wrapperStyle={isVisible ? [{ backgroundColor: dark_1.default.border }] : []}/>
            <react_native_safe_area_context_1.SafeAreaProvider>
                <PopoverMenu_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} isVisible={isVisible} onClose={toggleVisibility} onItemSelected={toggleVisibility} menuItems={[
            {
                text: 'Bank account',
                icon: Expensicons.Bank,
                onSelected: toggleVisibility,
            },
            {
                text: 'Debit card',
                icon: Expensicons.CreditCard,
                onSelected: toggleVisibility,
            },
        ]}/>
            </react_native_safe_area_context_1.SafeAreaProvider>
        </>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
Default.args = {
    anchorPosition: {
        vertical: 80,
        horizontal: 20,
    },
};
exports.default = story;
