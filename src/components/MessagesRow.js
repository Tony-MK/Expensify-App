"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const DotIndicatorMessage_1 = require("./DotIndicatorMessage");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithoutFeedback_1 = require("./Pressable/PressableWithoutFeedback");
const Tooltip_1 = require("./Tooltip");
function MessagesRow({ messages = {}, type, onClose = () => { }, containerStyles, canDismiss = true, dismissError = () => { } }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if ((0, EmptyObject_1.isEmptyObject)(messages)) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, containerStyles]}>
            <DotIndicatorMessage_1.default dismissError={dismissError} style={styles.flex1} messages={messages} type={type}/>
            {canDismiss && (<Tooltip_1.default text={translate('common.close')}>
                    <PressableWithoutFeedback_1.default onPress={onClose} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                        <Icon_1.default fill={theme.icon} src={Expensicons.Close}/>
                    </PressableWithoutFeedback_1.default>
                </Tooltip_1.default>)}
        </react_native_1.View>);
}
MessagesRow.displayName = 'MessagesRow';
exports.default = MessagesRow;
