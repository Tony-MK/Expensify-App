"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const Timing_1 = require("@libs/actions/Timing");
const Performance_1 = require("@libs/Performance");
const CONST_1 = require("@src/CONST");
function ReportActionItemThread({ numberOfReplies, accountIDs, mostRecentReply, reportID, reportAction, isHovered, onSecondaryInteraction, isActive }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, datetimeToCalendarTime } = (0, useLocalize_1.default)();
    const numberOfRepliesText = numberOfReplies > CONST_1.default.MAX_THREAD_REPLIES_PREVIEW ? `${CONST_1.default.MAX_THREAD_REPLIES_PREVIEW}+` : `${numberOfReplies}`;
    const replyText = numberOfReplies === 1 ? translate('threads.reply') : translate('threads.replies');
    const timeStamp = datetimeToCalendarTime(mostRecentReply, false);
    return (<react_native_1.View style={[styles.chatItemMessage]}>
            <PressableWithSecondaryInteraction_1.default onPress={() => {
            Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT_THREAD);
            Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT_THREAD);
            (0, Report_1.navigateToAndOpenChildReport)(reportAction.childReportID, reportAction, reportID);
        }} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={`${numberOfReplies} ${replyText}`} onSecondaryInteraction={onSecondaryInteraction}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt2]}>
                    <ReportActionAvatars_1.default size={CONST_1.default.AVATAR_SIZE.SMALL} accountIDs={accountIDs} horizontalStacking={{
            isHovered,
            isActive,
            sort: CONST_1.default.REPORT_ACTION_AVATARS.SORT_BY.NAME,
        }} isInReportAction/>
                    <react_native_1.View style={[styles.flex1, styles.flexRow, styles.lh140Percent, styles.alignItemsEnd]}>
                        <Text_1.default style={[styles.link, styles.ml2, styles.h4, styles.noWrap, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                            {`${numberOfRepliesText} ${replyText}`}
                        </Text_1.default>
                        <Text_1.default numberOfLines={1} style={[styles.ml2, styles.textMicroSupporting, styles.flex1, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                            {timeStamp}
                        </Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
            </PressableWithSecondaryInteraction_1.default>
        </react_native_1.View>);
}
ReportActionItemThread.displayName = 'ReportActionItemThread';
exports.default = ReportActionItemThread;
