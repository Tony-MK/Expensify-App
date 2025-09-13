"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const CheckboxWithLabel_1 = require("@src/components/CheckboxWithLabel");
const Text_1 = require("@src/components/Text");
const LABEL = 'Agree to Terms';
describe('CheckboxWithLabel Component', () => {
    const mockOnInputChange = jest.fn();
    const renderCheckboxWithLabel = (props = {}) => (0, react_native_1.render)(<CheckboxWithLabel_1.default label={LABEL} onInputChange={mockOnInputChange} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders the checkbox with label', () => {
        // Given the component is rendered
        renderCheckboxWithLabel();
        // Then the label is displayed
        expect(react_native_1.screen.getByText(LABEL)).toBeOnTheScreen();
    });
    it('calls onInputChange when the checkbox is pressed', () => {
        // Given the component is rendered
        renderCheckboxWithLabel();
        // When the checkbox is pressed
        const checkbox = react_native_1.screen.getByText(LABEL);
        react_native_1.fireEvent.press(checkbox);
        // Then the onInputChange function should be called with 'true' (checked)
        expect(mockOnInputChange).toHaveBeenCalledWith(true);
        // And when the checkbox is pressed again
        react_native_1.fireEvent.press(checkbox);
        // Then the onInputChange function should be called with 'false' (unchecked)
        expect(mockOnInputChange).toHaveBeenCalledWith(false);
    });
    it('displays error message when errorText is provided', () => {
        // Given the component is rendered with an error message
        const errorText = 'This field is required';
        renderCheckboxWithLabel({ errorText });
        // Then the error message is displayed
        expect(react_native_1.screen.getByText(errorText)).toBeOnTheScreen();
    });
    it('renders custom LabelComponent if provided', () => {
        // Given the component is rendered with a custom LabelComponent
        function MockLabelComponent() {
            return <Text_1.default>Mock Label Component</Text_1.default>;
        }
        renderCheckboxWithLabel({ LabelComponent: MockLabelComponent });
        // Then the custom LabelComponent is displayed
        expect(react_native_1.screen.getByText('Mock Label Component')).toBeOnTheScreen();
    });
    it('is accessible and has the correct accessibility label', () => {
        // Given the component is rendered with an accessibility label
        const accessibilityLabel = 'checkbox-agree-to-terms';
        renderCheckboxWithLabel({ accessibilityLabel });
        // Then the checkbox should be accessible using the provided label
        const checkbox = react_native_1.screen.getByLabelText(accessibilityLabel);
        expect(checkbox).toBeOnTheScreen();
    });
});
