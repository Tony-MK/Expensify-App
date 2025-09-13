"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var TextInputLabel_1 = require("@components/TextInput/TextInputLabel");
describe('TextInputLabel', function () {
    var renderLabel = function (props) {
        return (0, react_native_1.render)(<TextInputLabel_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}/>);
    };
    var labelTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var labelScale = (0, react_native_reanimated_1.useSharedValue)(1);
    it('should render label with ellipsizeMode="tail" and numberOfLines=1 when isMultiline is false', function () {
        var longLabel = 'This is a very long label that should be shortened';
        // Render the component with isMultiline=false
        renderLabel({
            label: longLabel,
            isMultiline: false,
            labelTranslateY: labelTranslateY,
            labelScale: labelScale,
        });
        // Find the Animated.Text component by its text content
        var labelElement = react_native_1.screen.getByText(longLabel);
        // Verify the component renders the correct text
        expect(labelElement).toBeTruthy();
        // Verify the props for shortening behavior
        expect(labelElement.props).toHaveProperty('numberOfLines', 1);
        expect(labelElement.props).toHaveProperty('ellipsizeMode', 'tail');
    });
    it('should not apply numberOfLines or ellipsizeMode when isMultiline is true', function () {
        var label = 'Multiline label';
        // Render the component with isMultiline=true
        renderLabel({
            label: label,
            isMultiline: true,
            labelTranslateY: labelTranslateY,
            labelScale: labelScale,
        });
        // Find the Animated.Text component by its text content
        var labelElement = react_native_1.screen.getByText(label);
        // Verify the component renders the correct text
        expect(labelElement).toBeTruthy();
        // Verify that numberOfLines and ellipsizeMode are undefined
        expect(labelElement.props).not.toHaveProperty('numberOfLines');
        expect(labelElement.props).not.toHaveProperty('ellipsizeMode');
    });
});
