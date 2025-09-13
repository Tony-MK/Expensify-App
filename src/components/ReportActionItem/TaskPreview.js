"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Checkbox_1 = require("@components/Checkbox");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useParentReport_1 = require("@hooks/useParentReport");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const Task_1 = require("@libs/actions/Task");
const ControlSelection_1 = require("@libs/ControlSelection");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const getButtonState_1 = require("@libs/getButtonState");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function TaskPreview({ taskReport, action, contextMenuAnchor, chatReportID, checkIfContextMenuActive, currentUserPersonalDetails, onShowContextMenu, isHovered = false, style, shouldDisplayContextMenu = true, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const taskReportID = taskReport?.reportID ?? action?.childReportID;
    const taskTitle = action?.childReportName ?? taskReport?.reportName ?? '';
    const taskTitleWithoutImage = Parser_1.default.replace(Parser_1.default.htmlToMarkdown(taskTitle), { disabledRules: [...CONST_1.default.TASK_TITLE_DISABLED_RULES] });
    // The reportAction might not contain details regarding the taskReport
    // Only the direct parent reportAction will contain details about the taskReport
    // Other linked reportActions will only contain the taskReportID and we will grab the details from there
    const isTaskCompleted = !(0, EmptyObject_1.isEmptyObject)(taskReport)
        ? taskReport?.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && taskReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED
        : action?.childStateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && action?.childStatusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED;
    const taskAssigneeAccountID = (0, Task_1.getTaskAssigneeAccountID)(taskReport) ?? action?.childManagerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const parentReport = (0, useParentReport_1.default)(taskReport?.reportID);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(parentReport?.reportID);
    const isTaskActionable = (0, Task_1.canActionTask)(taskReport, currentUserPersonalDetails.accountID, parentReport, isParentReportArchived);
    const hasAssignee = taskAssigneeAccountID > 0;
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const avatar = personalDetails?.[taskAssigneeAccountID]?.avatar ?? Expensicons.FallbackAvatar;
    const avatarSize = CONST_1.default.AVATAR_SIZE.SMALL;
    const isDeletedParentAction = (0, ReportUtils_1.isCanceledTaskReport)(taskReport, action);
    const iconWrapperStyle = StyleUtils.getTaskPreviewIconWrapper(hasAssignee ? avatarSize : undefined);
    const shouldShowGreenDotIndicator = (0, ReportUtils_1.isOpenTaskReport)(taskReport, action) && (0, ReportUtils_1.isReportManager)(taskReport);
    if (isDeletedParentAction) {
        return <RenderHTML_1.default html={`<deleted-action>${translate('parentReportAction.deletedTask')}</deleted-action>`}/>;
    }
    const getTaskHTML = () => {
        if (isTaskCompleted) {
            return `<del><comment center>${taskTitleWithoutImage}</comment></del>`;
        }
        return `<comment center>${taskTitleWithoutImage}</comment>`;
    };
    return (<react_native_1.View style={[styles.chatItemMessage, !hasAssignee && styles.mv1]}>
            <PressableWithoutFeedback_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(taskReportID, undefined, undefined, Navigation_1.default.getActiveRoute()))} onPressIn={() => (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onLongPress={(event) => onShowContextMenu(() => {
            if (!shouldDisplayContextMenu) {
                return;
            }
            return (0, ShowContextMenuContext_1.showContextMenuForReport)(event, contextMenuAnchor, chatReportID, action, checkIfContextMenuActive);
        })} shouldUseHapticsOnLongPress style={[styles.flexRow, styles.justifyContentBetween, style]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('task.task')}>
                <react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsStart, styles.mr2]}>
                    <react_native_1.View style={iconWrapperStyle}>
                        <Checkbox_1.default style={[styles.mr2]} isChecked={isTaskCompleted} disabled={!isTaskActionable} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
            if (isTaskCompleted) {
                (0, Task_1.reopenTask)(taskReport, taskReportID);
            }
            else {
                (0, Task_1.completeTask)(taskReport, taskReportID);
            }
        })} accessibilityLabel={translate('task.task')}/>
                    </react_native_1.View>
                    {hasAssignee && (<UserDetailsTooltip_1.default accountID={taskAssigneeAccountID}>
                            <react_native_1.View>
                                <Avatar_1.default containerStyles={[styles.mr2, isTaskCompleted ? styles.opacitySemiTransparent : undefined]} source={avatar} size={avatarSize} avatarID={taskAssigneeAccountID} type={CONST_1.default.ICON_TYPE_AVATAR}/>
                            </react_native_1.View>
                        </UserDetailsTooltip_1.default>)}
                    <react_native_1.View style={[styles.alignSelfCenter, styles.flex1]}>
                        <RenderHTML_1.default html={getTaskHTML()}/>
                    </react_native_1.View>
                </react_native_1.View>
                {shouldShowGreenDotIndicator && (<react_native_1.View style={iconWrapperStyle}>
                        <Icon_1.default src={Expensicons.DotIndicator} fill={theme.success}/>
                    </react_native_1.View>)}
                <Icon_1.default src={Expensicons.ArrowRight} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(isHovered))} additionalStyles={iconWrapperStyle}/>
            </PressableWithoutFeedback_1.default>
        </react_native_1.View>);
}
TaskPreview.displayName = 'TaskPreview';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(TaskPreview);
