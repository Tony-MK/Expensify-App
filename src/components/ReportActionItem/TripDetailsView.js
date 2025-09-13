"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationView = ReservationView;
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Section_1 = require("@components/Section");
const SpacerView_1 = require("@components/SpacerView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const StringUtils_1 = require("@libs/StringUtils");
const variables_1 = require("@styles/variables");
const Expensicons = require("@src/components/Icon/Expensicons");
const CONST_1 = require("@src/CONST");
const TripReservationUtils_1 = require("@src/libs/TripReservationUtils");
const ROUTES_1 = require("@src/ROUTES");
function ReservationView({ reservation, transactionID, tripRoomReportID, sequenceIndex, shouldShowArrowIcon = true, shouldCenterIcon = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const reservationIcon = (0, TripReservationUtils_1.getTripReservationIcon)(reservation.type);
    const getFormattedDate = () => {
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
    const formattedDate = getFormattedDate();
    const bottomDescription = (0, react_1.useMemo)(() => {
        const code = (0, TripReservationUtils_1.getTripReservationCode)(reservation);
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.FLIGHT) {
            const longName = reservation.company?.longName ? `${reservation.company?.longName} • ` : '';
            const shortName = reservation?.company?.shortName ? `${reservation?.company?.shortName} ` : '';
            return `${code}${longName}${shortName}${reservation.route?.number}`;
        }
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.HOTEL) {
            return `${code}${StringUtils_1.default.removeDoubleQuotes(reservation.start.address)}`;
        }
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.CAR) {
            const vendor = reservation.vendor ? `${reservation.vendor} • ` : '';
            return `${vendor}${reservation.start.location}`;
        }
        if (reservation.type === CONST_1.default.RESERVATION_TYPE.TRAIN) {
            return reservation.route?.name;
        }
        return StringUtils_1.default.removeDoubleQuotes(reservation.start.address) ?? reservation.start.location;
    }, [reservation]);
    const titleComponent = () => {
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
                    {reservation.type === CONST_1.default.RESERVATION_TYPE.CAR ? reservation.carInfo?.name : expensify_common_1.Str.recapitalize(reservation.start.longName ?? '')}
                </Text_1.default>
                {!!bottomDescription && (<Text_1.default style={[styles.textSmall, styles.colorMuted, styles.lh14]} testID={CONST_1.default.RESERVATION_ADDRESS_TEST_ID}>
                        {bottomDescription}
                    </Text_1.default>)}
            </react_native_1.View>);
    };
    return (<MenuItemWithTopDescription_1.default description={formattedDate} descriptionTextStyle={[styles.textLabelSupporting, styles.lh16]} titleComponent={titleComponent()} titleContainerStyle={[styles.justifyContentStart, styles.gap1]} secondaryIcon={reservationIcon} isSecondaryIconHoverable shouldShowRightIcon wrapperStyle={[styles.taskDescriptionMenuItem]} shouldGreyOutWhenDisabled={false} numberOfLinesTitle={0} interactive shouldStackHorizontally={false} onSecondaryInteraction={() => { }} iconHeight={20} iconWidth={20} iconStyles={[StyleUtils.getTripReservationIconContainer(false), styles.mr3, shouldCenterIcon && styles.alignSelfCenter]} secondaryIconFill={theme.icon} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.TRAVEL_TRIP_DETAILS.getRoute(tripRoomReportID, transactionID, String(reservation.reservationID), sequenceIndex, Navigation_1.default.getReportRHPActiveRoute()))}/>);
}
function TripDetailsView({ tripRoomReport, shouldShowHorizontalRule, tripTransactions }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const getTripDescription = (0, react_1.useCallback)((amount, currency, reservations) => {
        const trips = `${reservations.length} ${reservations.length === 1 ? translate('travel.trip') : translate('travel.trips')}`;
        return `${(0, CurrencyUtils_1.convertToDisplayString)(amount, currency)} • ${trips.toLowerCase()}`;
    }, [translate]);
    const getTripTitle = (0, react_1.useCallback)((reservations) => {
        if (reservations.length === 0) {
            return '';
        }
        const firstReservation = reservations.at(0)?.reservation;
        const lastReservation = reservations.at(reservations.length - 1)?.reservation;
        if (!lastReservation || !firstReservation) {
            return '';
        }
        switch (firstReservation?.type) {
            case CONST_1.default.RESERVATION_TYPE.FLIGHT: {
                const destinationReservation = reservations.filter((reservation) => reservation.reservation.legId === firstReservation.legId).at(-1);
                if (!destinationReservation) {
                    return '';
                }
                return `${translate('travel.flightTo')} ${(0, TripReservationUtils_1.formatAirportInfo)(destinationReservation.reservation.end, true)}`;
            }
            case CONST_1.default.RESERVATION_TYPE.TRAIN:
                if (reservations.length === 2 && firstReservation.start.shortName === lastReservation.end.shortName) {
                    return `${translate('travel.trainTo')} ${expensify_common_1.Str.recapitalize(lastReservation.start.longName ?? '')}`;
                }
                return `${translate('travel.trainTo')} ${expensify_common_1.Str.recapitalize(lastReservation.end.longName ?? '')}`;
            case CONST_1.default.RESERVATION_TYPE.HOTEL: {
                const nights = (0, date_fns_1.differenceInCalendarDays)(new Date(lastReservation?.end.date), new Date(firstReservation.start.date));
                return `${nights} ${nights > 1 ? translate('travel.nightsIn') : translate('travel.nightIn')} ${expensify_common_1.Str.recapitalize(firstReservation.start.longName ?? '')}`;
            }
            case CONST_1.default.RESERVATION_TYPE.CAR: {
                const days = (0, date_fns_1.differenceInCalendarDays)(new Date(lastReservation.end.date), new Date(firstReservation.start.date));
                if (days > 0) {
                    return `${days} ${days > 1 ? translate('common.days') : translate('common.day')}${translate('travel.carRental')}`;
                }
                return `${DateUtils_1.default.getFormattedDurationBetweenDates(translate, new Date(firstReservation.start.date), new Date(lastReservation.end.date))}${translate('travel.carRental')}`;
            }
            default:
                return '';
        }
    }, [translate]);
    if (!tripRoomReport) {
        return null;
    }
    const reservationsData = (0, TripReservationUtils_1.getPNRReservationDataFromTripReport)(tripRoomReport, tripTransactions);
    return (<react_native_1.View style={[styles.flex1, styles.ph5]}>
            <react_native_1.View style={[styles.flexRow, styles.pointerEventsNone, styles.containerWithSpaceBetween, styles.pt3, styles.pb5]}>
                <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                    <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                        {translate('travel.tripSummary')}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[styles.gap5]}>
                {reservationsData.map(({ reservations, pnrID, currency, totalFareAmount }) => (<Section_1.default key={pnrID} title={getTripTitle(reservations)} subtitle={getTripDescription(totalFareAmount, currency, reservations)} containerStyles={[styles.ph0, styles.mh0, styles.mb0, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]} titleStyles={[styles.textStrong, styles.textNormal, styles.ph5]} subtitleStyles={[styles.ph5, styles.pb1, styles.mt1]} subtitleTextStyles={[styles.textLabelSupporting, styles.textLineHeightNormal]} subtitleMuted>
                        {reservations.map(({ reservation, transactionID, sequenceIndex }) => {
                return (<OfflineWithFeedback_1.default key={`${pnrID}-${sequenceIndex}`}>
                                    <ReservationView reservation={reservation} transactionID={transactionID} tripRoomReportID={tripRoomReport.reportID} sequenceIndex={sequenceIndex} shouldShowArrowIcon={false} shouldCenterIcon/>
                                </OfflineWithFeedback_1.default>);
            })}
                    </Section_1.default>))}
            </react_native_1.View>
            <SpacerView_1.default shouldShow={shouldShowHorizontalRule} style={[shouldShowHorizontalRule && styles.reportHorizontalRule]}/>
        </react_native_1.View>);
}
TripDetailsView.displayName = 'TripDetailsView';
exports.default = TripDetailsView;
