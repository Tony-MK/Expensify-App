"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_reanimated_1 = require("react-native-reanimated");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const AnimatedPressableWithoutFeedback = react_native_reanimated_1.default.createAnimatedComponent(PressableWithoutFeedback_1.default);
AnimatedPressableWithoutFeedback.displayName = 'AnimatedPressableWithoutFeedback';
exports.default = AnimatedPressableWithoutFeedback;
