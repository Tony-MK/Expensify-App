"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Header_1 = require("@components/Header");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function HelpHeader({ title, onBackButtonPress, onCloseButtonPress, shouldShowBackButton = true, shouldShowCloseButton = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.headerBar]}>
            <react_native_1.View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.flexGrow1, styles.justifyContentBetween, styles.overflowHidden]}>
                {shouldShowBackButton && (<Tooltip_1.default text={translate('common.back')}>
                        <PressableWithoutFeedback_1.default onPress={onBackButtonPress} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.back')}>
                            <Icon_1.default src={Expensicons.BackArrow} fill={theme.icon}/>
                        </PressableWithoutFeedback_1.default>
                    </Tooltip_1.default>)}

                <Header_1.default title={title} textStyles={[styles.flexShrink1, styles.textAlignCenter, shouldShowBackButton && styles.mr5, shouldShowCloseButton && styles.mr5]}/>

                {shouldShowCloseButton && (<Tooltip_1.default text={translate('common.close')}>
                        <PressableWithoutFeedback_1.default onPress={onCloseButtonPress} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                            <Icon_1.default src={Expensicons.Close} fill={theme.icon}/>
                        </PressableWithoutFeedback_1.default>
                    </Tooltip_1.default>)}
            </react_native_1.View>
        </react_native_1.View>);
}
HelpHeader.displayName = 'HelpHeader';
exports.default = HelpHeader;
