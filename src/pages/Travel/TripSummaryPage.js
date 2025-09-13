"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const TripDetailsView_1 = require("@components/ReportActionItem/TripDetailsView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const CONFIG_1 = require("@src/CONFIG");
const TripReservationUtils = require("@src/libs/TripReservationUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TripSummaryPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${route.params.reportID}`, { canBeMissing: true });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(route.params.transactionID)}`, { canBeMissing: true });
    const reservationsData = TripReservationUtils.getReservationsFromTripReport(report, transaction ? [transaction] : []);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={TripSummaryPage.displayName} shouldShowOfflineIndicatorInWideScreen>
            <FullPageNotFoundView_1.default shouldForceFullScreen shouldShow={reservationsData.length === 0 || !CONFIG_1.default.IS_HYBRID_APP}>
                <HeaderWithBackButton_1.default title={translate(`travel.tripDetails`)} shouldShowBackButton/>
                <ScrollView_1.default>
                    {reservationsData.map(({ reservation, transactionID, sequenceIndex }) => {
            return (<OfflineWithFeedback_1.default key={`${transactionID}-${sequenceIndex}`}>
                                <TripDetailsView_1.ReservationView reservation={reservation} transactionID={transactionID} tripRoomReportID={route.params.reportID} sequenceIndex={sequenceIndex}/>
                            </OfflineWithFeedback_1.default>);
        })}
                </ScrollView_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TripSummaryPage.displayName = 'TripSummaryPage';
exports.default = TripSummaryPage;
