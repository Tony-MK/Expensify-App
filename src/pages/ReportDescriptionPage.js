"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportUtils = require("@libs/ReportUtils");
const withReportOrNotFound_1 = require("./home/report/withReportOrNotFound");
const RoomDescriptionPage_1 = require("./RoomDescriptionPage");
const TaskDescriptionPage_1 = require("./tasks/TaskDescriptionPage");
function ReportDescriptionPage(props) {
    const isTask = ReportUtils.isTaskReport(props.report);
    if (isTask) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <TaskDescriptionPage_1.default {...props}/>;
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <RoomDescriptionPage_1.default {...props}/>;
}
ReportDescriptionPage.displayName = 'ReportDescriptionPage';
exports.default = (0, withReportOrNotFound_1.default)()(ReportDescriptionPage);
