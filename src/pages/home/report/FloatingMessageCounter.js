"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const MARKER_INACTIVE_TRANSLATE_Y = -40;
const MARKER_ACTIVE_TRANSLATE_Y = 10;
function FloatingMessageCounter({ isActive = false, onClick = () => { }, hasNewMessages }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const translateY = (0, react_native_reanimated_1.useSharedValue)(MARKER_INACTIVE_TRANSLATE_Y);
    const show = (0, react_1.useCallback)(() => {
        'worklet';
        translateY.set((0, react_native_reanimated_1.withSpring)(MARKER_ACTIVE_TRANSLATE_Y));
    }, [translateY]);
    const hide = (0, react_1.useCallback)(() => {
        'worklet';
        translateY.set((0, react_native_reanimated_1.withSpring)(MARKER_INACTIVE_TRANSLATE_Y));
    }, [translateY]);
    (0, react_1.useEffect)(() => {
        if (isActive) {
            show();
        }
        else {
            hide();
        }
    }, [isActive, show, hide]);
    const wrapperStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        ...styles.floatingMessageCounterWrapper,
        transform: [{ translateY: translateY.get() }],
    }));
    return (<react_native_reanimated_1.default.View accessibilityHint={translate('accessibilityHints.scrollToNewestMessages')} style={wrapperStyle}>
            <react_native_1.View style={styles.floatingMessageCounter}>
                <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                    <Button_1.default success={hasNewMessages} small onPress={onClick}>
                        <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                            <Icon_1.default small src={Expensicons.DownArrow} fill={hasNewMessages ? theme.textLight : theme.icon}/>

                            <Text_1.default style={[styles.ml2, styles.buttonSmallText, hasNewMessages && styles.textWhite, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                                {hasNewMessages ? translate('newMessages') : translate('latestMessages')}
                            </Text_1.default>
                        </react_native_1.View>
                    </Button_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_reanimated_1.default.View>);
}
FloatingMessageCounter.displayName = 'FloatingMessageCounter';
exports.default = react_1.default.memo(FloatingMessageCounter);
