"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Header_1 = require("@components/Header");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
var Tooltip_1 = require("@components/Tooltip");
var useLocalize_1 = require("@hooks/useLocalize");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
function HelpHeader(_a) {
    var title = _a.title, onBackButtonPress = _a.onBackButtonPress, onCloseButtonPress = _a.onCloseButtonPress, _b = _a.shouldShowBackButton, shouldShowBackButton = _b === void 0 ? true : _b, _c = _a.shouldShowCloseButton, shouldShowCloseButton = _c === void 0 ? false : _c;
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
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
