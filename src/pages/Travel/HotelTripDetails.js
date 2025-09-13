"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const StringUtils_1 = require("@libs/StringUtils");
const CONST_1 = require("@src/CONST");
function HotelTripDetails({ reservation, personalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const cancellationMapping = {
        [CONST_1.default.CANCELLATION_POLICY.UNKNOWN]: translate('travel.hotelDetails.cancellationPolicies.unknown'),
        [CONST_1.default.CANCELLATION_POLICY.NON_REFUNDABLE]: translate('travel.hotelDetails.cancellationPolicies.nonRefundable'),
        [CONST_1.default.CANCELLATION_POLICY.FREE_CANCELLATION_UNTIL]: translate('travel.hotelDetails.cancellationPolicies.freeCancellationUntil'),
        [CONST_1.default.CANCELLATION_POLICY.PARTIALLY_REFUNDABLE]: translate('travel.hotelDetails.cancellationPolicies.partiallyRefundable'),
    };
    const checkInDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.start.date));
    const checkOutDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.end.date));
    const cancellationText = reservation.cancellationDeadline
        ? `${translate('travel.hotelDetails.cancellationUntil')} ${DateUtils_1.default.getFormattedCancellationDate(new Date(reservation.cancellationDeadline))}`
        : cancellationMapping[reservation.cancellationPolicy ?? CONST_1.default.CANCELLATION_POLICY.UNKNOWN];
    const displayName = personalDetails?.displayName ?? reservation.travelerPersonalInfo?.name;
    return (<>
            <Text_1.default style={[styles.textHeadlineH1, styles.mh5, styles.mv3]}>{expensify_common_1.Str.recapitalize(reservation.start.longName ?? '')}</Text_1.default>
            <MenuItemWithTopDescription_1.default description={translate('common.address')} title={StringUtils_1.default.removeDoubleQuotes(reservation.start.address)} numberOfLinesTitle={2} pressableTestID={CONST_1.default.RESERVATION_ADDRESS_TEST_ID} copyValue={reservation.start.address}/>
            <MenuItemWithTopDescription_1.default description={translate('travel.hotelDetails.checkIn')} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>{checkInDate.date}</Text_1.default>} interactive={false}/>
            <MenuItemWithTopDescription_1.default description={translate('travel.hotelDetails.checkOut')} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>{checkOutDate.date}</Text_1.default>} interactive={false}/>

            {!!reservation.roomClass && (<MenuItemWithTopDescription_1.default description={translate('travel.hotelDetails.roomType')} title={reservation.roomClass.trim()} interactive={false}/>)}
            {!!cancellationText && (<MenuItemWithTopDescription_1.default description={translate('travel.hotelDetails.cancellation')} title={cancellationText} interactive={false} numberOfLinesTitle={2}/>)}
            {!!reservation.confirmations?.at(0)?.value && (<MenuItemWithTopDescription_1.default description={translate('travel.hotelDetails.confirmation')} title={reservation.confirmations?.at(0)?.value} copyValue={reservation.confirmations?.at(0)?.value}/>)}
            {!!displayName && (<MenuItem_1.default label={translate('travel.hotelDetails.guest')} title={displayName} icon={personalDetails?.avatar ?? Expensicons.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} description={personalDetails?.login ?? reservation.travelerPersonalInfo?.email} interactive={false} wrapperStyle={styles.pb3}/>)}
        </>);
}
HotelTripDetails.displayName = 'HotelTripDetails';
exports.default = HotelTripDetails;
