"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
function CarTripDetails({ reservation, personalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const pickUpDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.start.date));
    const dropOffDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.end.date));
    let cancellationText = reservation.cancellationPolicy;
    if (reservation.cancellationDeadline) {
        cancellationText = `${translate('travel.carDetails.cancellationUntil')} ${DateUtils_1.default.getFormattedCancellationDate(new Date(reservation.cancellationDeadline))}`;
    }
    if (reservation.cancellationPolicy === null && reservation.cancellationDeadline === null) {
        cancellationText = translate('travel.carDetails.freeCancellation');
    }
    const displayName = personalDetails?.displayName ?? reservation.travelerPersonalInfo?.name;
    return (<>
            <Text_1.default style={[styles.textHeadlineH1, styles.mh5, styles.mv3]}>{reservation.vendor}</Text_1.default>
            <MenuItemWithTopDescription_1.default description={translate('travel.carDetails.pickUp')} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>
                        {pickUpDate.date} {CONST_1.default.DOT_SEPARATOR} {pickUpDate.hour}
                    </Text_1.default>} interactive={false} helperText={reservation.start.location} helperTextStyle={[styles.pb3, styles.mtn2]}/>
            <MenuItemWithTopDescription_1.default description={translate('travel.carDetails.dropOff')} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>
                        {dropOffDate.date} {CONST_1.default.DOT_SEPARATOR} {dropOffDate.hour}
                    </Text_1.default>} interactive={false} helperText={reservation.end.location} helperTextStyle={[styles.pb3, styles.mtn2]}/>
            {!!reservation.carInfo?.name && (<MenuItemWithTopDescription_1.default description={translate('travel.carDetails.carType')} title={reservation.carInfo.name} interactive={false}/>)}
            {!!cancellationText && (<MenuItemWithTopDescription_1.default description={translate('travel.carDetails.cancellation')} title={cancellationText} interactive={false} numberOfLinesTitle={2}/>)}
            {!!reservation.reservationID && (<MenuItemWithTopDescription_1.default description={translate('travel.carDetails.confirmation')} title={reservation.confirmations?.at(0)?.value ?? reservation.reservationID} copyValue={reservation.confirmations?.at(0)?.value ?? reservation.reservationID}/>)}
            {!!displayName && (<MenuItem_1.default label={translate('travel.carDetails.driver')} title={displayName} icon={personalDetails?.avatar ?? Expensicons.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} description={personalDetails?.login ?? reservation.travelerPersonalInfo?.email} interactive={false} wrapperStyle={styles.pb3}/>)}
        </>);
}
CarTripDetails.displayName = 'CarTripDetails';
exports.default = CarTripDetails;
