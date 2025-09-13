"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function ThreadDivider({ ancestor, isLinkDisabled = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isReportArchived = (0, useReportIsArchived_1.default)(ancestor.report.reportID);
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.ml5, styles.mt3, styles.mb1, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
            {isLinkDisabled ? (<>
                    <Icon_1.default src={Expensicons.Thread} fill={theme.icon} width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall}/>
                    <Text_1.default style={[styles.threadDividerText, styles.textSupporting, styles.ml1, styles.userSelectNone]}>{translate('threads.thread')}</Text_1.default>
                </>) : (<Pressable_1.PressableWithoutFeedback onPress={() => (0, ReportUtils_1.navigateToLinkedReportAction)(ancestor, isInNarrowPaneModal, (0, ReportUtils_1.canUserPerformWriteAction)(ancestor.report, isReportArchived), isOffline)} accessibilityLabel={translate('threads.thread')} role={CONST_1.default.ROLE.BUTTON} style={[styles.flexRow, styles.alignItemsCenter, styles.gap1]}>
                    <Icon_1.default src={Expensicons.Thread} fill={theme.link} width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall}/>
                    <Text_1.default style={[styles.threadDividerText, styles.link]}>{translate('threads.thread')}</Text_1.default>
                </Pressable_1.PressableWithoutFeedback>)}
            {!ancestor.shouldDisplayNewMarker && <react_native_1.View style={[styles.threadDividerLine]}/>}
        </react_native_1.View>);
}
ThreadDivider.displayName = 'ThreadDivider';
exports.default = ThreadDivider;
