"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const ReportUtils_1 = require("@libs/ReportUtils");
const TripReservationUtils_1 = require("@libs/TripReservationUtils");
const Link_1 = require("@userActions/Link");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CarTripDetails_1 = require("./CarTripDetails");
const FlightTripDetails_1 = require("./FlightTripDetails");
const HotelTripDetails_1 = require("./HotelTripDetails");
const TrainTripDetails_1 = require("./TrainTripDetails");
function pickTravelerPersonalDetails(personalDetails, reservation) {
    return Object.values(personalDetails ?? {})?.find((personalDetail) => personalDetail?.login === reservation?.travelerPersonalInfo?.email);
}
function TripDetailsPage({ route }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const isBlockedFromSpotnanaTravel = isBetaEnabled(CONST_1.default.BETAS.PREVENT_SPOTNANA_TRAVEL);
    const { isOffline } = (0, useNetwork_1.default)();
    const [isModifyTripLoading, setIsModifyTripLoading] = (0, react_1.useState)(false);
    const [isTripSupportLoading, setIsTripSupportLoading] = (0, react_1.useState)(false);
    const { transactionID, sequenceIndex, pnr, reportID } = route.params;
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: true });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`, { canBeMissing: true });
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID ?? reportID}`, { canBeMissing: true });
    const tripID = (0, ReportUtils_1.getTripIDFromTransactionParentReportID)(parentReport?.reportID);
    // If pnr is not passed and transaction is present, we want to use transaction to get the trip reservations as the provided sequenceIndex now refers to the position of trip reservation in transaction's reservation list
    const tripReservations = (0, TripReservationUtils_1.getReservationsFromTripReport)(!Number(pnr) && transaction ? undefined : parentReport, transaction ? [transaction] : []);
    const { reservation, prevReservation, reservationType, reservationIcon } = (0, TripReservationUtils_1.getReservationDetailsFromSequence)(tripReservations, Number(sequenceIndex));
    const [travelerPersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { selector: (personalDetails) => pickTravelerPersonalDetails(personalDetails, reservation), canBeMissing: true });
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={TripDetailsPage.displayName} shouldShowOfflineIndicatorInWideScreen>
            <FullPageNotFoundView_1.default shouldForceFullScreen shouldShow={!reservation || (!CONFIG_1.default.IS_HYBRID_APP && isBlockedFromSpotnanaTravel)}>
                <HeaderWithBackButton_1.default title={reservationType ? `${translate(`travel.${reservationType}`)} ${translate('common.details').toLowerCase()}` : translate('common.details')} shouldShowBackButton icon={reservationIcon} iconHeight={20} iconWidth={20} iconStyles={[StyleUtils.getTripReservationIconContainer(false), styles.mr3]} iconFill={theme.icon}/>
                <ScrollView_1.default>
                    {!!reservation && reservationType === CONST_1.default.RESERVATION_TYPE.FLIGHT && (<FlightTripDetails_1.default prevReservation={prevReservation} reservation={reservation} personalDetails={travelerPersonalDetails}/>)}
                    {!!reservation && reservationType === CONST_1.default.RESERVATION_TYPE.HOTEL && (<HotelTripDetails_1.default reservation={reservation} personalDetails={travelerPersonalDetails}/>)}
                    {!!reservation && reservationType === CONST_1.default.RESERVATION_TYPE.CAR && (<CarTripDetails_1.default reservation={reservation} personalDetails={travelerPersonalDetails}/>)}
                    {!!reservation && reservationType === CONST_1.default.RESERVATION_TYPE.TRAIN && (<TrainTripDetails_1.default reservation={reservation} personalDetails={travelerPersonalDetails}/>)}
                    <MenuItem_1.default title={translate('travel.modifyTrip')} icon={Expensicons.Pencil} iconRight={Expensicons.NewWindow} shouldShowRightIcon onPress={() => {
            setIsModifyTripLoading(true);
            (0, Link_1.openTravelDotLink)(activePolicyID, CONST_1.default.TRIP_ID_PATH(tripID))?.finally(() => {
                setIsModifyTripLoading(false);
            });
        }} wrapperStyle={styles.mt3} shouldShowLoadingSpinnerIcon={isModifyTripLoading} disabled={isModifyTripLoading || isOffline}/>
                    <MenuItem_1.default title={translate('travel.tripSupport')} icon={Expensicons.Phone} iconRight={Expensicons.NewWindow} shouldShowRightIcon onPress={() => {
            setIsTripSupportLoading(true);
            (0, Link_1.openTravelDotLink)(activePolicyID, CONST_1.default.TRIP_SUPPORT)?.finally(() => {
                setIsTripSupportLoading(false);
            });
        }} shouldShowLoadingSpinnerIcon={isTripSupportLoading} disabled={isTripSupportLoading || isOffline}/>
                </ScrollView_1.default>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TripDetailsPage.displayName = 'TripDetailsPage';
exports.default = TripDetailsPage;
