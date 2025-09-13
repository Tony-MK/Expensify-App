"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SortableHeaderText;
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function SortableHeaderText({ text, sortOrder, isActive, textStyle, containerStyle, isSortable = true, onPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    if (!isSortable) {
        return (<react_native_1.View style={containerStyle}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, textStyle]}>
                        {text}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>);
    }
    const icon = sortOrder === CONST_1.default.SEARCH.SORT_ORDER.ASC ? Expensicons.ArrowUpLong : Expensicons.ArrowDownLong;
    const displayIcon = isActive;
    const activeColumnStyle = isSortable && isActive && styles.searchTableHeaderActive;
    const nextSortOrder = isActive && sortOrder === CONST_1.default.SEARCH.SORT_ORDER.DESC ? CONST_1.default.SEARCH.SORT_ORDER.ASC : CONST_1.default.SEARCH.SORT_ORDER.DESC;
    return (<react_native_1.View style={containerStyle}>
            <PressableWithFeedback_1.default onPress={() => onPress(nextSortOrder)} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={CONST_1.default.ROLE.BUTTON} accessible disabled={!isSortable}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap1]}>
                    <Text_1.default numberOfLines={1} style={[styles.textMicroSupporting, activeColumnStyle, textStyle]}>
                        {text}
                    </Text_1.default>
                    {displayIcon && (<Icon_1.default src={icon} fill={theme.icon} height={12} width={12}/>)}
                </react_native_1.View>
            </PressableWithFeedback_1.default>
        </react_native_1.View>);
}
