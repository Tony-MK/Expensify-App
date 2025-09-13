"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Collapsible_1 = require("./Collapsible");
function CollapsibleSection({ title, children, titleStyle, textStyle, wrapperStyle, shouldShowSectionBorder }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    /**
     * Expands/collapses the section
     */
    const toggleSection = () => {
        setIsExpanded(!isExpanded);
    };
    const src = isExpanded ? Expensicons.UpArrow : Expensicons.DownArrow;
    return (<react_native_1.View style={[styles.mt4, wrapperStyle]}>
            <PressableWithFeedback_1.default onPress={toggleSection} style={[styles.pb4, styles.flexRow]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={title} hoverDimmingValue={1} pressDimmingValue={0.2}>
                <Text_1.default style={textStyle ?? [styles.flex1, styles.textStrong, styles.userSelectNone, titleStyle]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                    {title}
                </Text_1.default>
                <Icon_1.default fill={theme.icon} src={src}/>
            </PressableWithFeedback_1.default>
            {!!shouldShowSectionBorder && <react_native_1.View style={styles.collapsibleSectionBorder}/>}
            <Collapsible_1.default isOpened={isExpanded}>
                <react_native_1.View>{children}</react_native_1.View>
            </Collapsible_1.default>
        </react_native_1.View>);
}
exports.default = CollapsibleSection;
