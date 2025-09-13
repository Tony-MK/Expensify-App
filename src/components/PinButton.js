"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@userActions/Report");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const Tooltip_1 = require("./Tooltip");
function PinButton({ report }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Tooltip_1.default text={report.isPinned ? translate('common.unPin') : translate('common.pin')}>
            <PressableWithFeedback_1.default onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => (0, Report_1.togglePinnedState)(report.reportID, report.isPinned ?? false))} style={styles.touchableButtonImage} accessibilityLabel={report.isPinned ? translate('common.unPin') : translate('common.pin')} role={CONST_1.default.ROLE.BUTTON}>
                <Icon_1.default src={Expensicons.Pin} fill={report.isPinned ? theme.heading : theme.icon}/>
            </PressableWithFeedback_1.default>
        </Tooltip_1.default>);
}
PinButton.displayName = 'PinButton';
exports.default = PinButton;
