"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_native_1 = require("@testing-library/react-native");
var react_1 = require("react");
var FloatingActionButton_1 = require("@components/FloatingActionButton");
var colors_1 = require("@styles/theme/colors");
var CONST_1 = require("@src/CONST");
// FloatingActionButton relies on ProductTrainingContext, so provide a minimal mock.
jest.mock('@components/ProductTrainingContext', function () { return ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    useProductTrainingContext: function () { return ({
        renderProductTrainingTooltip: function () { return null; },
        shouldShowProductTrainingTooltip: false,
        hideProductTrainingTooltip: function () { },
    }); },
}); });
// useResponsiveLayout determines LHB visibility. Mock a wide layout to keep behaviour deterministic.
jest.mock('@hooks/useResponsiveLayout', function () { return function () { return ({ shouldUseNarrowLayout: false }); }; });
// Mock useIsHomeRouteActive to avoid navigation state issues
jest.mock('@navigation/helpers/useIsHomeRouteActive', function () { return function () { return false; }; });
// Silence react-native-reanimated warnings in Jest
jest.mock('react-native-reanimated', function () {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require('react-native-reanimated/mock');
});
describe('FloatingActionButton hover', function () {
    var onPress = jest.fn();
    var renderFAB = function () {
        return (0, react_native_1.render)(<native_1.NavigationContainer>
                <FloatingActionButton_1.default onPress={onPress} isActive={false} accessibilityLabel="fab" role={CONST_1.default.ROLE.BUTTON} isTooltipAllowed={false}/>
            </native_1.NavigationContainer>);
    };
    it('changes background color on hover', function () {
        renderFAB();
        var fab = react_native_1.screen.getByTestId('floating-action-button');
        // Get the animated container by testID
        var animatedContainer = react_native_1.screen.getByTestId('fab-animated-container');
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
