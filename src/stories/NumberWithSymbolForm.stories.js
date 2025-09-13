"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const react_1 = require("react");
const Button_1 = require("@components/Button");
const NumberWithSymbolForm_1 = require("@components/NumberWithSymbolForm");
const ScrollView_1 = require("@components/ScrollView");
const withNavigationFallback_1 = require("@components/withNavigationFallback");
// eslint-disable-next-line no-restricted-imports
const index_1 = require("@styles/index");
const CONST_1 = require("@src/CONST");
const NumberWithSymbolFormWithNavigation = (0, withNavigationFallback_1.default)(NumberWithSymbolForm_1.default);
const story = {
    title: 'Components/NumberWithSymbolForm',
    component: NumberWithSymbolFormWithNavigation,
};
function Template(props) {
    return (<ScrollView_1.default contentContainerStyle={index_1.defaultStyles.flexGrow1}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <NumberWithSymbolFormWithNavigation {...props}/>
        </ScrollView_1.default>);
}
const Default = Template.bind({});
exports.Default = Default;
Default.args = {
    value: '',
    symbol: CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS,
    symbolPosition: CONST_1.default.TEXT_INPUT_SYMBOL_POSITION.SUFFIX,
    isSymbolPressable: false,
    symbolTextStyle: index_1.defaultStyles.textSupporting,
    style: index_1.defaultStyles.iouAmountTextInput,
    containerStyle: index_1.defaultStyles.iouAmountTextInputContainer,
    footer: (<Button_1.default success large text="Submit" onPress={() => {
            alert('Submitted');
        }}/>),
};
exports.default = story;
