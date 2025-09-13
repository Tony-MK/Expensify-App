"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const utils_1 = require("@components/Modal/ReanimatedModal/utils");
const Pressable_1 = require("@components/Pressable");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function AnimatedCollapsible({ isExpanded, children, header, duration = 300, style, headerStyle, contentStyle, expandButtonStyle, onPress, disabled = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const contentHeight = (0, react_native_reanimated_1.useSharedValue)(0);
    const isAnimating = (0, react_native_reanimated_1.useSharedValue)(false);
    const hasExpanded = (0, react_native_reanimated_1.useSharedValue)(false);
    const isExpandedFirstTime = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!isExpanded && !isExpandedFirstTime.current) {
            return;
        }
        if (isExpandedFirstTime.current) {
            hasExpanded.set(true);
        }
        else {
            isExpandedFirstTime.current = true;
        }
    }, [hasExpanded, isExpanded]);
    // Animation for content height and opacity
    const derivedHeight = (0, react_native_reanimated_1.useDerivedValue)(() => {
        const targetHeight = isExpanded ? contentHeight.get() : 0;
        return (0, react_native_reanimated_1.withTiming)(targetHeight, {
            duration,
            easing: utils_1.easing,
        }, (finished) => {
            if (!finished) {
                return;
            }
            isAnimating.set(false);
        });
    });
    const derivedOpacity = (0, react_native_reanimated_1.useDerivedValue)(() => {
        const targetOpacity = isExpanded ? 1 : 0;
        isAnimating.set(true);
        return (0, react_native_reanimated_1.withTiming)(targetOpacity, {
            duration,
            easing: utils_1.easing,
        });
    });
    const contentAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        if (!isExpanded && !hasExpanded.get()) {
            return {
                height: 0,
                opacity: 0,
                overflow: 'hidden',
            };
        }
        return {
            height: !hasExpanded.get() ? undefined : derivedHeight.get(),
            opacity: derivedOpacity.get(),
            overflow: isAnimating.get() ? 'hidden' : 'visible',
        };
    });
    return (<react_native_1.View style={style}>
            <react_native_1.View style={[headerStyle, styles.flexRow, styles.alignItemsCenter]}>
                <react_native_1.View style={[styles.flex1]}>{header}</react_native_1.View>
                <Pressable_1.PressableWithFeedback onPress={onPress} disabled={disabled} style={[styles.p3, styles.justifyContentCenter, styles.alignItemsCenter, styles.pl0, expandButtonStyle]} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={isExpanded ? 'Collapse' : 'Expand'}>
                    {({ hovered }) => (<Icon_1.default src={isExpanded ? Expensicons.UpArrow : Expensicons.DownArrow} fill={hovered ? theme.textSupporting : theme.icon} small/>)}
                </Pressable_1.PressableWithFeedback>
            </react_native_1.View>
            <react_native_reanimated_1.default.View style={[contentAnimatedStyle, contentStyle]}>
                <react_native_1.View onLayout={(e) => {
            if (!e.nativeEvent.layout.height) {
                return;
            }
            if (!isExpanded) {
                hasExpanded.set(true);
            }
            contentHeight.set(e.nativeEvent.layout.height);
        }}>
                    <react_native_1.View style={[styles.pv2, styles.ph3]}>
                        <react_native_1.View style={[styles.borderBottom]}/>
                    </react_native_1.View>
                    {children}
                </react_native_1.View>
            </react_native_reanimated_1.default.View>
        </react_native_1.View>);
}
AnimatedCollapsible.displayName = 'AnimatedCollapsible';
exports.default = AnimatedCollapsible;
