"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationView = ReservationView;
var date_fns_1 = require("date-fns");
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Icon_1 = require("@components/Icon");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var Section_1 = require("@components/Section");
var SpacerView_1 = require("@components/SpacerView");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var DateUtils_1 = require("@libs/DateUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var StringUtils_1 = require("@libs/StringUtils");
var variables_1 = require("@styles/variables");
var Expensicons = require("@src/components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
var TripReservationUtils_1 = require("@src/libs/TripReservationUtils");
var ROUTES_1 = require("@src/ROUTES");
function ReservationView(_a) {
    var reservation = _a.reservation, transactionID = _a.transactionID, tripRoomReportID = _a.tripRoomReportID, sequenceIndex = _a.sequenceIndex, _b = _a.shouldShowArrowIcon, shouldShowArrowIcon = _b === void 0 ? true : _b, _c = _a.shouldCenterIcon, shouldCenterIcon = _c === void 0 ? false : _c;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var reservationIcon = (0, TripReservationUtils_1.getTripReservationIcon)(reservation.type);
    var getFormattedDate = function () {
        switch (reservation.type) {
            case CONST_1.default.RESERVATION_TYPE.FLIGHT:
                return DateUtils_1.default.getFormattedTransportDate(new Date(reservation.start.date));
            case CONST_1.default.RESERVATION_TYPE.HOTEL:
            case CONST_1.default.RESERVATION_TYPE.CAR:
                return DateUtils_1.default.getFormattedReservationRangeDate(new Date(reservation.start.date), new Date(reservation.end.date));
            default:
                return DateUtils_1.default.formatToLongDateWithWeekday(new Date(reservation.start.date));
        }
    };
    var formattedDate = getFormattedDate();
    var bottomDescription = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var code = (0, TripReservationUtils_1.getTripReservationCode)(reservation);
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.FLIGHT) {
            var longName = ((_a = reservation.company) === null || _a === void 0 ? void 0 : _a.longName) ? "".concat((_b = reservation.company) === null || _b === void 0 ? void 0 : _b.longName, " \u2022 ") : '';
            var shortName = ((_c = reservation === null || reservation === void 0 ? void 0 : reservation.company) === null || _c === void 0 ? void 0 : _c.shortName) ? "".concat((_d = reservation === null || reservation === void 0 ? void 0 : reservation.company) === null || _d === void 0 ? void 0 : _d.shortName, " ") : '';
            return "".concat(code).concat(longName).concat(shortName).concat((_e = reservation.route) === null || _e === void 0 ? void 0 : _e.number);
        }
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.HOTEL) {
            return "".concat(code).concat(StringUtils_1.default.removeDoubleQuotes(reservation.start.address));
        }
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.CAR) {
            var vendor = reservation.vendor ? "".concat(reservation.vendor, " \u2022 ") : '';
            return "".concat(vendor).concat(reservation.start.location);
        }
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.TRAIN) {
            return (_f = reservation.route) === null || _f === void 0 ? void 0 : _f.name;
        }
        return (_g = StringUtils_1.default.removeDoubleQuotes(reservation.start.address)) !== null && _g !== void 0 ? _g : reservation.start.location;
    }, [reservation]);
    var titleComponent = function () {
        var _a, _b;
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.FLIGHT || reservation.type === CONST_1.default.RESERVATION_TYPE.TRAIN) {
            return (<react_native_1.View style={styles.gap1}>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
                        {shouldShowArrowIcon ? (<>
                                <Text_1.default style={[styles.textStrong, styles.lh20, shouldUseNarrowLayout && styles.flex1]}>{(0, TripReservationUtils_1.formatAirportInfo)(reservation.start)}</Text_1.default>
                                <Icon_1.default src={Expensicons.ArrowRightLong} width={variables_1.default.iconSizeSmall} height={variables_1.default.iconSizeSmall} fill={theme.icon}/>
                                <Text_1.default style={[styles.textStrong, styles.lh20, shouldUseNarrowLayout && styles.flex1]}>{(0, TripReservationUtils_1.formatAirportInfo)(reservation.end)}</Text_1.default>
                            </>) : (<Text_1.default style={[styles.textStrong, styles.lh20, shouldUseNarrowLayout && styles.flex1]}>
                                {(0, TripReservationUtils_1.formatAirportInfo)(reservation.start)} {translate('common.to').toLowerCase()} {(0, TripReservationUtils_1.formatAirportInfo)(reservation.end)}
                            </Text_1.default>)}
                    </react_native_1.View>
                    {!!bottomDescription && <Text_1.default style={[styles.textSmall, styles.colorMuted, styles.lh14]}>{bottomDescription}</Text_1.default>}
                </react_native_1.View>);
        }
        return (<react_native_1.View style={styles.gap1}>
                <Text_1.default numberOfLines={1} style={[styles.textStrong, styles.lh20]}>
                    {reservation.type === CONST_1.default.RESERVATION_TYPE.CAR ? (_a = reservation.carInfo) === null || _a === void 0 ? void 0 : _a.name : expensify_common_1.Str.recapitalize((_b = reservation.start.longName) !== null && _b !== void 0 ? _b : '')}
                </Text_1.default>
                {!!bottomDescription && (<Text_1.default style={[styles.textSmall, styles.colorMuted, styles.lh14]} testID={CONST_1.default.RESERVATION_ADDRESS_TEST_ID}>
                        {bottomDescription}
                    </Text_1.default>)}
            </react_native_1.View>);
    };
    return (<MenuItemWithTopDescription_1.default description={formattedDate} descriptionTextStyle={[styles.textLabelSupporting, styles.lh16]} titleComponent={titleComponent()} titleContainerStyle={[styles.justifyContentStart, styles.gap1]} secondaryIcon={reservationIcon} isSecondaryIconHoverable shouldShowRightIcon wrapperStyle={[styles.taskDescriptionMenuItem]} shouldGreyOutWhenDisabled={false} numberOfLinesTitle={0} interactive shouldStackHorizontally={false} onSecondaryInteraction={function () { }} iconHeight={20} iconWidth={20} iconStyles={[StyleUtils.getTripReservationIconContainer(false), styles.mr3, shouldCenterIcon && styles.alignSelfCenter]} secondaryIconFill={theme.icon} onPress={function () {
            return Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TRIP_DETAILS.getRoute(tripRoomReportID, transactionID, String(reservation.reservationID), sequenceIndex, Navigation_1.default.getReportRHPActiveRoute()));
        }}/>);
}
function TripDetailsView(_a) {
    var tripRoomReport = _a.tripRoomReport, shouldShowHorizontalRule = _a.shouldShowHorizontalRule, tripTransactions = _a.tripTransactions;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var getTripDescription = (0, react_1.useCallback)(function (amount, currency, reservations) {
        var trips = "".concat(reservations.length, " ").concat(reservations.length === 1 ? translate('travel.trip') : translate('travel.trips'));
        return "".concat((0, CurrencyUtils_1.convertToDisplayString)(amount, currency), " \u2022 ").concat(trips.toLowerCase());
    }, [translate]);
    var getTripTitle = (0, react_1.useCallback)(function (reservations) {
        var _a, _b, _c, _d, _e;
        if (reservations.length === 0) {
            return '';
        }
        var firstReservation = (_a = reservations.at(0)) === null || _a === void 0 ? void 0 : _a.reservation;
        var lastReservation = (_b = reservations.at(reservations.length - 1)) === null || _b === void 0 ? void 0 : _b.reservation;
        if (!lastReservation || !firstReservation) {
            return '';
        }
        switch (firstReservation === null || firstReservation === void 0 ? void 0 : firstReservation.type) {
            case CONST_1.default.RESERVATION_TYPE.FLIGHT: {
                var destinationReservation = reservations.filter(function (reservation) { return reservation.reservation.legId === firstReservation.legId; }).at(-1);
                if (!destinationReservation) {
                    return '';
                }
                return "".concat(translate('travel.flightTo'), " ").concat((0, TripReservationUtils_1.formatAirportInfo)(destinationReservation.reservation.end, true));
            }
            case CONST_1.default.RESERVATION_TYPE.TRAIN:
                if (reservations.length === 2 && firstReservation.start.shortName === lastReservation.end.shortName) {
                    return "".concat(translate('travel.trainTo'), " ").concat(expensify_common_1.Str.recapitalize((_c = lastReservation.start.longName) !== null && _c !== void 0 ? _c : ''));
                }
                return "".concat(translate('travel.trainTo'), " ").concat(expensify_common_1.Str.recapitalize((_d = lastReservation.end.longName) !== null && _d !== void 0 ? _d : ''));
            case CONST_1.default.RESERVATION_TYPE.HOTEL: {
                var nights = (0, date_fns_1.differenceInCalendarDays)(new Date(lastReservation === null || lastReservation === void 0 ? void 0 : lastReservation.end.date), new Date(firstReservation.start.date));
                return "".concat(nights, " ").concat(nights > 1 ? translate('travel.nightsIn') : translate('travel.nightIn'), " ").concat(expensify_common_1.Str.recapitalize((_e = firstReservation.start.longName) !== null && _e !== void 0 ? _e : ''));
            }
            case CONST_1.default.RESERVATION_TYPE.CAR: {
                var days = (0, date_fns_1.differenceInCalendarDays)(new Date(lastReservation.end.date), new Date(firstReservation.start.date));
                if (days > 0) {
                    return "".concat(days, " ").concat(days > 1 ? translate('common.days') : translate('common.day')).concat(translate('travel.carRental'));
                }
                return "".concat(DateUtils_1.default.getFormattedDurationBetweenDates(translate, new Date(firstReservation.start.date), new Date(lastReservation.end.date))).concat(translate('travel.carRental'));
            }
            default:
                return '';
        }
    }, [translate]);
    if (!tripRoomReport) {
        return null;
    }
    var reservationsData = (0, TripReservationUtils_1.getPNRReservationDataFromTripReport)(tripRoomReport, tripTransactions);
    return (<react_native_1.View style={[styles.flex1, styles.ph5]}>
            <react_native_1.View style={[styles.flexRow, styles.pointerEventsNone, styles.containerWithSpaceBetween, styles.pt3, styles.pb5]}>
                <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                    <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                        {translate('travel.tripSummary')}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[styles.gap5]}>
                {reservationsData.map(function (_a) {
            var reservations = _a.reservations, pnrID = _a.pnrID, currency = _a.currency, totalFareAmount = _a.totalFareAmount;
            return (<Section_1.default key={pnrID} title={getTripTitle(reservations)} subtitle={getTripDescription(totalFareAmount, currency, reservations)} containerStyles={[styles.ph0, styles.mh0, styles.mb0, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]} titleStyles={[styles.textStrong, styles.textNormal, styles.ph5]} subtitleStyles={[styles.ph5, styles.pb1, styles.mt1]} subtitleTextStyles={[styles.textLabelSupporting, styles.textLineHeightNormal]} subtitleMuted>
                        {reservations.map(function (_a) {
                    var reservation = _a.reservation, transactionID = _a.transactionID, sequenceIndex = _a.sequenceIndex;
                    return (<OfflineWithFeedback_1.default key={"".concat(pnrID, "-").concat(sequenceIndex)}>
                                    <ReservationView reservation={reservation} transactionID={transactionID} tripRoomReportID={tripRoomReport.reportID} sequenceIndex={sequenceIndex} shouldShowArrowIcon={false} shouldCenterIcon/>
                                </OfflineWithFeedback_1.default>);
                })}
                    </Section_1.default>);
        })}
            </react_native_1.View>
            <SpacerView_1.default shouldShow={shouldShowHorizontalRule} style={[shouldShowHorizontalRule && styles.reportHorizontalRule]}/>
        </react_native_1.View>);
}
TripDetailsView.displayName = 'TripDetailsView';
exports.default = TripDetailsView;
