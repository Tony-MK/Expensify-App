"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentContext_1 = require("@components/AttachmentContext");
const Checkbox_1 = require("@components/Checkbox");
const Hoverable_1 = require("@components/Hoverable");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PressableWithSecondaryInteraction_1 = require("@components/PressableWithSecondaryInteraction");
const RenderHTML_1 = require("@components/RenderHTML");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const StringUtils_1 = require("@libs/StringUtils");
const TaskUtils_1 = require("@libs/TaskUtils");
const Session_1 = require("@userActions/Session");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function TaskView({ report, parentReport, action }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    (0, react_1.useEffect)(() => {
        (0, Task_1.setTaskReport)(report);
    }, [report]);
    const taskTitleWithoutPre = StringUtils_1.default.removePreCodeBlock(report?.reportName);
    const titleWithoutImage = Parser_1.default.replace(Parser_1.default.htmlToMarkdown(taskTitleWithoutPre), { disabledRules: [...CONST_1.default.TASK_TITLE_DISABLED_RULES] });
    const taskTitle = `<task-title>${titleWithoutImage}</task-title>`;
    const assigneeTooltipDetails = (0, ReportUtils_1.getDisplayNamesWithTooltips)((0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)(report?.managerID ? [report?.managerID] : [], personalDetails), false, localeCompare);
    const isOpen = (0, ReportUtils_1.isOpenTaskReport)(report);
    const isCompleted = (0, ReportUtils_1.isCompletedTaskReport)(report);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(parentReport?.reportID);
    const isTaskModifiable = (0, Task_1.canModifyTask)(report, currentUserPersonalDetails.accountID, isParentReportArchived);
    const isTaskActionable = (0, Task_1.canActionTask)(report, currentUserPersonalDetails.accountID, parentReport, isParentReportArchived);
    const disableState = !isTaskModifiable;
    const isDisableInteractive = disableState || !isOpen;
    const accountID = currentUserPersonalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const contextValue = (0, react_1.useMemo)(() => ({
        anchor: null,
        report,
        isReportArchived: false,
        action,
        transactionThreadReport: undefined,
        checkIfContextMenuActive: () => { },
        isDisabled: true,
        onShowContextMenu: (callback) => callback(),
        shouldDisplayContextMenu: false,
    }), [report, action]);
    const attachmentContextValue = (0, react_1.useMemo)(() => ({ type: CONST_1.default.ATTACHMENT_TYPE.ONBOARDING, accountID }), [accountID]);
    return (<ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextValue}>
            <AttachmentContext_1.AttachmentContext.Provider value={attachmentContextValue}>
                <OfflineWithFeedback_1.default shouldShowErrorMessages errors={report?.errorFields?.editTask ?? report?.errorFields?.createTask} onClose={() => (0, Task_1.clearTaskErrors)(report?.reportID)} errorRowStyles={styles.ph5}>
                    <Hoverable_1.default>
                        {(hovered) => (<PressableWithSecondaryInteraction_1.default onPress={(0, Session_1.callFunctionIfActionIsAllowed)((e) => {
                if (isDisableInteractive) {
                    return;
                }
                if (e && e.type === 'click') {
                    e.currentTarget.blur();
                }
                Navigation_1.default.navigate(ROUTES_1.default.TASK_TITLE.getRoute(report?.reportID, Navigation_1.default.getReportRHPActiveRoute()));
            })} style={({ pressed }) => [
                styles.ph5,
                styles.pv2,
                StyleUtils.getButtonBackgroundColorStyle((0, getButtonState_1.default)(hovered, pressed, false, disableState, !isDisableInteractive), true),
                isDisableInteractive && styles.cursorDefault,
            ]} accessibilityLabel={taskTitle || translate('task.task')} disabled={isDisableInteractive}>
                                {({ pressed }) => (<OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.reportName}>
                                        <Text_1.default style={styles.taskTitleDescription}>{translate('task.title')}</Text_1.default>
                                        <react_native_1.View style={[styles.flexRow, styles.flex1]}>
                                            <Checkbox_1.default onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
                    // If we're already navigating to these task editing pages, early return not to mark as completed, otherwise we would have not found page.
                    if ((0, TaskUtils_1.isActiveTaskEditRoute)(report?.reportID)) {
                        return;
                    }
                    if (isCompleted) {
                        (0, Task_1.reopenTask)(report);
                    }
                    else {
                        (0, Task_1.completeTask)(report);
                    }
                })} isChecked={isCompleted} style={styles.taskMenuItemCheckbox} containerSize={24} containerBorderRadius={8} caretSize={16} accessibilityLabel={taskTitle || translate('task.task')} disabled={!isTaskActionable}/>
                                            <react_native_1.View style={[styles.flexRow, styles.flex1]}>
                                                <RenderHTML_1.default html={taskTitle}/>
                                            </react_native_1.View>
                                            {!isDisableInteractive && (<react_native_1.View style={styles.taskRightIconContainer}>
                                                    <Icon_1.default additionalStyles={[styles.alignItemsCenter]} src={Expensicons.ArrowRight} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, pressed, false, disableState))}/>
                                                </react_native_1.View>)}
                                        </react_native_1.View>
                                    </OfflineWithFeedback_1.default>)}
                            </PressableWithSecondaryInteraction_1.default>)}
                    </Hoverable_1.default>
                    <OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.description}>
                        <MenuItemWithTopDescription_1.default shouldRenderAsHTML description={translate('task.description')} title={report?.description ?? ''} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.REPORT_DESCRIPTION.getRoute(report?.reportID, Navigation_1.default.getReportRHPActiveRoute()))} shouldShowRightIcon={!isDisableInteractive} disabled={disableState} wrapperStyle={[styles.pv2, styles.taskDescriptionMenuItem]} shouldGreyOutWhenDisabled={false} numberOfLinesTitle={0} interactive={!isDisableInteractive} shouldUseDefaultCursorWhenDisabled/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={report?.pendingFields?.managerID}>
                        {report?.managerID ? (<MenuItem_1.default label={translate('task.assignee')} title={(0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: report.managerID })} iconAccountID={report.managerID} iconType={CONST_1.default.ICON_TYPE_AVATAR} avatarSize={CONST_1.default.AVATAR_SIZE.SMALLER} titleStyle={styles.assigneeTextStyle} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.TASK_ASSIGNEE.getRoute(report?.reportID, Navigation_1.default.getReportRHPActiveRoute()))} shouldShowRightIcon={!isDisableInteractive} disabled={disableState} wrapperStyle={[styles.pv2]} isSmallAvatarSubscriptMenu shouldGreyOutWhenDisabled={false} interactive={!isDisableInteractive} titleWithTooltips={assigneeTooltipDetails} shouldUseDefaultCursorWhenDisabled/>) : (<MenuItemWithTopDescription_1.default description={translate('task.assignee')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.TASK_ASSIGNEE.getRoute(report?.reportID, Navigation_1.default.getReportRHPActiveRoute()))} shouldShowRightIcon={!isDisableInteractive} disabled={disableState} wrapperStyle={[styles.pv2]} shouldGreyOutWhenDisabled={false} interactive={!isDisableInteractive} shouldUseDefaultCursorWhenDisabled/>)}
                    </OfflineWithFeedback_1.default>
                </OfflineWithFeedback_1.default>
            </AttachmentContext_1.AttachmentContext.Provider>
        </ShowContextMenuContext_1.ShowContextMenuContext.Provider>);
}
TaskView.displayName = 'TaskView';
exports.default = TaskView;
