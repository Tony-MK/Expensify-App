"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NextStepUtils = require("@libs/NextStepUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const RenderHTML_1 = require("./RenderHTML");
const iconMap = {
    [CONST_1.default.NEXT_STEP.ICONS.HOURGLASS]: Expensicons.Hourglass,
    [CONST_1.default.NEXT_STEP.ICONS.CHECKMARK]: Expensicons.Checkmark,
    [CONST_1.default.NEXT_STEP.ICONS.STOPWATCH]: Expensicons.Stopwatch,
};
function MoneyReportHeaderStatusBar({ nextStep }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const messageContent = (0, react_1.useMemo)(() => {
        const messageArray = nextStep.message;
        return NextStepUtils.parseMessage(messageArray);
    }, [nextStep.message]);
    return (<react_native_1.View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.overflowHidden, styles.w100, styles.headerStatusBarContainer]}>
            <react_native_1.View style={[styles.mr3]}>
                <Icon_1.default src={iconMap[nextStep.icon] || Expensicons.Hourglass} height={variables_1.default.iconSizeSmall} width={variables_1.default.iconSizeSmall} fill={theme.icon}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.dFlex, styles.flexRow, styles.flexShrink1]}>
                <RenderHTML_1.default html={messageContent}/>
            </react_native_1.View>
        </react_native_1.View>);
}
MoneyReportHeaderStatusBar.displayName = 'MoneyReportHeaderStatusBar';
exports.default = MoneyReportHeaderStatusBar;
