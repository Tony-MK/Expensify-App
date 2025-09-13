"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const ShareCodePage_1 = require("@pages/ShareCodePage");
const withReportOrNotFound_1 = require("./withReportOrNotFound");
function ReportDetailsShareCodePage({ report, policy, route }) {
    if ((0, ReportUtils_1.isSelfDM)(report)) {
        return <NotFoundPage_1.default />;
    }
    return (<ShareCodePage_1.default backTo={route.params?.backTo} report={report} policy={policy}/>);
}
exports.default = (0, withReportOrNotFound_1.default)()(ReportDetailsShareCodePage);
