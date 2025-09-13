"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DistanceMapView_1 = require("@components/DistanceMapView");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MAX_WAYPOINTS = 25;
function DistanceRequestFooter({ waypoints, transaction, navigateToWaypointEditPage, policy }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID);
    const activePolicy = (0, usePolicy_1.default)(activePolicyID);
    const [mapboxAccessToken] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MAPBOX_ACCESS_TOKEN);
    const numberOfWaypoints = Object.keys(waypoints ?? {}).length;
    const numberOfFilledWaypoints = Object.values(waypoints ?? {}).filter((waypoint) => waypoint?.address).length;
    const lastWaypointIndex = numberOfWaypoints - 1;
    const defaultMileageRate = DistanceRequestUtils_1.default.getDefaultMileageRate(policy ?? activePolicy);
    const policyCurrency = (policy ?? activePolicy)?.outputCurrency ?? (0, PolicyUtils_1.getPersonalPolicy)()?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const mileageRate = (0, TransactionUtils_1.isCustomUnitRateIDForP2P)(transaction) ? DistanceRequestUtils_1.default.getRateForP2P(policyCurrency, transaction) : defaultMileageRate;
    const { unit } = mileageRate ?? {};
    const getMarkerComponent = (0, react_1.useCallback)((icon) => (<ImageSVG_1.default src={icon} width={CONST_1.default.MAP_MARKER_SIZE} height={CONST_1.default.MAP_MARKER_SIZE} fill={theme.icon}/>), [theme]);
    const waypointMarkers = (0, react_1.useMemo)(() => Object.entries(waypoints ?? {})
        .map(([key, waypoint]) => {
        if (!waypoint?.lat || !waypoint?.lng) {
            return;
        }
        const index = (0, TransactionUtils_1.getWaypointIndex)(key);
        let MarkerComponent;
        if (index === 0) {
            MarkerComponent = Expensicons.DotIndicatorUnfilled;
        }
        else if (index === lastWaypointIndex) {
            MarkerComponent = Expensicons.Location;
        }
        else {
            MarkerComponent = Expensicons.DotIndicator;
        }
        return {
            id: `${waypoint.lng},${waypoint.lat},${index}`,
            coordinate: [waypoint.lng, waypoint.lat],
            markerComponent: () => getMarkerComponent(MarkerComponent),
        };
    })
        .filter((waypoint) => !!waypoint), [waypoints, lastWaypointIndex, getMarkerComponent]);
    return (<>
            {numberOfFilledWaypoints >= 2 && (<react_native_1.View style={[styles.flexRow, styles.justifyContentCenter, styles.pt1]}>
                    <Button_1.default small icon={Expensicons.Plus} onPress={() => navigateToWaypointEditPage(Object.keys(transaction?.comment?.waypoints ?? {}).length)} text={translate('distance.addStop')} isDisabled={numberOfWaypoints === MAX_WAYPOINTS} innerStyles={[styles.pl10, styles.pr10]}/>
                </react_native_1.View>)}
            <react_native_1.View style={styles.mapViewContainer}>
                <DistanceMapView_1.default accessToken={mapboxAccessToken?.token ?? ''} mapPadding={CONST_1.default.MAPBOX.PADDING} pitchEnabled={false} initialState={{
            zoom: CONST_1.default.MAPBOX.DEFAULT_ZOOM,
            location: waypointMarkers?.at(0)?.coordinate ?? CONST_1.default.MAPBOX.DEFAULT_COORDINATE,
        }} directionCoordinates={transaction?.routes?.route0?.geometry?.coordinates ?? []} style={[styles.mapView, styles.mapEditView]} waypoints={waypointMarkers} styleURL={CONST_1.default.MAPBOX.STYLE_URL} overlayStyle={styles.mapEditView} distanceInMeters={(0, TransactionUtils_1.getDistanceInMeters)(transaction, undefined)} unit={unit}/>
            </react_native_1.View>
        </>);
}
DistanceRequestFooter.displayName = 'DistanceRequestFooter';
exports.default = DistanceRequestFooter;
