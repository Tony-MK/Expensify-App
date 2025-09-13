"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const CONST_1 = require("@src/CONST");
function TrainTripDetails({ reservation, personalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const startDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.start.date));
    const endDate = DateUtils_1.default.getFormattedTransportDateAndHour(new Date(reservation.end.date));
    const trainRouteDescription = `${reservation.start.longName} (${reservation.start.shortName}) ${translate('common.conjunctionTo')} ${reservation.end.longName} (${reservation.end.shortName})`;
    const trainDuration = DateUtils_1.default.getFormattedDurationBetweenDates(translate, new Date(reservation.start.date), new Date(reservation.end.date));
    const displayName = personalDetails?.displayName ?? reservation.travelerPersonalInfo?.name;
    return (<>
            <Text_1.default style={[styles.textHeadlineH1, styles.mh5, styles.mv3]}>{trainRouteDescription}</Text_1.default>

            <MenuItemWithTopDescription_1.default description={`${translate('travel.train')} ${trainDuration ? `${CONST_1.default.DOT_SEPARATOR} ${trainDuration}` : ''}`} title={reservation.route?.name} copyValue={reservation.route?.name}/>
            <MenuItemWithTopDescription_1.default description={translate('common.date')} title={startDate.date} interactive={false}/>

            <MenuItemWithTopDescription_1.default description={translate('travel.trainDetails.departs')} descriptionTextStyle={[styles.textLabelSupporting, styles.mb1]} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>{startDate.hour}</Text_1.default>} helperText={`${reservation.start.longName} (${reservation.start.shortName})`} helperTextStyle={[styles.pb3, styles.mtn2]} interactive={false}/>
            <MenuItemWithTopDescription_1.default description={translate('travel.trainDetails.arrives')} descriptionTextStyle={[styles.textLabelSupporting, styles.mb1]} titleComponent={<Text_1.default style={[styles.textLarge, styles.textHeadlineH2]}>{endDate.hour}</Text_1.default>} helperText={`${reservation.end.longName} (${reservation.end.shortName})`} helperTextStyle={[styles.pb3, styles.mtn2]} interactive={false}/>

            <react_native_1.View style={[styles.flexRow, styles.flexWrap]}>
                {!!reservation.coachNumber && (<react_native_1.View style={styles.w50}>
                        <MenuItemWithTopDescription_1.default description={translate('travel.trainDetails.coachNumber')} title={reservation.coachNumber} interactive={false}/>
                    </react_native_1.View>)}
                {!!reservation.seatNumber && (<react_native_1.View style={styles.w50}>
                        <MenuItemWithTopDescription_1.default description={translate('travel.trainDetails.seat')} title={reservation.seatNumber} interactive={false}/>
                    </react_native_1.View>)}
            </react_native_1.View>
            {!!reservation.confirmations?.at(0)?.value && (<MenuItemWithTopDescription_1.default description={translate('travel.trainDetails.confirmation')} title={reservation.confirmations?.at(0)?.value} copyValue={reservation.confirmations?.at(0)?.value}/>)}

            {!!displayName && (<MenuItem_1.default label={translate('travel.trainDetails.passenger')} title={displayName} icon={personalDetails?.avatar ?? Expensicons.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} description={personalDetails?.login ?? reservation.travelerPersonalInfo?.email} interactive={false} wrapperStyle={styles.pb3}/>)}
        </>);
}
TrainTripDetails.displayName = 'TrainTripDetails';
exports.default = TrainTripDetails;
