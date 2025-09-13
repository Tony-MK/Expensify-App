"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
var Expensicons = require("@components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
describe('ButtonWithDropdownMenu (single option)', function () {
    var mockOnSelected = jest.fn();
    var mockOnOptionSelected = jest.fn();
    var mockOnSubItemSelected = jest.fn();
    var mockOnPress = jest.fn();
    var option = {
        value: 'test',
        text: 'Test Option',
        icon: Expensicons.Checkbox,
        onSelected: mockOnSelected,
    };
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('renders a button (not a dropdown) when only one option is present', function () {
        (0, react_native_1.render)(<ButtonWithDropdownMenu_1.default options={[option]} onPress={mockOnPress} onOptionSelected={mockOnOptionSelected} onSubItemSelected={mockOnSubItemSelected} shouldUseOptionIcon/>);
        expect(react_native_1.screen.getByText('Test Option')).toBeTruthy();
    });
    it('calls all relevant callbacks when the button is pressed', function () {
        (0, react_native_1.render)(<ButtonWithDropdownMenu_1.default options={[option]} onPress={mockOnPress} onOptionSelected={mockOnOptionSelected} onSubItemSelected={mockOnSubItemSelected} shouldUseOptionIcon/>);
        react_native_1.fireEvent.press(react_native_1.screen.getByText('Test Option'));
        expect(mockOnSelected).toHaveBeenCalled();
        expect(mockOnOptionSelected).not.toHaveBeenCalled(); // onSelected takes precedence
        expect(mockOnSubItemSelected).toHaveBeenCalledWith(expect.objectContaining(option), 0, undefined);
        expect(mockOnPress).not.toHaveBeenCalled(); // onPress should not be called when onSelected exists to prevent double execution
    });
    it('renders the icon from the option along with the text', function () {
        (0, react_native_1.render)(<ButtonWithDropdownMenu_1.default options={[option]} onPress={mockOnPress} onOptionSelected={mockOnOptionSelected} onSubItemSelected={mockOnSubItemSelected} shouldUseOptionIcon testID={CONST_1.default.ICON_TEST_ID}/>);
        var iconNodes = react_native_1.screen.getAllByTestId(CONST_1.default.ICON_TEST_ID);
        expect(iconNodes.length).toBeGreaterThan(0);
        expect(react_native_1.screen.getByText('Test Option')).toBeTruthy();
    });
});
