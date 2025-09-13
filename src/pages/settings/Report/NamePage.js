"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportUtils_1 = require("@libs/ReportUtils");
const GroupChatNameEditPage_1 = require("@pages/GroupChatNameEditPage");
const withReportOrNotFound_1 = require("@pages/home/report/withReportOrNotFound");
const TripChatNameEditPage_1 = require("@pages/TripChatNameEditPage");
const RoomNamePage_1 = require("./RoomNamePage");
function NamePage({ report }) {
    if ((0, ReportUtils_1.isTripRoom)(report)) {
        return <TripChatNameEditPage_1.default report={report}/>;
    }
    if ((0, ReportUtils_1.isGroupChat)(report)) {
        return <GroupChatNameEditPage_1.default report={report}/>;
    }
    return <RoomNamePage_1.default report={report}/>;
}
NamePage.displayName = 'NamePage';
exports.default = (0, withReportOrNotFound_1.default)()(NamePage);
