"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const colors_1 = require("@styles/theme/colors");
const Button_1 = require("@src/components/Button");
const CONST_1 = require("@src/CONST");
const buttonText = 'Click me';
const accessibilityLabel = 'button-label';
describe('Button Component', () => {
    const renderButton = (props = {}) => (0, react_native_1.render)(<Button_1.default text={buttonText} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
    const onPress = jest.fn();
    const getButton = () => react_native_1.screen.getByRole(CONST_1.default.ROLE.BUTTON, { name: buttonText });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders correctly with default text', () => {
        // Given the component is rendered
        renderButton();
        // Then the default text is displayed
        expect(react_native_1.screen.getByText(buttonText)).toBeOnTheScreen();
    });
    it('renders without text gracefully', () => {
        // Given the component is rendered without text
        renderButton({ text: undefined });
        // Then the button is not displayed
        expect(react_native_1.screen.queryByText(buttonText)).not.toBeOnTheScreen();
    });
    it('handles press event correctly', () => {
        // Given the component is rendered with an onPress function
        renderButton({ onPress });
        // When the button is pressed
        react_native_1.fireEvent.press(getButton());
        // Then the onPress function should be called
        expect(onPress).toHaveBeenCalledTimes(1);
    });
    it('renders loading state', () => {
        // Given the component is rendered with isLoading
        renderButton({ isLoading: true });
        // Then the loading state is displayed
        expect(react_native_1.screen.getByText(buttonText)).not.toBeVisible();
    });
    it('disables button when isDisabled is true', () => {
        // Given the component is rendered with isDisabled set to true
        renderButton({ isDisabled: true, onPress });
        // When the button is pressed
        react_native_1.fireEvent.press(getButton());
        // Then the onPress function should not be called
        expect(onPress).not.toHaveBeenCalled();
    });
    it('sets accessibility label correctly', () => {
        // Given the component is rendered with an accessibility label
        renderButton({ accessibilityLabel });
        // Then the button should be accessible using the provided label
        expect(react_native_1.screen.getByLabelText(accessibilityLabel)).toBeOnTheScreen();
    });
    it('applies custom styles correctly', () => {
        // Given the component is rendered with custom styles
        renderButton({ accessibilityLabel, innerStyles: { width: '100%' } });
        // Then the button should have the custom styles
        const buttonContainer = react_native_1.screen.getByLabelText(accessibilityLabel);
        expect(buttonContainer).toHaveStyle({ backgroundColor: colors_1.default.productDark400 });
        expect(buttonContainer).toHaveStyle({ width: '100%' });
    });
});
