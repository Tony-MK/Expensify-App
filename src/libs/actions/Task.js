"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskAndNavigate = createTaskAndNavigate;
exports.editTask = editTask;
exports.editTaskAssignee = editTaskAssignee;
exports.setTitleValue = setTitleValue;
exports.setDescriptionValue = setDescriptionValue;
exports.setTaskReport = setTaskReport;
exports.setDetailsValue = setDetailsValue;
exports.setAssigneeValue = setAssigneeValue;
exports.setShareDestinationValue = setShareDestinationValue;
exports.clearOutTaskInfo = clearOutTaskInfo;
exports.reopenTask = reopenTask;
exports.buildTaskData = buildTaskData;
exports.completeTask = completeTask;
exports.clearOutTaskInfoAndNavigate = clearOutTaskInfoAndNavigate;
exports.startOutCreateTaskQuickAction = startOutCreateTaskQuickAction;
exports.getAssignee = getAssignee;
exports.getShareDestination = getShareDestination;
exports.deleteTask = deleteTask;
exports.dismissModalAndClearOutTaskInfo = dismissModalAndClearOutTaskInfo;
exports.getTaskAssigneeAccountID = getTaskAssigneeAccountID;
exports.clearTaskErrors = clearTaskErrors;
exports.canModifyTask = canModifyTask;
exports.setNewOptimisticAssignee = setNewOptimisticAssignee;
exports.getNavigationUrlOnTaskDelete = getNavigationUrlOnTaskDelete;
exports.canActionTask = canActionTask;
exports.getFinishOnboardingTaskOnyxData = getFinishOnboardingTaskOnyxData;
exports.completeTestDriveTask = completeTestDriveTask;
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const Expensicons = require("@components/Icon/Expensicons");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const LocalePhoneNumber = require("@libs/LocalePhoneNumber");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils = require("@libs/OptionsListUtils");
const PersonalDetailsUtils = require("@libs/PersonalDetailsUtils");
const ReportActionsUtils = require("@libs/ReportActionsUtils");
const ReportUtils = require("@libs/ReportUtils");
const Sound_1 = require("@libs/Sound");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Report_1 = require("./Report");
const Welcome_1 = require("./Welcome");
let currentUserEmail = '';
let currentUserAccountID = -1;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        currentUserEmail = value?.email ?? '';
        currentUserAccountID = value?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
let allPersonalDetails;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (value) => (allPersonalDetails = value),
});
let allReportActions;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (actions) => {
        if (!actions) {
            return;
        }
        allReportActions = actions;
    },
});
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let introSelected = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_INTRO_SELECTED,
    callback: (val) => (introSelected = val),
});
let allReportNameValuePair;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            return;
        }
        allReportNameValuePair = value;
    },
});
/**
 * Clears out the task info from the store
 */
function clearOutTaskInfo(skipConfirmation = false) {
    if (skipConfirmation) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.TASK, { skipConfirmation: true });
    }
    else {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.TASK, null);
    }
}
/**
 * A task needs two things to be created - a title and a parent report
 * When you create a task report, there are a few things that happen:
 * A task report is created, along with a CreatedReportAction for that new task report
 * A reportAction indicating that a task was created is added to the parent report (share destination)
 * If you assign the task to someone, a reportAction is created in the chat between you and the assignee to inform them of the task
 *
 * So you have the following optimistic items potentially being created:
 * 1. The task report
 * 1a. The CreatedReportAction for the task report
 * 2. The TaskReportAction on the parent report
 * 3. The chat report between you and the assignee
 * 3a. The CreatedReportAction for the assignee chat report
 * 3b. The TaskReportAction on the assignee chat report
 */
function createTaskAndNavigate(parentReportID, title, description, assigneeEmail, assigneeAccountID = 0, assigneeChatReport, policyID = CONST_1.default.POLICY.OWNER_EMAIL_FAKE, isCreatedUsingMarkdown = false, quickAction = {}) {
    if (!parentReportID) {
        return;
    }
    const optimisticTaskReport = ReportUtils.buildOptimisticTaskReport(currentUserAccountID, parentReportID, assigneeAccountID, title, description, policyID);
    const assigneeChatReportID = assigneeChatReport?.reportID;
    const taskReportID = optimisticTaskReport.reportID;
    let assigneeChatReportOnyxData;
    // Parent ReportAction indicating that a task has been created
    const optimisticTaskCreatedAction = ReportUtils.buildOptimisticCreatedReportAction(currentUserEmail);
    const optimisticAddCommentReport = ReportUtils.buildOptimisticTaskCommentReportAction(taskReportID, title, assigneeAccountID, `task for ${title}`, parentReportID);
    optimisticTaskReport.parentReportActionID = optimisticAddCommentReport.reportAction.reportActionID;
    const currentTime = DateUtils_1.default.getDBTimeWithSkew();
    const lastCommentText = ReportUtils.formatReportLastMessageText(ReportActionsUtils.getReportActionText(optimisticAddCommentReport.reportAction));
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`];
    const optimisticParentReport = {
        lastVisibleActionCreated: optimisticAddCommentReport.reportAction.created,
        lastMessageText: lastCommentText,
        lastActorAccountID: currentUserAccountID,
        lastReadTime: currentTime,
        hasOutstandingChildTask: assigneeAccountID === currentUserAccountID ? true : parentReport?.hasOutstandingChildTask,
    };
    // We're only setting onyx data for the task report here because it's possible for the parent report to not exist yet (if you're assigning a task to someone you haven't chatted with before)
    // So we don't want to set the parent report data until we've successfully created that chat report
    // FOR TASK REPORT
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTaskReport.reportID}`,
            value: {
                ...optimisticTaskReport,
                pendingFields: {
                    createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    reportName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    description: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                    managerID: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticTaskReport.reportID}`,
            value: {
                isOptimisticReport: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTaskReport.reportID}`,
            value: { [optimisticTaskCreatedAction.reportActionID]: optimisticTaskCreatedAction },
        },
    ];
    // FOR TASK REPORT
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTaskReport.reportID}`,
            value: {
                pendingFields: {
                    createChat: null,
                    reportName: null,
                    description: null,
                    managerID: null,
                },
                // BE will send a different participant. We clear the optimistic one to avoid duplicated entries
                participants: { [assigneeAccountID]: null },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${optimisticTaskReport.reportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTaskReport.reportID}`,
            value: { [optimisticTaskCreatedAction.reportActionID]: { pendingAction: null } },
        },
    ];
    // FOR TASK REPORT
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTaskReport.reportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTaskReport.reportID}`,
            value: null,
        },
    ];
    if (assigneeChatReport && assigneeChatReportID) {
        assigneeChatReportOnyxData = ReportUtils.getTaskAssigneeChatOnyxData(currentUserAccountID, assigneeAccountID, taskReportID, assigneeChatReportID, parentReportID, title, assigneeChatReport);
        optimisticData.push(...assigneeChatReportOnyxData.optimisticData);
        successData.push(...assigneeChatReportOnyxData.successData);
        failureData.push(...assigneeChatReportOnyxData.failureData);
    }
    // Now that we've created the optimistic chat report and chat reportActions, we can update the parent report data
    // FOR PARENT REPORT (SHARE DESTINATION)
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`,
        value: optimisticParentReport,
    }, {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
        value: { [optimisticAddCommentReport.reportAction.reportActionID]: optimisticAddCommentReport.reportAction },
    });
    const shouldUpdateNotificationPreference = !(0, EmptyObject_1.isEmptyObject)(parentReport) && ReportUtils.isHiddenForCurrentUser(parentReport);
    if (shouldUpdateNotificationPreference) {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`,
            value: {
                participants: {
                    [currentUserAccountID]: { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                },
            },
        });
    }
    // FOR QUICK ACTION NVP
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
        value: {
            action: CONST_1.default.QUICK_ACTIONS.ASSIGN_TASK,
            chatReportID: parentReportID,
            isFirstQuickAction: (0, EmptyObject_1.isEmptyObject)(quickAction),
            targetAccountID: assigneeAccountID,
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: ONYXKEYS_1.default.NVP_QUICK_ACTION_GLOBAL_CREATE,
        value: quickAction ?? null,
    });
    // If needed, update optimistic data for parent report action of the parent report.
    const optimisticParentReportData = ReportUtils.getOptimisticDataForParentReportAction(parentReport, currentTime, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
    optimisticParentReportData.forEach((parentReportData) => {
        if ((0, EmptyObject_1.isEmptyObject)(parentReportData)) {
            return;
        }
        optimisticData.push(parentReportData);
    });
    // FOR PARENT REPORT (SHARE DESTINATION)
    successData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
        value: { [optimisticAddCommentReport.reportAction.reportActionID]: { pendingAction: null, isOptimisticAction: null } },
    });
    // FOR PARENT REPORT (SHARE DESTINATION)
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`,
        value: {
            [optimisticAddCommentReport.reportAction.reportActionID]: {
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('task.genericCreateTaskFailureMessage'),
            },
        },
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`,
        value: {
            hasOutstandingChildTask: parentReport?.hasOutstandingChildTask,
        },
    });
    const parameters = {
        parentReportActionID: optimisticAddCommentReport.reportAction.reportActionID,
        parentReportID,
        taskReportID: optimisticTaskReport.reportID,
        createdTaskReportActionID: optimisticTaskCreatedAction.reportActionID,
        htmlTitle: optimisticTaskReport.reportName,
        description: optimisticTaskReport.description,
        assignee: assigneeEmail,
        assigneeAccountID,
        assigneeChatReportID,
        assigneeChatReportActionID: assigneeChatReportOnyxData?.optimisticAssigneeAddComment?.reportAction.reportActionID,
        assigneeChatCreatedReportActionID: assigneeChatReportOnyxData?.optimisticChatCreatedReportAction?.reportActionID,
    };
    (0, Sound_1.default)(Sound_1.SOUNDS.DONE);
    API.write(types_1.WRITE_COMMANDS.CREATE_TASK, parameters, { optimisticData, successData, failureData });
    if (!isCreatedUsingMarkdown) {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            clearOutTaskInfo();
        });
        Navigation_1.default.dismissModalWithReport({ reportID: parentReportID });
    }
    (0, Report_1.notifyNewAction)(parentReportID, currentUserAccountID, optimisticAddCommentReport.reportAction);
}
/**
 * @returns the object to update `report.hasOutstandingChildTask`
 */
function getOutstandingChildTask(taskReport) {
    const parentReportActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReport?.parentReportID}`] ?? {};
    return Object.values(parentReportActions).some((reportAction) => {
        if (String(reportAction.childReportID) === String(taskReport?.reportID)) {
            return false;
        }
        if (reportAction.childType === CONST_1.default.REPORT.TYPE.TASK &&
            reportAction?.childStateNum === CONST_1.default.REPORT.STATE_NUM.OPEN &&
            reportAction?.childStatusNum === CONST_1.default.REPORT.STATUS_NUM.OPEN &&
            !ReportActionsUtils.getReportActionMessage(reportAction)?.isDeletedParentAction) {
            return true;
        }
        return false;
    });
}
function buildTaskData(taskReport, taskReportID) {
    const message = `marked as complete`;
    const completedTaskReportAction = ReportUtils.buildOptimisticTaskReportAction(taskReportID, CONST_1.default.REPORT.ACTIONS.TYPE.TASK_COMPLETED, message);
    const parentReport = getParentReport(taskReport);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportID}`,
            value: {
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                lastReadTime: DateUtils_1.default.getDBTime(),
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReportID}`,
            value: { [completedTaskReportAction.reportActionID]: completedTaskReportAction },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReportID}`,
            value: {
                [completedTaskReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportID}`,
            value: {
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                lastReadTime: taskReport?.lastReadTime ?? null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReportID}`,
            value: {
                [completedTaskReportAction.reportActionID]: {
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('task.messages.error'),
                },
            },
        },
    ];
    if (parentReport?.hasOutstandingChildTask) {
        const hasOutstandingChildTask = getOutstandingChildTask(taskReport);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport?.parentReportID}`,
            value: {
                hasOutstandingChildTask,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport?.parentReportID}`,
            value: {
                hasOutstandingChildTask: parentReport?.hasOutstandingChildTask,
            },
        });
    }
    const parameters = {
        taskReportID,
        completedTaskReportActionID: completedTaskReportAction.reportActionID,
    };
    return { optimisticData, failureData, successData, parameters };
}
/**
 * Complete a task
 */
function completeTask(taskReport, reportIDFromAction) {
    const taskReportID = taskReport?.reportID ?? reportIDFromAction;
    if (!taskReportID) {
        return {};
    }
    const { optimisticData, successData, failureData, parameters } = buildTaskData(taskReport, taskReportID);
    (0, Sound_1.default)(Sound_1.SOUNDS.SUCCESS);
    API.write(types_1.WRITE_COMMANDS.COMPLETE_TASK, parameters, { optimisticData, successData, failureData });
    return { optimisticData, successData, failureData };
}
/**
 * Reopen a closed task
 */
function reopenTask(taskReport, reportIDFromAction) {
    const taskReportID = taskReport?.reportID ?? reportIDFromAction;
    if (!taskReportID) {
        return;
    }
    const message = `marked as incomplete`;
    const reopenedTaskReportAction = ReportUtils.buildOptimisticTaskReportAction(taskReportID, CONST_1.default.REPORT.ACTIONS.TYPE.TASK_REOPENED, message);
    const parentReport = getParentReport(taskReport);
    const hasOutstandingChildTask = taskReport?.managerID === currentUserAccountID ? true : parentReport?.hasOutstandingChildTask;
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportID}`,
            value: {
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                lastVisibleActionCreated: reopenedTaskReportAction.created,
                lastMessageText: message,
                lastActorAccountID: reopenedTaskReportAction.actorAccountID,
                lastReadTime: reopenedTaskReportAction.created,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport?.parentReportID}`,
            value: {
                hasOutstandingChildTask,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReportID}`,
            value: { [reopenedTaskReportAction.reportActionID]: reopenedTaskReportAction },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReportID}`,
            value: {
                [reopenedTaskReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportID}`,
            value: {
                stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport?.parentReportID}`,
            value: {
                hasOutstandingChildTask: taskReport?.hasOutstandingChildTask,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${taskReportID}`,
            value: {
                [reopenedTaskReportAction.reportActionID]: {
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('task.messages.error'),
                },
            },
        },
    ];
    const parameters = {
        taskReportID,
        reopenedTaskReportActionID: reopenedTaskReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.REOPEN_TASK, parameters, { optimisticData, successData, failureData });
}
function editTask(report, { title, description }) {
    // Create the EditedReportAction on the task
    const editTaskReportAction = ReportUtils.buildOptimisticEditedTaskFieldReportAction({ title, description });
    // Ensure title is defined before parsing it with getParsedComment. If title is undefined, fall back to reportName from report.
    // Trim the final parsed title for consistency.
    const reportName = title ? ReportUtils.getParsedComment(title, undefined, undefined, [...CONST_1.default.TASK_TITLE_DISABLED_RULES]) : (report?.reportName ?? '');
    const parsedTitle = (reportName ?? '').trim();
    // Description can be unset, so we default to an empty string if so
    const newDescription = typeof description === 'string' ? ReportUtils.getParsedComment(description) : report.description;
    const reportDescription = (newDescription ?? '').trim();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: { [editTaskReportAction.reportActionID]: editTaskReportAction },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: {
                reportName: parsedTitle,
                description: reportDescription,
                pendingFields: {
                    ...(title && { reportName: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
                    ...(description && { description: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
                },
                errorFields: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: { [editTaskReportAction.reportActionID]: { pendingAction: null } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: {
                reportName: parsedTitle,
                description: reportDescription,
                pendingFields: {
                    ...(title && { reportName: null }),
                    ...(description && { description: null }),
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: { [editTaskReportAction.reportActionID]: { pendingAction: null } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: {
                reportName: report.reportName,
                description: report.description,
            },
        },
    ];
    const parameters = {
        taskReportID: report.reportID,
        htmlTitle: parsedTitle,
        description: reportDescription,
        editedTaskReportActionID: editTaskReportAction.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.EDIT_TASK, parameters, { optimisticData, successData, failureData });
}
function editTaskAssignee(report, sessionAccountID, assigneeEmail, assigneeAccountID = 0, assigneeChatReport) {
    // Create the EditedReportAction on the task
    const editTaskReportAction = ReportUtils.buildOptimisticChangedTaskAssigneeReportAction(assigneeAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
    const reportName = report.reportName?.trim();
    let assigneeChatReportOnyxData;
    const assigneeChatReportID = assigneeChatReport?.reportID;
    const assigneeChatReportMetadata = ReportUtils.getReportMetadata(assigneeChatReportID);
    const parentReport = getParentReport(report);
    const taskOwnerAccountID = report?.ownerAccountID;
    const optimisticReport = {
        reportName,
        managerID: assigneeAccountID ?? report.managerID,
        pendingFields: {
            ...(assigneeAccountID && { managerID: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        },
        participants: {
            [currentUserAccountID]: {
                notificationPreference: [assigneeAccountID, taskOwnerAccountID].includes(currentUserAccountID) && !parentReport
                    ? CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS
                    : CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
            },
        },
    };
    const successReport = { pendingFields: { ...(assigneeAccountID && { managerID: null }) } };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: { [editTaskReportAction.reportActionID]: editTaskReportAction },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: optimisticReport,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: { [editTaskReportAction.reportActionID]: { pendingAction: null } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: successReport,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: { [editTaskReportAction.reportActionID]: { pendingAction: null } },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: { managerID: report.managerID },
        },
    ];
    if (currentUserAccountID === assigneeAccountID) {
        if (!(0, EmptyObject_1.isEmptyObject)(parentReport)) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`,
                value: { hasOutstandingChildTask: true },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`,
                value: { hasOutstandingChildTask: parentReport?.hasOutstandingChildTask },
            });
        }
    }
    if (report.managerID === currentUserAccountID) {
        const hasOutstandingChildTask = getOutstandingChildTask(report);
        if (!(0, EmptyObject_1.isEmptyObject)(parentReport)) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`,
                value: { hasOutstandingChildTask },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport.reportID}`,
                value: { hasOutstandingChildTask: parentReport?.hasOutstandingChildTask },
            });
        }
    }
    // If we make a change to the assignee, we want to add a comment to the assignee's chat
    // Check if the assignee actually changed
    if (assigneeAccountID && assigneeAccountID !== report.managerID && assigneeAccountID !== sessionAccountID && assigneeChatReport && assigneeChatReport && assigneeChatReportID) {
        optimisticReport.participants = {
            ...(optimisticReport.participants ?? {}),
            [assigneeAccountID]: {
                notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
            },
        };
        assigneeChatReportOnyxData = ReportUtils.getTaskAssigneeChatOnyxData(currentUserAccountID, assigneeAccountID, report.reportID, assigneeChatReportID, report.parentReportID, reportName ?? '', assigneeChatReport);
        if (assigneeChatReportMetadata?.isOptimisticReport && assigneeChatReport.pendingFields?.createChat !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
            // BE will send a different participant. We clear the optimistic one to avoid duplicated entries
            successReport.participants = { [assigneeAccountID]: null };
        }
        optimisticData.push(...assigneeChatReportOnyxData.optimisticData);
        successData.push(...assigneeChatReportOnyxData.successData);
        failureData.push(...assigneeChatReportOnyxData.failureData);
    }
    const parameters = {
        taskReportID: report.reportID,
        assignee: assigneeEmail,
        editedTaskReportActionID: editTaskReportAction.reportActionID,
        assigneeChatReportID,
        assigneeChatReportActionID: assigneeChatReportOnyxData?.optimisticAssigneeAddComment?.reportAction.reportActionID,
        assigneeChatCreatedReportActionID: assigneeChatReportOnyxData?.optimisticChatCreatedReportAction?.reportActionID,
    };
    API.write(types_1.WRITE_COMMANDS.EDIT_TASK_ASSIGNEE, parameters, { optimisticData, successData, failureData });
}
/**
 * Sets the report info for the task being viewed
 */
function setTaskReport(report) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { report });
}
/**
 * Sets the title and description values for the task
 */
function setDetailsValue(title, description) {
    // This is only needed for creation of a new task and so it should only be stored locally
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { title: title.trim(), description: description.trim() });
}
/**
 * Sets the title value for the task
 */
function setTitleValue(title) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { title: title.trim() });
}
/**
 * Sets the description value for the task
 */
function setDescriptionValue(description) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { description: description.trim() });
}
/**
 * Sets the shareDestination value for the task
 */
function setShareDestinationValue(shareDestination) {
    // This is only needed for creation of a new task and so it should only be stored locally
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { shareDestination });
}
/* Sets the assigneeChatReport details for the task
 */
function setAssigneeChatReport(chatReport, isOptimisticReport = false) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { assigneeChatReport: chatReport });
    if (isOptimisticReport) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chatReport.reportID}`, { isOptimisticReport });
    }
}
function setNewOptimisticAssignee(assigneeLogin, assigneeAccountID) {
    const report = ReportUtils.buildOptimisticChatReport({
        participantList: [assigneeAccountID, currentUserAccountID],
        reportName: '',
        policyID: CONST_1.default.POLICY.OWNER_EMAIL_FAKE,
        ownerAccountID: CONST_1.default.POLICY.OWNER_ACCOUNT_ID_FAKE,
        notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.HIDDEN,
    });
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`, report);
    const optimisticPersonalDetailsListAction = {
        accountID: assigneeAccountID,
        avatar: allPersonalDetails?.[assigneeAccountID]?.avatar,
        displayName: allPersonalDetails?.[assigneeAccountID]?.displayName ?? assigneeLogin,
        login: assigneeLogin,
    };
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [assigneeAccountID]: optimisticPersonalDetailsListAction });
    return { assignee: optimisticPersonalDetailsListAction, assigneeReport: report };
}
/**
 * Sets the assignee value for the task and checks for an existing chat with the assignee
 * If there is no existing chat, it creates an optimistic chat report
 * It also sets the shareDestination as that chat report if a share destination isn't already set
 */
function setAssigneeValue(assigneeEmail, assigneeAccountID, shareToReportID, chatReport, isCurrentUser = false, skipShareDestination = false) {
    let report = chatReport;
    if (isCurrentUser) {
        const selfDMReportID = ReportUtils.findSelfDMReportID();
        // If there is no share destination set, automatically set it to the assignee chat report
        // This allows for a much quicker process when creating a new task and is likely the desired share destination most times
        if (!shareToReportID && !skipShareDestination) {
            setShareDestinationValue(selfDMReportID);
        }
    }
    else {
        // Check for the chatReport by participants IDs
        if (!report) {
            report = ReportUtils.getChatByParticipants([assigneeAccountID, currentUserAccountID]);
        }
        // If chat report is still not found we need to build new optimistic chat report
        if (!report) {
            report = setNewOptimisticAssignee(assigneeEmail, assigneeAccountID).assigneeReport;
        }
        const reportMetadata = ReportUtils.getReportMetadata(report?.reportID);
        // The optimistic field may not exist in the existing report and it can be overridden by the optimistic field of previous report data when merging the assignee chat report
        // Therefore, we should add these optimistic fields here to prevent incorrect merging, which could lead to the creation of duplicate actions for an existing report
        setAssigneeChatReport({
            ...report,
            pendingFields: report?.pendingFields,
            pendingAction: report?.pendingAction,
        }, reportMetadata ? reportMetadata.isOptimisticReport : true);
        // If there is no share destination set, automatically set it to the assignee chat report
        // This allows for a much quicker process when creating a new task and is likely the desired share destination most times
        if (!shareToReportID && !skipShareDestination) {
            setShareDestinationValue(report?.reportID);
        }
    }
    // This is only needed for creation of a new task and so it should only be stored locally
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { assignee: assigneeEmail, assigneeAccountID });
    // When we're editing the assignee, we immediately call editTaskAssignee. Since setting the assignee is async,
    // the chatReport is not yet set when editTaskAssignee is called. So we return the chatReport here so that
    // editTaskAssignee can use it.
    return report;
}
/**
 * Sets the parentReportID value for the task
 */
function setParentReportID(parentReportID) {
    // This is only needed for creation of a new task and so it should only be stored locally
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.TASK, { parentReportID });
}
/**
 * Clears out the task info from the store and navigates to the NewTaskDetails page
 */
function clearOutTaskInfoAndNavigate(reportID, chatReport, accountID = 0, skipConfirmation = false) {
    clearOutTaskInfo(skipConfirmation);
    if (reportID && reportID !== '0') {
        setParentReportID(reportID);
    }
    if (accountID > 0) {
        const accountLogin = allPersonalDetails?.[accountID]?.login ?? '';
        setAssigneeValue(accountLogin, accountID, reportID, chatReport, accountID === currentUserAccountID, skipConfirmation);
    }
    Navigation_1.default.navigate(ROUTES_1.default.NEW_TASK_DETAILS.getRoute(Navigation_1.default.getReportRHPActiveRoute()));
}
/**
 * Start out create task action quick action step
 */
function startOutCreateTaskQuickAction(reportID, targetAccountID) {
    // The second parameter of clearOutTaskInfoAndNavigate is the chat report or DM report
    // between the user and the person to whom the task is assigned.
    // Since chatReportID isn't stored in NVP_QUICK_ACTION_GLOBAL_CREATE, we set
    // it to undefined. This will make setAssigneeValue to search for the correct report.
    clearOutTaskInfoAndNavigate(reportID, undefined, targetAccountID, true);
}
/**
 * Get the assignee data
 */
function getAssignee(assigneeAccountID, personalDetails) {
    if (!assigneeAccountID) {
        return;
    }
    const details = personalDetails?.[assigneeAccountID];
    if (!details) {
        return {
            icons: [],
            displayName: '',
            subtitle: '',
        };
    }
    return {
        icons: ReportUtils.getIconsForParticipants([details.accountID], personalDetails),
        displayName: LocalePhoneNumber.formatPhoneNumber(PersonalDetailsUtils.getDisplayNameOrDefault(details)),
        subtitle: details.login ?? '',
    };
}
/**
 * Get the share destination data
 * */
function getShareDestination(reportID, reports, personalDetails, localeCompare) {
    const report = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const isOneOnOneChat = ReportUtils.isOneOnOneChat(report);
    const participants = ReportUtils.getParticipantsAccountIDsForDisplay(report);
    const isMultipleParticipant = participants.length > 1;
    const displayNamesWithTooltips = ReportUtils.getDisplayNamesWithTooltips(OptionsListUtils.getPersonalDetailsForAccountIDs(participants, personalDetails), isMultipleParticipant, localeCompare);
    let subtitle = '';
    if (isOneOnOneChat) {
        const participantAccountID = participants.at(0) ?? -1;
        const displayName = personalDetails?.[participantAccountID]?.displayName ?? '';
        const login = personalDetails?.[participantAccountID]?.login ?? '';
        subtitle = LocalePhoneNumber.formatPhoneNumber(login || displayName);
    }
    else {
        subtitle = ReportUtils.getChatRoomSubtitle(report) ?? '';
    }
    return {
        icons: ReportUtils.getIcons(report, personalDetails, Expensicons.FallbackAvatar),
        displayName: ReportUtils.getReportName(report),
        subtitle,
        displayNamesWithTooltips,
        shouldUseFullTitleToDisplay: ReportUtils.shouldUseFullTitleToDisplay(report),
    };
}
/**
 * Returns the parentReportAction if the given report is a thread/task.
 */
function getParentReportAction(report) {
    // If the report is not a thread report, then it won't have a parent and an empty object can be returned.
    if (!report?.parentReportID || !report.parentReportActionID) {
        return undefined;
    }
    return allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`]?.[report.parentReportActionID];
}
/**
 * Returns the parentReport if the given report is a thread
 */
function getParentReport(report) {
    if (!report?.parentReportID) {
        return undefined;
    }
    return allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.parentReportID}`];
}
/**
 * Calculate the URL to navigate to after a task deletion
 * @param report - The task report being deleted
 * @returns The URL to navigate to
 */
function getNavigationUrlOnTaskDelete(report) {
    if (!report) {
        return undefined;
    }
    const shouldDeleteTaskReport = !ReportActionsUtils.doesReportHaveVisibleActions(report.reportID);
    if (!shouldDeleteTaskReport) {
        return undefined;
    }
    // First try to navigate to parent report
    const parentReport = getParentReport(report);
    if (parentReport?.reportID) {
        return ROUTES_1.default.REPORT_WITH_ID.getRoute(parentReport.reportID);
    }
    // If no parent report, try to navigate to most recent report
    const mostRecentReportID = (0, Report_1.getMostRecentReportID)(report);
    if (mostRecentReportID) {
        return ROUTES_1.default.REPORT_WITH_ID.getRoute(mostRecentReportID);
    }
    return undefined;
}
/**
 * Cancels a task by setting the report state to SUBMITTED and status to CLOSED
 */
function deleteTask(report, isReportArchived) {
    if (!report) {
        return;
    }
    const message = `deleted task: ${report.reportName}`;
    const optimisticCancelReportAction = ReportUtils.buildOptimisticTaskReportAction(report.reportID, CONST_1.default.REPORT.ACTIONS.TYPE.TASK_CANCELLED, message);
    const optimisticReportActionID = optimisticCancelReportAction.reportActionID;
    const parentReportAction = getParentReportAction(report);
    const parentReport = getParentReport(report);
    const canUserPerformWriteAction = ReportUtils.canUserPerformWriteAction(report, isReportArchived);
    // If the task report is the last visible action in the parent report, we should navigate back to the parent report
    const shouldDeleteTaskReport = !ReportActionsUtils.doesReportHaveVisibleActions(report.reportID, canUserPerformWriteAction);
    const optimisticReportAction = {
        pendingAction: shouldDeleteTaskReport ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE : CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
        previousMessage: parentReportAction?.message,
        message: [
            {
                translationKey: '',
                type: 'COMMENT',
                html: '',
                text: '',
                isEdited: true,
                isDeletedParentAction: true,
            },
        ],
        errors: undefined,
        linkMetadata: [],
    };
    const optimisticReportActions = parentReportAction?.reportActionID ? { [parentReportAction?.reportActionID]: optimisticReportAction } : {};
    const hasOutstandingChildTask = getOutstandingChildTask(report);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: {
                lastVisibleActionCreated: optimisticCancelReportAction.created,
                lastMessageText: message,
                lastActorAccountID: optimisticCancelReportAction.actorAccountID,
                isDeletedParentAction: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`,
            value: {
                lastMessageText: ReportActionsUtils.getLastVisibleMessage(parentReport?.reportID, canUserPerformWriteAction, optimisticReportActions).lastMessageText ?? '',
                lastVisibleActionCreated: ReportActionsUtils.getLastVisibleAction(parentReport?.reportID, canUserPerformWriteAction, optimisticReportActions)
                    ?.created,
                hasOutstandingChildTask,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: {
                [optimisticReportActionID]: optimisticCancelReportAction,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport?.reportID}`,
            value: optimisticReportActions,
        },
    ];
    // Update optimistic data for parent report action if the report is a child report and the task report has no visible child
    const childVisibleActionCount = parentReportAction?.childVisibleActionCount ?? 0;
    if (childVisibleActionCount === 0) {
        const optimisticParentReportData = ReportUtils.getOptimisticDataForParentReportAction(parentReport, parentReport?.lastVisibleActionCreated ?? '', CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
        optimisticParentReportData.forEach((parentReportData) => {
            if ((0, EmptyObject_1.isEmptyObject)(parentReportData)) {
                return;
            }
            optimisticData.push(parentReportData);
        });
    }
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: {
                [optimisticReportActionID]: {
                    pendingAction: null,
                },
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport?.reportID}`,
            value: parentReportAction?.reportActionID ? { [parentReportAction.reportActionID]: { pendingAction: null } } : {},
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report.reportID}`,
            value: {
                stateNum: report.stateNum ?? '',
                statusNum: report.statusNum ?? '',
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReport?.reportID}`,
            value: {
                hasOutstandingChildTask: parentReport?.hasOutstandingChildTask,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`,
            value: {
                [optimisticReportActionID]: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReport?.reportID}`,
            value: parentReportAction?.reportActionID ? { [parentReportAction?.reportActionID]: { pendingAction: null } } : {},
        },
    ];
    const parameters = {
        cancelledTaskReportActionID: optimisticReportActionID,
        taskReportID: report.reportID,
    };
    API.write(types_1.WRITE_COMMANDS.CANCEL_TASK, parameters, { optimisticData, successData, failureData });
    (0, Report_1.notifyNewAction)(report.reportID, currentUserAccountID);
    const urlToNavigateBack = getNavigationUrlOnTaskDelete(report);
    if (urlToNavigateBack) {
        Navigation_1.default.goBack();
        return urlToNavigateBack;
    }
}
/**
 * Closes the current open task modal and clears out the task info from the store.
 */
function dismissModalAndClearOutTaskInfo(backTo) {
    if (backTo) {
        Navigation_1.default.goBack(backTo);
    }
    else {
        Navigation_1.default.closeRHPFlow();
    }
    clearOutTaskInfo();
}
/**
 * Returns Task assignee accountID
 */
function getTaskAssigneeAccountID(taskReport) {
    if (!taskReport) {
        return;
    }
    if (taskReport.managerID) {
        return taskReport.managerID;
    }
    const reportAction = getParentReportAction(taskReport);
    return reportAction?.childManagerAccountID;
}
/**
 * Check if you're allowed to modify the task - only the author can modify the task
 */
function canModifyTask(taskReport, sessionAccountID, isParentReportArchived = false) {
    if (!sessionAccountID) {
        return false;
    }
    if (ReportUtils.isCanceledTaskReport(taskReport)) {
        return false;
    }
    if (isParentReportArchived) {
        return false;
    }
    return sessionAccountID === taskReport?.ownerAccountID;
}
/**
 * Check if you can change the status of the task (mark complete or incomplete). Only the task owner and task assignee can do this.
 */
function canActionTask(taskReport, sessionAccountID, parentReport, isParentReportArchived = false) {
    // Return early if there was no sessionAccountID (this can happen because when connecting to the session key in onyx, the session will be undefined initially)
    if (!sessionAccountID) {
        return false;
    }
    // When there is no parent report, exit early (this can also happen due to onyx key initialization)
    if (!parentReport && !taskReport?.parentReportID) {
        return false;
    }
    // Cancelled task reports cannot be actioned since they are cancelled and users shouldn't be able to do anything with them
    if (ReportUtils.isCanceledTaskReport(taskReport)) {
        return false;
    }
    // If the parent report is a non expense report and it's archived, then the user cannot take actions (similar to cancelled task reports)
    const isParentAnExpenseReport = ReportUtils.isExpenseReport(parentReport);
    const isParentAnExpenseRequest = ReportUtils.isExpenseRequest(parentReport);
    const isParentANonExpenseReport = !(isParentAnExpenseReport || isParentAnExpenseRequest);
    if (isParentANonExpenseReport && isParentReportArchived) {
        return false;
    }
    // The task can only be actioned by the task report owner or the task assignee
    return sessionAccountID === taskReport?.ownerAccountID || sessionAccountID === getTaskAssigneeAccountID(taskReport);
}
function clearTaskErrors(reportID) {
    if (!reportID) {
        return;
    }
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    // Delete the task preview in the parent report
    if (report?.pendingFields?.createChat === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`, report.parentReportActionID ? { [report.parentReportActionID]: null } : {});
        (0, Report_1.navigateToConciergeChatAndDeleteReport)(reportID);
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, {
        pendingFields: null,
        errorFields: null,
    });
}
function getFinishOnboardingTaskOnyxData(taskName) {
    const taskReportID = introSelected?.[taskName];
    const taskReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportID}`];
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReport?.parentReportID}`];
    const parentReportNameValuePairs = allReportNameValuePair?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${parentReport?.reportID}`];
    const isParentReportArchived = ReportUtils.isArchivedReport(parentReportNameValuePairs);
    if (taskReportID && canActionTask(taskReport, currentUserAccountID, parentReport, isParentReportArchived)) {
        if (taskReport) {
            if (taskReport.stateNum !== CONST_1.default.REPORT.STATE_NUM.APPROVED || taskReport.statusNum !== CONST_1.default.REPORT.STATUS_NUM.APPROVED) {
                return completeTask(taskReport);
            }
        }
    }
    return {};
}
function completeTestDriveTask(shouldUpdateSelfTourViewedOnlyLocally = false) {
    (0, Welcome_1.setSelfTourViewed)(shouldUpdateSelfTourViewedOnlyLocally);
    getFinishOnboardingTaskOnyxData(CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR);
}
