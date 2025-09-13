"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
function BaseLocationErrorMessage({ onClose, onAllowLocationLinkPress, locationErrorCode }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if (!locationErrorCode) {
        return null;
    }
    const isPermissionDenied = locationErrorCode === 1;
    return (<react_native_1.View style={[styles.dotIndicatorMessage, styles.mt4]}>
            <react_native_1.View style={styles.offlineFeedback.errorDot}>
                <Icon_1.default src={Expensicons.DotIndicator} fill={colors_1.default.red}/>
            </react_native_1.View>
            <react_native_1.View style={styles.offlineFeedback.textContainer}>
                {isPermissionDenied ? (<Text_1.default>
                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles()]}>{`${translate('location.permissionDenied')} ${translate('location.please')}`}</Text_1.default>
                        <TextLink_1.default onPress={onAllowLocationLinkPress} style={styles.locationErrorLinkText}>
                            {` ${translate('location.allowPermission')} `}
                        </TextLink_1.default>
                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles()]}>{translate('location.tryAgain')}</Text_1.default>
                    </Text_1.default>) : (<Text_1.default style={styles.offlineFeedback.text}>{translate('location.notFound')}</Text_1.default>)}
            </react_native_1.View>
            <react_native_1.View>
                <Tooltip_1.default text={translate('common.close')}>
                    <PressableWithoutFeedback_1.default onPress={onClose} onMouseDown={(e) => e.preventDefault()} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                        <Icon_1.default fill={theme.icon} src={Expensicons.Close}/>
                    </PressableWithoutFeedback_1.default>
                </Tooltip_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
BaseLocationErrorMessage.displayName = 'BaseLocationErrorMessage';
exports.default = BaseLocationErrorMessage;
