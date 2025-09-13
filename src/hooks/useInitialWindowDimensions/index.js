"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
// eslint-disable-next-line no-restricted-imports
const react_1 = require("react");
const react_native_1 = require("react-native");
/**
 * A convenience hook that provides initial size (width and height).
 * An initial height allows to know the real height of window,
 * while the standard useWindowDimensions hook return the height minus Virtual keyboard height
 * @returns with information about initial width and height
 */
function default_1() {
    const [dimensions, setDimensions] = (0, react_1.useState)(() => {
        const window = react_native_1.Dimensions.get('window');
        const screen = react_native_1.Dimensions.get('screen');
        return {
            screenHeight: screen.height,
            screenWidth: screen.width,
            initialHeight: window.height,
            initialWidth: window.width,
        };
    });
    (0, react_1.useEffect)(() => {
        const onDimensionChange = (newDimensions) => {
            const { window, screen } = newDimensions;
            setDimensions((oldState) => {
                if (screen.width !== oldState.screenWidth || screen.height !== oldState.screenHeight || window.height > oldState.initialHeight) {
                    return {
                        initialHeight: window.height,
                        initialWidth: window.width,
                        screenHeight: screen.height,
                        screenWidth: screen.width,
                    };
                }
                return oldState;
            });
        };
        const dimensionsEventListener = react_native_1.Dimensions.addEventListener('change', onDimensionChange);
        return () => {
            if (!dimensionsEventListener) {
                return;
            }
            dimensionsEventListener.remove();
        };
    }, []);
    return {
        initialWidth: dimensions.initialWidth,
        initialHeight: dimensions.initialHeight,
    };
}
