"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTripTransactions_1 = require("@hooks/useTripTransactions");
const ControlSelection_1 = require("@libs/ControlSelection");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TripReservationUtils_1 = require("@libs/TripReservationUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function ReservationView({ reservation, onPress }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const reservationIcon = (0, TripReservationUtils_1.getTripReservationIcon)(reservation.type);
    const title = reservation.type === CONST_1.default.RESERVATION_TYPE.CAR ? reservation.carInfo?.name : expensify_common_1.Str.recapitalize(reservation.start.longName ?? '');
    let titleComponent = (<Text_1.default numberOfLines={1} ellipsizeMode="tail">
            {title}
        </Text_1.default>);
    if (reservation.type === CONST_1.default.RESERVATION_TYPE.FLIGHT || reservation.type === CONST_1.default.RESERVATION_TYPE.TRAIN) {
        const startName = reservation.type === CONST_1.default.RESERVATION_TYPE.FLIGHT ? reservation.start.shortName : reservation.start.longName;
        const endName = reservation.type === CONST_1.default.RESERVATION_TYPE.FLIGHT ? reservation.end.shortName : reservation.end.longName;
        titleComponent = (<Text_1.default numberOfLines={2} ellipsizeMode="tail">
                {startName} {translate('common.to').toLowerCase()} {endName}
            </Text_1.default>);
    }
    return (<MenuItemWithTopDescription_1.default description={translate(`travel.${reservation.type}`)} descriptionTextStyle={[styles.textLabelSupporting, styles.lh16]} titleComponent={titleComponent} titleContainerStyle={styles.gap1} secondaryIcon={reservationIcon} secondaryIconFill={theme.icon} wrapperStyle={[styles.taskDescriptionMenuItem, styles.p0]} shouldGreyOutWhenDisabled={false} numberOfLinesTitle={0} shouldRemoveBackground onPress={onPress} iconHeight={variables_1.default.iconSizeNormal} iconWidth={variables_1.default.iconSizeNormal} iconStyles={[StyleUtils.getTripReservationIconContainer(false), styles.mr3, styles.alignSelfCenter]} isSmallAvatarSubscriptMenu/>);
}
function TripRoomPreview({ action, chatReport, iouReport, containerStyles, contextMenuAnchor, isHovered = false, checkIfContextMenuActive = () => { }, shouldDisplayContextMenu = true, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const chatReportID = chatReport?.reportID;
    const tripTransactions = (0, useTripTransactions_1.default)(chatReportID);
    const reservationsData = (0, TripReservationUtils_1.getReservationsFromTripReport)(chatReport, tripTransactions);
    const dateInfo = chatReport?.tripData?.startDate && chatReport?.tripData?.endDate
        ? DateUtils_1.default.getFormattedDateRange(new Date(chatReport.tripData.startDate), new Date(chatReport.tripData.endDate))
        : '';
    const reportCurrency = iouReport?.currency ?? chatReport?.currency;
    const { totalDisplaySpend = 0, currency = reportCurrency } = chatReport ? (0, TripReservationUtils_1.getTripTotal)(chatReport) : {};
    const displayAmount = (0, react_1.useMemo)(() => {
        if (totalDisplaySpend) {
            return (0, CurrencyUtils_1.convertToDisplayString)(totalDisplaySpend, currency);
        }
        return (0, CurrencyUtils_1.convertToDisplayString)(tripTransactions?.reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0), currency);
    }, [currency, totalDisplaySpend, tripTransactions]);
    const navigateToTrip = () => Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(chatReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    const renderItem = ({ item }) => (<ReservationView reservation={item.reservation} onPress={navigateToTrip}/>);
    return (<OfflineWithFeedback_1.default pendingAction={action?.pendingAction} shouldDisableOpacity={!!(action.pendingAction ?? action.isOptimisticAction)} needsOffscreenAlphaCompositing>
            <react_native_1.View style={[styles.chatItemMessage, containerStyles]}>
                <Pressable_1.PressableWithoutFeedback onPress={navigateToTrip} onPressIn={() => (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onLongPress={(event) => {
            if (!shouldDisplayContextMenu) {
                return;
            }
            (0, ShowContextMenuContext_1.showContextMenuForReport)(event, contextMenuAnchor, chatReportID, action, checkIfContextMenuActive);
        }} shouldUseHapticsOnLongPress style={[styles.flexRow, styles.justifyContentBetween, styles.reportPreviewBox]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('iou.viewDetails')}>
                    <react_native_1.View style={[styles.moneyRequestPreviewBox, styles.p4, styles.gap4, isHovered ? styles.reportPreviewBoxHoverBorder : undefined]}>
                        <react_native_1.View>
                            <Text_1.default style={[styles.headerText, styles.mb1]}>{chatReport?.reportName}</Text_1.default>
                            <Text_1.default style={[styles.textLabelSupporting, styles.lh16]}>
                                {dateInfo} • {reservationsData.length} {(reservationsData.length < 2 ? translate('travel.trip') : translate('travel.trips')).toLowerCase()}
                            </Text_1.default>
                        </react_native_1.View>
                        {reservationsData.length > 0 && (<react_native_1.FlatList data={reservationsData} style={[styles.gap4, styles.border, styles.borderRadiusComponentLarge, styles.p4]} renderItem={renderItem}/>)}
                        <react_native_1.View style={[styles.flex1, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                            <Text_1.default style={[styles.textLabelSupporting, styles.lh16]}>{translate('common.total')}</Text_1.default>
                            <Text_1.default style={[styles.headerText, styles.lineHeightXLarge]}>{displayAmount}</Text_1.default>
                        </react_native_1.View>

                        <Button_1.default text={translate('common.view')} onPress={navigateToTrip}/>
                    </react_native_1.View>
                </Pressable_1.PressableWithoutFeedback>
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
}
TripRoomPreview.displayName = 'TripRoomPreview';
exports.default = TripRoomPreview;
