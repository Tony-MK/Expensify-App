"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EnvironmentBadge_1 = require("./EnvironmentBadge");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
function Header({ title = '', subtitle = '', textStyles = [], style, containerStyles = [], shouldShowEnvironmentBadge = false, subTitleLink = '', numberOfTitleLines = 2 }) {
    const styles = (0, useThemeStyles_1.default)();
    const renderedSubtitle = (0, react_1.useMemo)(() => (<>
                {/* If there's no subtitle then display a fragment to avoid an empty space which moves the main title */}
                {typeof subtitle === 'string'
            ? !!subtitle && (<Text_1.default style={[styles.mutedTextLabel, styles.pre]} numberOfLines={1}>
                              {subtitle}
                          </Text_1.default>)
            : subtitle}
            </>), [subtitle, styles]);
    const renderedSubTitleLink = (0, react_1.useMemo)(() => (<TextLink_1.default onPress={() => {
            react_native_1.Linking.openURL(subTitleLink);
        }} numberOfLines={1} style={styles.label}>
                {subTitleLink}
            </TextLink_1.default>), [styles.label, subTitleLink]);
    return (<react_native_1.View style={[styles.flex1, styles.flexRow, containerStyles]}>
            <react_native_1.View style={[styles.mw100, style]}>
                {typeof title === 'string'
            ? !!title && (<Text_1.default numberOfLines={numberOfTitleLines} style={[styles.headerText, styles.textLarge, styles.lineHeightXLarge, textStyles]}>
                              {title}
                          </Text_1.default>)
            : title}
                {renderedSubtitle}
                {!!subTitleLink && renderedSubTitleLink}
            </react_native_1.View>
            {shouldShowEnvironmentBadge && <EnvironmentBadge_1.default />}
        </react_native_1.View>);
}
Header.displayName = 'Header';
exports.default = Header;
