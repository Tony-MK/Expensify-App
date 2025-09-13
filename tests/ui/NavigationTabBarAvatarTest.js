"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var NavigationTabBarAvatar_1 = require("@pages/home/sidebar/NavigationTabBarAvatar");
var colors_1 = require("@styles/theme/colors");
var CONST_1 = require("@src/CONST");
// Mock responsive layout to force wide layout
jest.mock('@hooks/useResponsiveLayout', function () { return function () { return ({ shouldUseNarrowLayout: false }); }; });
// Silence reanimated warnings
jest.mock('react-native-reanimated', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require('react-native-reanimated/mock');
});
describe('NavigationTabBarAvatar hover', function () {
    var onPress = jest.fn();
    var renderAvatar = function () {
        return (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <NavigationTabBarAvatar_1.default onPress={onPress} isSelected={false} 
        // Provide stable wrapper style so we can query by role
        style={{}}/>
            </OnyxListItemProvider_1.default>);
    };
    it('shows green ring while hovered', function () {
        renderAvatar();
        var button = react_native_1.screen.getByRole(CONST_1.default.ROLE.BUTTON);
        // Before hover, ring should not have border styles
        var ring = react_native_1.screen.getByTestId('avatar-ring');
        expect(ring).not.toHaveStyle({
            borderColor: colors_1.default.green400,
            borderWidth: 2,
        });
        (0, react_native_1.fireEvent)(button, 'hoverIn');
        // After hover, ring should have correct styles
        expect(ring).toHaveStyle({
            borderColor: colors_1.default.green400,
            borderWidth: 2,
        });
        (0, react_native_1.fireEvent)(button, 'hoverOut');
        expect(ring).not.toHaveStyle({
            borderColor: colors_1.default.green400,
            borderWidth: 2,
        });
    });
});
