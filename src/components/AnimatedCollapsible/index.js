"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var utils_1 = require("@components/Modal/ReanimatedModal/utils");
var Pressable_1 = require("@components/Pressable");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
function AnimatedCollapsible(_a) {
    var isExpanded = _a.isExpanded, children = _a.children, header = _a.header, _b = _a.duration, duration = _b === void 0 ? 300 : _b, style = _a.style, headerStyle = _a.headerStyle, contentStyle = _a.contentStyle, expandButtonStyle = _a.expandButtonStyle, onPress = _a.onPress, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var contentHeight = (0, react_native_reanimated_1.useSharedValue)(0);
    var isAnimating = (0, react_native_reanimated_1.useSharedValue)(false);
    var hasExpanded = (0, react_native_reanimated_1.useSharedValue)(false);
    var isExpandedFirstTime = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
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
    var derivedHeight = (0, react_native_reanimated_1.useDerivedValue)(function () {
        var targetHeight = isExpanded ? contentHeight.get() : 0;
        return (0, react_native_reanimated_1.withTiming)(targetHeight, {
            duration: duration,
            easing: utils_1.easing,
        }, function (finished) {
            if (!finished) {
                return;
            }
            isAnimating.set(false);
        });
    });
    var derivedOpacity = (0, react_native_reanimated_1.useDerivedValue)(function () {
        var targetOpacity = isExpanded ? 1 : 0;
        isAnimating.set(true);
        return (0, react_native_reanimated_1.withTiming)(targetOpacity, {
            duration: duration,
            easing: utils_1.easing,
        });
    });
    var contentAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
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
                    {function (_a) {
            var hovered = _a.hovered;
            return (<Icon_1.default src={isExpanded ? Expensicons.UpArrow : Expensicons.DownArrow} fill={hovered ? theme.textSupporting : theme.icon} small/>);
        }}
                </Pressable_1.PressableWithFeedback>
            </react_native_1.View>
            <react_native_reanimated_1.default.View style={[contentAnimatedStyle, contentStyle]}>
                <react_native_1.View onLayout={function (e) {
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
