"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const FloatingActionButton_1 = require("@components/FloatingActionButton");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
// FloatingActionButton relies on ProductTrainingContext, so provide a minimal mock.
jest.mock('@components/ProductTrainingContext', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    useProductTrainingContext: () => ({
        renderProductTrainingTooltip: () => null,
        shouldShowProductTrainingTooltip: false,
        hideProductTrainingTooltip: () => { },
    }),
}));
// useResponsiveLayout determines LHB visibility. Mock a wide layout to keep behaviour deterministic.
jest.mock('@hooks/useResponsiveLayout', () => () => ({ shouldUseNarrowLayout: false }));
// Mock useIsHomeRouteActive to avoid navigation state issues
jest.mock('@navigation/helpers/useIsHomeRouteActive', () => () => false);
// Silence react-native-reanimated warnings in Jest
jest.mock('react-native-reanimated', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require('react-native-reanimated/mock');
});
describe('FloatingActionButton hover', () => {
    const onPress = jest.fn();
    const renderFAB = () => (0, react_native_1.render)(<native_1.NavigationContainer>
                <FloatingActionButton_1.default onPress={onPress} isActive={false} accessibilityLabel="fab" role={CONST_1.default.ROLE.BUTTON} isTooltipAllowed={false}/>
            </native_1.NavigationContainer>);
    it('changes background color on hover', () => {
        renderFAB();
        const fab = react_native_1.screen.getByTestId('floating-action-button');
        // Get the animated container by testID
        const animatedContainer = react_native_1.screen.getByTestId('fab-animated-container');
        // Before hover, should not have successHover background
        expect(animatedContainer).not.toHaveStyle({ backgroundColor: colors_1.default.greenHover });
        // Test hover in
        (0, react_native_1.fireEvent)(fab, 'hoverIn');
        expect(animatedContainer).toHaveStyle({ backgroundColor: colors_1.default.greenHover });
        // Test hover out
        (0, react_native_1.fireEvent)(fab, 'hoverOut');
        expect(animatedContainer).not.toHaveStyle({ backgroundColor: colors_1.default.greenHover });
    });
});
