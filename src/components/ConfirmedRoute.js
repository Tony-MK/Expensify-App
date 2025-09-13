"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const MapboxToken_1 = require("@userActions/MapboxToken");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DistanceMapView_1 = require("./DistanceMapView");
const Expensicons = require("./Icon/Expensicons");
const ImageSVG_1 = require("./ImageSVG");
const PendingMapView_1 = require("./MapView/PendingMapView");
function ConfirmedRoute({ transaction, isSmallerIcon, shouldHaveBorderRadius = true, requireRouteToDisplayMap = false, interactive }) {
    const { isOffline } = (0, useNetwork_1.default)();
    const { route0: route } = transaction?.routes ?? {};
    const waypoints = transaction?.comment?.waypoints ?? {};
    const coordinates = route?.geometry?.coordinates ?? [];
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [mapboxAccessToken] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MAPBOX_ACCESS_TOKEN, { canBeMissing: true });
    const getMarkerComponent = (0, react_1.useCallback)((icon) => (<ImageSVG_1.default src={icon} width={CONST_1.default.MAP_MARKER_SIZE} height={CONST_1.default.MAP_MARKER_SIZE} fill={theme.icon}/>), [theme]);
    const getWaypointMarkers = (0, react_1.useCallback)((waypointsData) => {
        const numberOfWaypoints = Object.keys(waypointsData).length;
        const lastWaypointIndex = numberOfWaypoints - 1;
        return Object.entries(waypointsData)
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
            .filter((waypoint) => !!waypoint);
    }, [getMarkerComponent]);
    const waypointMarkers = getWaypointMarkers(waypoints);
    (0, react_1.useEffect)(() => {
        (0, MapboxToken_1.init)();
        return MapboxToken_1.stop;
    }, []);
    const shouldDisplayMap = !requireRouteToDisplayMap || !!coordinates.length;
    return !isOffline && !!mapboxAccessToken?.token && shouldDisplayMap ? (<DistanceMapView_1.default interactive={interactive} accessToken={mapboxAccessToken?.token ?? ''} mapPadding={CONST_1.default.MAPBOX.PADDING} pitchEnabled={false} initialState={{
            zoom: CONST_1.default.MAPBOX.DEFAULT_ZOOM,
            location: waypointMarkers?.at(0)?.coordinate ?? CONST_1.default.MAPBOX.DEFAULT_COORDINATE,
        }} directionCoordinates={coordinates} style={[styles.mapView, shouldHaveBorderRadius && styles.br4]} waypoints={waypointMarkers} styleURL={CONST_1.default.MAPBOX.STYLE_URL} requireRouteToDisplayMap={requireRouteToDisplayMap}/>) : (<PendingMapView_1.default isSmallerIcon={isSmallerIcon} style={!shouldHaveBorderRadius && StyleUtils.getBorderRadiusStyle(0)}/>);
}
ConfirmedRoute.displayName = 'ConfirmedRoute';
exports.default = ConfirmedRoute;
