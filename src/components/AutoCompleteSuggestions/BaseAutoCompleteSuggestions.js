"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const ColorSchemeWrapper_1 = require("@components/ColorSchemeWrapper");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const CONST_1 = require("@src/CONST");
function BaseAutoCompleteSuggestions({ highlightedSuggestionIndex = 0, onSelect, accessibilityLabelExtractor, renderSuggestionMenuItem, suggestions, keyExtractor, measuredHeightOfSuggestionRows, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const rowHeight = (0, react_native_reanimated_1.useSharedValue)(0);
    const prevRowHeightRef = (0, react_1.useRef)(measuredHeightOfSuggestionRows);
    const fadeInOpacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const scrollRef = (0, react_1.useRef)(null);
    /**
     * Render a suggestion menu item component.
     */
    const renderItem = (0, react_1.useCallback)(({ item, index }) => (<PressableWithFeedback_1.default style={({ hovered }) => StyleUtils.getAutoCompleteSuggestionItemStyle(highlightedSuggestionIndex, CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT, hovered, index)} hoverDimmingValue={1} onMouseDown={(e) => e.preventDefault()} onPress={() => onSelect(index)} onLongPress={() => { }} accessibilityLabel={accessibilityLabelExtractor(item, index)}>
                {renderSuggestionMenuItem(item, index)}
            </PressableWithFeedback_1.default>), [accessibilityLabelExtractor, renderSuggestionMenuItem, StyleUtils, highlightedSuggestionIndex, onSelect]);
    const innerHeight = CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT * suggestions.length;
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: fadeInOpacity.get(),
        ...StyleUtils.getAutoCompleteSuggestionContainerStyle(rowHeight.get()),
    }));
    (0, react_1.useEffect)(() => {
        if (measuredHeightOfSuggestionRows === prevRowHeightRef.current) {
            fadeInOpacity.set((0, react_native_reanimated_1.withTiming)(1, {
                duration: 70,
                easing: react_native_reanimated_1.Easing.inOut(react_native_reanimated_1.Easing.ease),
            }));
            rowHeight.set(measuredHeightOfSuggestionRows);
        }
        else {
            fadeInOpacity.set(1);
            rowHeight.set((0, react_native_reanimated_1.withTiming)(measuredHeightOfSuggestionRows, {
                duration: 100,
                easing: react_native_reanimated_1.Easing.bezier(0.25, 0.1, 0.25, 1),
            }));
        }
        prevRowHeightRef.current = measuredHeightOfSuggestionRows;
    }, [suggestions.length, rowHeight, measuredHeightOfSuggestionRows, prevRowHeightRef, fadeInOpacity]);
    (0, react_1.useEffect)(() => {
        if (!scrollRef.current) {
            return;
        }
        // When using cursor control (moving the cursor with the space bar on the keyboard) on Android, moving the cursor too fast may cause an error.
        try {
            scrollRef.current.scrollToIndex({ index: highlightedSuggestionIndex, animated: true });
        }
        catch (e) {
            // eslint-disable-next-line no-console
        }
    }, [highlightedSuggestionIndex]);
    return (<react_native_reanimated_1.default.View style={[styles.autoCompleteSuggestionsContainer, animatedStyles]} onPointerDown={(e) => {
            if (DeviceCapabilities.hasHoverSupport()) {
                return;
            }
            e.preventDefault();
        }}>
            <ColorSchemeWrapper_1.default>
                <react_native_gesture_handler_1.FlatList ref={scrollRef} keyboardShouldPersistTaps="handled" data={suggestions} renderItem={renderItem} keyExtractor={keyExtractor} removeClippedSubviews={false} showsVerticalScrollIndicator={innerHeight > rowHeight.get()} extraData={[highlightedSuggestionIndex, renderSuggestionMenuItem]}/>
            </ColorSchemeWrapper_1.default>
        </react_native_reanimated_1.default.View>);
}
BaseAutoCompleteSuggestions.displayName = 'BaseAutoCompleteSuggestions';
exports.default = BaseAutoCompleteSuggestions;
