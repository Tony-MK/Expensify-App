"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Button_1 = require("./Button");
const MenuItem_1 = require("./MenuItem");
const Section_1 = require("./Section");
function FeatureList({ title, subtitle = '', ctaText, ctaAccessibilityLabel, onCtaPress, menuItems, illustration, illustrationStyle, illustrationBackgroundColor, illustrationContainerStyle, titleStyles, contentPaddingOnLargeScreens, footer, isButtonDisabled = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Section_1.default title={title} subtitle={subtitle} isCentralPane subtitleMuted illustration={illustration} illustrationBackgroundColor={illustrationBackgroundColor} illustrationStyle={illustrationStyle} titleStyles={titleStyles} illustrationContainerStyle={illustrationContainerStyle} contentPaddingOnLargeScreens={contentPaddingOnLargeScreens}>
            <react_native_1.View style={styles.flex1}>
                <react_native_1.View style={[styles.flex1, styles.flexRow, styles.flexWrap, styles.rowGap4, styles.pv4, styles.pl1]}>
                    {menuItems.map(({ translationKey, icon }) => (<react_native_1.View key={translationKey} style={styles.w100}>
                            <MenuItem_1.default title={translate(translationKey)} icon={icon} iconWidth={variables_1.default.menuIconSize} iconHeight={variables_1.default.menuIconSize} interactive={false} displayInDefaultIconColor wrapperStyle={[styles.p0, styles.cursorAuto]} containerStyle={[styles.m0, styles.wAuto]} numberOfLinesTitle={0}/>
                        </react_native_1.View>))}
                </react_native_1.View>
                {!!ctaText && (<Button_1.default text={ctaText} onPress={onCtaPress} accessibilityLabel={ctaAccessibilityLabel} style={styles.w100} success isDisabled={isButtonDisabled} large/>)}
                {!!footer && footer}
            </react_native_1.View>
        </Section_1.default>);
}
FeatureList.displayName = 'FeatureList';
exports.default = FeatureList;
