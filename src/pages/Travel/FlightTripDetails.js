"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function FlightTripDetails({ reservation, prevReservation, personalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const cabinClassMapping = {
        UNKNOWN_CABIN: translate('travel.flightDetails.cabinClasses.unknown'),
        ECONOMY: translate('travel.flightDetails.cabinClasses.economy'),
        PREMIUM_ECONOMY: translate('travel.flightDetails.cabinClasses.premiumEconomy'),
        BUSINESS: translate('travel.flightDetails.cabinClasses.business'),
        FIRST: translate('travel.flightDetails.cabinClasses.first'),
    };
    const startDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.start.date));
    const endDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.end.date));
    const prevFlightEndDate = prevReservation?.end.date;
    const layover = prevFlightEndDate && DateUtils_1.default.getFormattedDurationBetweenDates(translate, new Date(prevFlightEndDate), new Date(reservation.start.date));
    const flightDuration = reservation.duration ? DateUtils_1.default.getFormattedDuration(translate, reservation.duration) : '';
    const flightRouteDescription = `${reservation.start.cityName} (${reservation.start.shortName}) ${translate('common.conjunctionTo')} ${reservation.end.cityName} (${reservation.end.shortName})`;
    const displayName = personalDetails?.displayName ?? reservation.travelerPersonalInfo?.name;
    return (<>
            <Text_1.default style={[styles.textHeadlineH1, styles.mh5, styles.mv3]}>{flightRouteDescription}</Text_1.default>

            {!!layover && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mh5, styles.mv3, styles.gap2]}>
                    <Icon_1.default src={Expensicons.Hourglass} height={variables_1.default.iconSizeNormal} width={variables_1.default.iconSizeNormal} fill={theme.icon}/>
                    <RenderHTML_1.default html={translate('travel.flightDetails.layover', { layover })}/>
                </react_native_1.View>)}
            <MenuItemWithTopDescription_1.default description={`${translate('travel.flight')} ${CONST_1.default.DOT_SEPARATOR} ${flightDuration}`} title={`${reservation.company?.longName} ${CONST_1.default.DOT_SEPARATOR} ${reservation.route?.airlineCode}`} copyValue={`${reservation.company?.longName} ${CONST_1.default.DOT_SEPARATOR} ${reservation.route?.airlineCode}`}/>
            <MenuItemWithTopDescription_1.default description={translate('common.date')} title={startDate.date} interactive={false}/>

            <MenuItemWithTopDescription_1.default description={translate('travel.flightDetails.takeOff')} descriptionTextStyle={[styles.textLabelSupporting, styles.mb1]} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>{startDate.hour}</Text_1.default>} helperText={`${reservation.start.longName} (${reservation.start.shortName})${reservation.arrivalGate?.terminal ? `, ${reservation.arrivalGate?.terminal}` : ''}`} helperTextStyle={[styles.pb3, styles.mtn2]} interactive={false}/>
            <MenuItemWithTopDescription_1.default description={translate('travel.flightDetails.landing')} descriptionTextStyle={[styles.textLabelSupporting, styles.mb1]} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>{endDate.hour}</Text_1.default>} helperText={`${reservation.end.longName} (${reservation.end.shortName})`} helperTextStyle={[styles.pb3, styles.mtn2]} interactive={false}/>

            <react_native_1.View style={[styles.flexRow, styles.flexWrap]}>
                {!!reservation.route?.number && (<react_native_1.View style={styles.w50}>
                        <MenuItemWithTopDescription_1.default description={translate('travel.flightDetails.seat')} title={reservation.route?.number} interactive={false}/>
                    </react_native_1.View>)}
                {!!reservation.route?.class && (<react_native_1.View style={styles.w50}>
                        <MenuItemWithTopDescription_1.default description={translate('travel.flightDetails.class')} title={cabinClassMapping[reservation.route.class] || reservation.route.class} interactive={false}/>
                    </react_native_1.View>)}
                {!!reservation.confirmations?.at(0)?.value && (<react_native_1.View style={styles.w50}>
                        <MenuItemWithTopDescription_1.default description={translate('travel.flightDetails.recordLocator')} title={reservation.confirmations?.at(0)?.value} copyValue={reservation.confirmations?.at(0)?.value}/>
                    </react_native_1.View>)}
            </react_native_1.View>
            {!!displayName && (<MenuItem_1.default label={translate('travel.flightDetails.passenger')} title={displayName} icon={personalDetails?.avatar ?? Expensicons.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} description={personalDetails?.login ?? reservation.travelerPersonalInfo?.email} interactive={false} wrapperStyle={styles.pb3}/>)}
        </>);
}
FlightTripDetails.displayName = 'FlightTripDetails';
exports.default = FlightTripDetails;
