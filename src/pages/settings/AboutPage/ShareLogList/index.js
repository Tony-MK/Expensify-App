"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const BaseShareLogList_1 = require("./BaseShareLogList");
function ShareLogList({ logSource }) {
    const personalDetail = (0, useCurrentUserPersonalDetails_1.default)();
    const onAttachLogToReport = (reportID, filename) => {
        (0, FileUtils_1.readFileAsync)(logSource, filename, (file) => {
            (0, Report_1.addAttachment)(reportID, file, personalDetail?.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE);
            const routeToNavigate = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID);
            Navigation_1.default.navigate(routeToNavigate);
        }, () => { });
    };
    return <BaseShareLogList_1.default onAttachLogToReport={onAttachLogToReport}/>;
}
exports.default = ShareLogList;
