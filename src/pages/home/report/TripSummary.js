"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const TripDetailsView_1 = require("@components/ReportActionItem/TripDetailsView");
const useOnyx_1 = require("@hooks/useOnyx");
const useTripTransactions_1 = require("@hooks/useTripTransactions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TripSummary({ reportID }) {
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID ?? CONST_1.default.DEFAULT_NUMBER_ID}`);
    const tripTransactions = (0, useTripTransactions_1.default)(reportID);
    if (!reportID) {
        return null;
    }
    return (<OfflineWithFeedback_1.default pendingAction={report?.pendingAction}>
            <TripDetailsView_1.default tripRoomReport={report} tripTransactions={tripTransactions} shouldShowHorizontalRule={false}/>
        </OfflineWithFeedback_1.default>);
}
TripSummary.displayName = 'TripSummary';
exports.default = TripSummary;
