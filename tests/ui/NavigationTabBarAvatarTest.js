"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const NavigationTabBarAvatar_1 = require("@pages/home/sidebar/NavigationTabBarAvatar");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
// Mock responsive layout to force wide layout
jest.mock('@hooks/useResponsiveLayout', () => () => ({ shouldUseNarrowLayout: false }));
// Silence reanimated warnings
jest.mock('react-native-reanimated', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require('react-native-reanimated/mock');
});
describe('NavigationTabBarAvatar hover', () => {
    const onPress = jest.fn();
    const renderAvatar = () => (0, react_native_1.render)(<OnyxListItemProvider_1.default>
                <NavigationTabBarAvatar_1.default onPress={onPress} isSelected={false} 
    // Provide stable wrapper style so we can query by role
    style={{}}/>
            </OnyxListItemProvider_1.default>);
    it('shows green ring while hovered', () => {
        renderAvatar();
        const button = react_native_1.screen.getByRole(CONST_1.default.ROLE.BUTTON);
        // Before hover, ring should not have border styles
        const ring = react_native_1.screen.getByTestId('avatar-ring');
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
