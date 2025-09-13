"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Share_1 = require("@libs/actions/Share");
const Navigation_1 = require("@libs/Navigation/Navigation");
const MoneyRequestParticipantsSelector_1 = require("@pages/iou/request/MoneyRequestParticipantsSelector");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
function ShareTabParticipantsSelectorComponent({ detailsPageRouteObject }, ref) {
    return (<MoneyRequestParticipantsSelector_1.default ref={ref} iouType={CONST_1.default.IOU.TYPE.SUBMIT} onParticipantsAdded={(value) => {
            const participant = value.at(0);
            let reportID = participant?.reportID ?? CONST_1.default.DEFAULT_NUMBER_ID;
            const accountID = participant?.accountID;
            if (accountID && !reportID) {
                (0, Share_1.saveUnknownUserDetails)(participant);
                const optimisticReport = (0, Report_1.getOptimisticChatReport)(accountID);
                reportID = optimisticReport.reportID;
                (0, Report_1.saveReportDraft)(reportID, optimisticReport).then(() => {
                    Navigation_1.default.navigate(detailsPageRouteObject.getRoute(reportID.toString()));
                });
            }
            else {
                Navigation_1.default.navigate(detailsPageRouteObject.getRoute(reportID.toString()));
            }
        }} action="create"/>);
}
exports.default = (0, react_1.forwardRef)(ShareTabParticipantsSelectorComponent);
