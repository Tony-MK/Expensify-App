"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useParentReport_1 = require("@hooks/useParentReport");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils_1 = require("@libs/ReportUtils");
const TaskUtils_1 = require("@libs/TaskUtils");
const Session_1 = require("@userActions/Session");
const Task_1 = require("@userActions/Task");
const Button_1 = require("./Button");
const OnyxListItemProvider_1 = require("./OnyxListItemProvider");
function TaskHeaderActionButton({ report }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const parentReport = (0, useParentReport_1.default)(report.reportID);
    const isParentReportArchived = (0, useReportIsArchived_1.default)(parentReport?.reportID);
    const isTaskActionable = (0, Task_1.canActionTask)(report, session?.accountID, parentReport, isParentReportArchived);
    if (!(0, ReportUtils_1.canWriteInReport)(report)) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentEnd]}>
            <Button_1.default success isDisabled={!isTaskActionable} text={translate((0, ReportUtils_1.isCompletedTaskReport)(report) ? 'task.markAsIncomplete' : 'task.markAsComplete')} onPress={(0, Session_1.callFunctionIfActionIsAllowed)(() => {
            // If we're already navigating to these task editing pages, early return not to mark as completed, otherwise we would have not found page.
            if ((0, TaskUtils_1.isActiveTaskEditRoute)(report.reportID)) {
                return;
            }
            if ((0, ReportUtils_1.isCompletedTaskReport)(report)) {
                (0, Task_1.reopenTask)(report);
            }
            else {
                (0, Task_1.completeTask)(report);
            }
        })} style={styles.flex1}/>
        </react_native_1.View>);
}
TaskHeaderActionButton.displayName = 'TaskHeaderActionButton';
exports.default = TaskHeaderActionButton;
