"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = exports.RightIconAndDescriptionWithLabel = exports.BrickRoadIndicatorFailure = exports.BrickRoadIndicatorInfo = exports.Disabled = exports.Focused = exports.BadgeText = exports.Selected = exports.RightIconAndDescription = exports.RightIcon = exports.Description = exports.Default = void 0;
const react_1 = require("react");
const chase_svg_1 = require("@assets/images/bank-icons/chase.svg");
const MenuItem_1 = require("@components/MenuItem");
const variables_1 = require("@styles/variables");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/MenuItem',
    component: MenuItem_1.default,
    args: {
        interactive: true,
    },
};
function Template(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MenuItem_1.default {...props}/>;
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
Default.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
};
const Description = Template.bind({});
exports.Description = Description;
Description.args = {
    title: 'Alberta Bobbeth Charleson',
    description: 'Account ending in 1111',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
};
const RightIcon = Template.bind({});
exports.RightIcon = RightIcon;
RightIcon.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
};
const RightIconAndDescription = Template.bind({});
exports.RightIconAndDescription = RightIconAndDescription;
RightIconAndDescription.args = {
    title: 'Alberta Bobbeth Charleson',
    description: 'Account ending in 1111',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
};
const RightIconAndDescriptionWithLabel = Template.bind({});
exports.RightIconAndDescriptionWithLabel = RightIconAndDescriptionWithLabel;
RightIconAndDescriptionWithLabel.args = {
    label: 'Account number',
    title: 'Alberta Bobbeth Charleson',
    description: 'Account ending in 1111',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
};
const Selected = Template.bind({});
exports.Selected = Selected;
Selected.args = {
    title: 'Alberta Bobbeth Charleson',
    description: 'Account ending in 1111',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowSelectedState: true,
    isSelected: true,
};
const BadgeText = Template.bind({});
exports.BadgeText = BadgeText;
BadgeText.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
    badgeText: '$0.00',
};
const Focused = Template.bind({});
exports.Focused = Focused;
Focused.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
    focused: true,
};
const Disabled = Template.bind({});
exports.Disabled = Disabled;
Disabled.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
    disabled: true,
};
const BrickRoadIndicatorInfo = Template.bind({});
exports.BrickRoadIndicatorInfo = BrickRoadIndicatorInfo;
BrickRoadIndicatorInfo.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
    brickRoadIndicator: 'info',
};
const BrickRoadIndicatorFailure = Template.bind({});
exports.BrickRoadIndicatorFailure = BrickRoadIndicatorFailure;
BrickRoadIndicatorFailure.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
    brickRoadIndicator: 'error',
};
const ErrorMessage = Template.bind({});
exports.ErrorMessage = ErrorMessage;
ErrorMessage.args = {
    title: 'Alberta Bobbeth Charleson',
    icon: chase_svg_1.default,
    iconHeight: variables_1.default.iconSizeExtraLarge,
    iconWidth: variables_1.default.iconSizeExtraLarge,
    shouldShowRightIcon: true,
    errorText: 'Error text which describes the error',
    brickRoadIndicator: 'error',
};
exports.default = story;
