"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const ImageSVG_1 = require("@components/ImageSVG");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
// Maximum horizontal and vertical shift in pixels on sensor value change
const IMAGE_OFFSET_X = 30;
const IMAGE_OFFSET_Y = 20;
// This is necessary so we don't send the entire CONST object to the worklet which could lead to performance issues
// https://docs.swmansion.com/react-native-reanimated/docs/guides/worklets/#capturing-closure
const ANIMATION_GYROSCOPE_VALUE = CONST_1.default.ANIMATION_GYROSCOPE_VALUE;
function AnimatedEmptyStateBackground() {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const illustrationWidth = CONST_1.default.EMPTY_STATE_BACKGROUND.ASPECT_RATIO * CONST_1.default.EMPTY_STATE_BACKGROUND.WIDE_SCREEN.IMAGE_HEIGHT; // or whatever your SVG's natural width is
    const maxBackgroundWidth = variables_1.default.sideBarWidth + illustrationWidth;
    // If window width is greater than the max background width, repeat the background image
    const numberOfRepeats = windowWidth > maxBackgroundWidth ? Math.ceil(windowWidth / illustrationWidth) : 1;
    // Get data from phone rotation sensor and prep other variables for animation
    const animatedSensor = (0, react_native_reanimated_1.useAnimatedSensor)(react_native_reanimated_1.SensorType.GYROSCOPE);
    const xOffset = (0, react_native_reanimated_1.useSharedValue)(0);
    const yOffset = (0, react_native_reanimated_1.useSharedValue)(0);
    const isReducedMotionEnabled = (0, react_native_reanimated_1.useReducedMotion)();
    // Apply data to create style object
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        if (!shouldUseNarrowLayout || isReducedMotionEnabled) {
            return {};
        }
        /*
         * We use x and y gyroscope velocity and add it to position offset to move background based on device movements.
         * Position the phone was in while entering the screen is the initial position for background image.
         */
        const { x, y } = animatedSensor.sensor.get();
        // The x vs y here seems wrong but is the way to make it feel right to the user
        xOffset.set((value) => (0, react_native_reanimated_1.clamp)(value + y * ANIMATION_GYROSCOPE_VALUE, -IMAGE_OFFSET_X, IMAGE_OFFSET_X));
        yOffset.set((value) => (0, react_native_reanimated_1.clamp)(value - x * ANIMATION_GYROSCOPE_VALUE, -IMAGE_OFFSET_Y, IMAGE_OFFSET_Y));
        return {
            transform: [{ translateX: (0, react_native_reanimated_1.withSpring)(xOffset.get()) }, { translateY: (0, react_native_reanimated_1.withSpring)(yOffset.get(), { overshootClamping: true }) }, { scale: 1.15 }],
        };
    }, [isReducedMotionEnabled]);
    return (<react_native_1.View style={StyleUtils.getReportWelcomeBackgroundContainerStyle()}>
            <react_native_reanimated_1.default.View style={[StyleUtils.getReportWelcomeBackgroundImageStyle(shouldUseNarrowLayout), animatedStyles]} entering={react_native_reanimated_1.FadeIn}>
                {Array.from({ length: numberOfRepeats }).map((_, index) => (<ImageSVG_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={index} src={illustrations.EmptyStateBackgroundImage} width={numberOfRepeats > 1 ? illustrationWidth : undefined} style={{ position: 'absolute', left: index * illustrationWidth }} preserveAspectRatio="xMidYMid slice"/>))}
            </react_native_reanimated_1.default.View>
        </react_native_1.View>);
}
AnimatedEmptyStateBackground.displayName = 'AnimatedEmptyStateBackground';
exports.default = AnimatedEmptyStateBackground;
