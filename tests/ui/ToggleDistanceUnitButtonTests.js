"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const index_android_1 = require("@components/MapView/ToggleDistanceUnitButton/index.android");
const Text_1 = require("@components/Text");
const CONST_1 = require("@src/CONST");
const onPressMock = jest.fn();
describe('ToggleDistanceUnitButton', () => {
    const renderButton = (props) => (0, react_native_1.render)(<index_android_1.default testID="pressable" accessibilityLabel="fake-button" accessibilityRole={CONST_1.default.ROLE.BUTTON} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
                <Text_1.default>Click me</Text_1.default>
            </index_android_1.default>);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should trigger onPress when tapped quickly', () => {
        // Given the component is rendered
        renderButton({ onPress: onPressMock, accessibilityLabel: 'ToggleDistanceUnitButton' });
        const pressable = react_native_1.screen.getByTestId('pressable');
        // When touch starts on the button
        (0, react_native_1.fireEvent)(pressable, 'touchStart', {
            nativeEvent: {
                pageX: 100,
                pageY: 100,
            },
        });
        // When touch end on the button
        (0, react_native_1.fireEvent)(pressable, 'touchEnd');
        // Then onPress should be called once
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
    test('should not trigger onPress when dragged', () => {
        // Given the component is rendered
        renderButton({ onPress: onPressMock, accessibilityLabel: 'ToggleDistanceUnitButton' });
        const pressable = react_native_1.screen.getByTestId('pressable');
        // When touch start on the button
        (0, react_native_1.fireEvent)(pressable, 'touchStart', {
            nativeEvent: {
                pageX: 100,
                pageY: 100,
            },
        });
        // When the touch moves beyond the threshold (dragging)
        (0, react_native_1.fireEvent)(pressable, 'touchMove', {
            nativeEvent: {
                pageX: 110,
                pageY: 110,
            },
        });
        // When touch end on the button
        (0, react_native_1.fireEvent)(pressable, 'touchEnd');
        // Then onPress should not be called
        expect(onPressMock).not.toHaveBeenCalled();
    });
});
