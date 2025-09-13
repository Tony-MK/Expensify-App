"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var BaseShareLogList_1 = require("./BaseShareLogList");
function ShareLogList(_a) {
    var logSource = _a.logSource;
    var personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    var onAttachLogToReport = function (reportID, filename) {
        (0, FileUtils_1.readFileAsync)(logSource, filename, function (file) {
            var _a;
            (0, Report_1.addAttachment)(reportID, file, (_a = personalDetail === null || personalDetail === void 0 ? void 0 : personalDetail.timezone) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_TIME_ZONE);
            var routeToNavigate = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID);
            Navigation_1.default.navigate(routeToNavigate);
        }, function () { });
    };
    return <BaseShareLogList_1.default onAttachLogToReport={onAttachLogToReport}/>;
}
exports.default = ShareLogList;
