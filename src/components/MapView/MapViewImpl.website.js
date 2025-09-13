"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Explanation: Different Mapbox libraries are required for web and native mobile platforms.
// This is why we have separate components for web and native to handle the specific implementations.
// For the web version, we use the Mapbox Web library called react-map-gl, while for the native mobile version,
// we utilize a different Mapbox library @rnmapbox/maps tailored for mobile development.
const native_1 = require("@react-navigation/native");
const mapbox_gl_1 = require("mapbox-gl");
require("mapbox-gl/dist/mapbox-gl.css");
const react_1 = require("react");
const react_map_gl_1 = require("react-map-gl");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const Pressable_1 = require("@components/Pressable");
const Text_1 = require("@components/Text");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const getCurrentPosition_types_1 = require("@libs/getCurrentPosition/getCurrentPosition.types");
const UserLocation_1 = require("@userActions/UserLocation");
const CONST_1 = require("@src/CONST");
const useLocalize_1 = require("@src/hooks/useLocalize");
const useNetwork_1 = require("@src/hooks/useNetwork");
const getCurrentPosition_1 = require("@src/libs/getCurrentPosition");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Direction_1 = require("./Direction");
require("./mapbox.css");
const PendingMapView_1 = require("./PendingMapView");
const responder_1 = require("./responder");
const utils_1 = require("./utils");
function MapViewImpl({ style, styleURL, waypoints, mapPadding, accessToken, directionCoordinates, initialState = { location: CONST_1.default.MAPBOX.DEFAULT_COORDINATE, zoom: CONST_1.default.MAPBOX.DEFAULT_ZOOM }, interactive = true, distanceInMeters, unit, ref, }) {
    const [userLocation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_LOCATION, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [distanceUnit, setDistanceUnit] = (0, react_1.useState)(unit);
    (0, react_1.useEffect)(() => {
        if (!unit || distanceUnit) {
            return;
        }
        setDistanceUnit(unit);
    }, [unit, distanceUnit]);
    const toggleDistanceUnit = (0, react_1.useCallback)(() => {
        setDistanceUnit((currentUnit) => currentUnit === CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS ? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES : CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS);
    }, []);
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [mapRef, setMapRef] = (0, react_1.useState)(null);
    const initialLocation = (0, react_1.useMemo)(() => ({ longitude: initialState.location[0], latitude: initialState.location[1] }), [initialState]);
    const currentPosition = userLocation ?? initialLocation;
    const prevUserPosition = (0, usePrevious_1.default)(currentPosition);
    const [userInteractedWithMap, setUserInteractedWithMap] = (0, react_1.useState)(false);
    const [shouldResetBoundaries, setShouldResetBoundaries] = (0, react_1.useState)(false);
    const setRef = (0, react_1.useCallback)((newRef) => setMapRef(newRef), []);
    const shouldInitializeCurrentPosition = (0, react_1.useRef)(true);
    // Determines if map can be panned to user's detected
    // location without bothering the user. It will return
    // false if user has already started dragging the map or
    // if there are one or more waypoints present.
    const shouldPanMapToCurrentPosition = (0, react_1.useCallback)(() => !userInteractedWithMap && (!waypoints || waypoints.length === 0), [userInteractedWithMap, waypoints]);
    const setCurrentPositionToInitialState = (0, react_1.useCallback)((error) => {
        if (error?.code !== getCurrentPosition_types_1.GeolocationErrorCode.PERMISSION_DENIED || !initialLocation) {
            return;
        }
        (0, UserLocation_1.clearUserLocation)();
    }, [initialLocation]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (isOffline) {
            return;
        }
        if (!shouldInitializeCurrentPosition.current) {
            return;
        }
        shouldInitializeCurrentPosition.current = false;
        if (!shouldPanMapToCurrentPosition()) {
            setCurrentPositionToInitialState();
            return;
        }
        (0, getCurrentPosition_1.default)((params) => {
            const currentCoords = { longitude: params.coords.longitude, latitude: params.coords.latitude };
            (0, UserLocation_1.setUserLocation)(currentCoords);
        }, setCurrentPositionToInitialState);
    }, [isOffline, shouldPanMapToCurrentPosition, setCurrentPositionToInitialState]));
    (0, react_1.useEffect)(() => {
        if (!currentPosition || !mapRef) {
            return;
        }
        if (!shouldPanMapToCurrentPosition()) {
            return;
        }
        // Avoid animating the navigation to the same location
        const shouldAnimate = prevUserPosition.longitude !== currentPosition.longitude || prevUserPosition.latitude !== currentPosition.latitude;
        mapRef.flyTo({
            center: [currentPosition.longitude, currentPosition.latitude],
            zoom: CONST_1.default.MAPBOX.DEFAULT_ZOOM,
            animate: shouldAnimate,
        });
    }, [currentPosition, mapRef, prevUserPosition, shouldPanMapToCurrentPosition]);
    const resetBoundaries = (0, react_1.useCallback)(() => {
        if (!waypoints || waypoints.length === 0) {
            return;
        }
        if (!mapRef) {
            return;
        }
        if (waypoints.length === 1) {
            mapRef.flyTo({
                center: waypoints.at(0)?.coordinate,
                zoom: CONST_1.default.MAPBOX.SINGLE_MARKER_ZOOM,
            });
            return;
        }
        const map = mapRef.getMap();
        const { northEast, southWest } = utils_1.default.getBounds(waypoints.map((waypoint) => waypoint.coordinate), directionCoordinates);
        map.fitBounds([northEast, southWest], { padding: mapPadding });
    }, [waypoints, mapRef, mapPadding, directionCoordinates]);
    (0, react_1.useEffect)(resetBoundaries, [resetBoundaries]);
    (0, react_1.useEffect)(() => {
        if (!shouldResetBoundaries) {
            return;
        }
        resetBoundaries();
        setShouldResetBoundaries(false);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- this effect only needs to run when the boundaries reset is forced
    }, [shouldResetBoundaries]);
    (0, react_1.useEffect)(() => {
        if (!mapRef) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            mapRef.resize();
            setShouldResetBoundaries(true);
        });
        resizeObserver.observe(mapRef.getContainer());
        return () => {
            resizeObserver?.disconnect();
        };
    }, [mapRef]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        flyTo: (location, zoomLevel = CONST_1.default.MAPBOX.DEFAULT_ZOOM, animationDuration) => mapRef?.flyTo({
            center: location,
            zoom: zoomLevel,
            duration: animationDuration,
        }),
        fitBounds: (northEast, southWest) => mapRef?.fitBounds([northEast, southWest]),
    }), [mapRef]);
    const centerMap = (0, react_1.useCallback)(() => {
        if (!mapRef) {
            return;
        }
        const waypointCoordinates = waypoints?.map((waypoint) => waypoint.coordinate) ?? [];
        if (waypointCoordinates.length > 1 || (directionCoordinates ?? []).length > 1) {
            const { northEast, southWest } = utils_1.default.getBounds(waypoints?.map((waypoint) => waypoint.coordinate) ?? [], directionCoordinates);
            const map = mapRef?.getMap();
            map?.fitBounds([southWest, northEast], { padding: mapPadding, animate: true, duration: CONST_1.default.MAPBOX.ANIMATION_DURATION_ON_CENTER_ME });
            return;
        }
        mapRef.flyTo({
            center: [currentPosition?.longitude ?? 0, currentPosition?.latitude ?? 0],
            zoom: CONST_1.default.MAPBOX.SINGLE_MARKER_ZOOM,
            bearing: 0,
            animate: true,
            duration: CONST_1.default.MAPBOX.ANIMATION_DURATION_ON_CENTER_ME,
        });
    }, [directionCoordinates, currentPosition, mapRef, waypoints, mapPadding]);
    const initialViewState = (0, react_1.useMemo)(() => {
        if (!interactive) {
            if (!waypoints) {
                return undefined;
            }
            const { northEast, southWest } = utils_1.default.getBounds(waypoints.map((waypoint) => waypoint.coordinate), directionCoordinates);
            return {
                zoom: initialState.zoom,
                bounds: [northEast, southWest],
            };
        }
        return {
            longitude: currentPosition?.longitude,
            latitude: currentPosition?.latitude,
            zoom: initialState.zoom,
        };
    }, [waypoints, directionCoordinates, interactive, currentPosition, initialState.zoom]);
    const distanceSymbolCoordinate = (0, react_1.useMemo)(() => {
        if (!directionCoordinates?.length || !waypoints?.length) {
            return;
        }
        const { northEast, southWest } = utils_1.default.getBounds(waypoints.map((waypoint) => waypoint.coordinate), directionCoordinates);
        const boundsCenter = utils_1.default.getBoundsCenter({ northEast, southWest });
        return utils_1.default.findClosestCoordinateOnLineFromCenter(boundsCenter, directionCoordinates);
    }, [waypoints, directionCoordinates]);
    return !isOffline && !!accessToken && !!initialViewState ? (<react_native_1.View style={style} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...responder_1.default.panHandlers}>
            <react_map_gl_1.default onDrag={() => setUserInteractedWithMap(true)} ref={setRef} mapLib={mapbox_gl_1.default} mapboxAccessToken={accessToken} initialViewState={initialViewState} style={{ ...StyleUtils.getTextColorStyle(theme.mapAttributionText), zIndex: -1 }} mapStyle={styleURL} interactive={interactive}>
                {interactive && (<react_map_gl_1.Marker key="Current-position" longitude={currentPosition?.longitude ?? 0} latitude={currentPosition?.latitude ?? 0}>
                        <react_native_1.View style={styles.currentPositionDot}/>
                    </react_map_gl_1.Marker>)}
                {!!distanceSymbolCoordinate && !!distanceInMeters && !!distanceUnit && (<react_map_gl_1.Marker key="distance-label" longitude={distanceSymbolCoordinate.at(0) ?? 0} latitude={distanceSymbolCoordinate.at(1) ?? 0}>
                        <Pressable_1.PressableWithoutFeedback accessibilityLabel={CONST_1.default.ROLE.BUTTON} role={CONST_1.default.ROLE.BUTTON} onPress={toggleDistanceUnit}>
                            <react_native_1.View style={styles.distanceLabelWrapper}>
                                <Text_1.default style={styles.distanceLabelText}> {DistanceRequestUtils_1.default.getDistanceForDisplayLabel(distanceInMeters, distanceUnit)}</Text_1.default>
                            </react_native_1.View>
                        </Pressable_1.PressableWithoutFeedback>
                    </react_map_gl_1.Marker>)}
                {waypoints?.map(({ coordinate, markerComponent, id }) => {
            const MarkerComponent = markerComponent;
            if (utils_1.default.areSameCoordinate([coordinate[0], coordinate[1]], [currentPosition?.longitude ?? 0, currentPosition?.latitude ?? 0]) && interactive) {
                return null;
            }
            return (<react_map_gl_1.Marker key={id} longitude={coordinate[0]} latitude={coordinate[1]}>
                            <MarkerComponent />
                        </react_map_gl_1.Marker>);
        })}
                {!!directionCoordinates && <Direction_1.default coordinates={directionCoordinates}/>}
            </react_map_gl_1.default>
            {interactive && (<react_native_1.View style={[styles.pAbsolute, styles.p5, styles.t0, styles.r0, { zIndex: 1 }]}>
                    <Button_1.default onPress={centerMap} iconFill={theme.icon} icon={Expensicons.Crosshair} accessibilityLabel={translate('common.center')}/>
                </react_native_1.View>)}
        </react_native_1.View>) : (<PendingMapView_1.default title={translate('distance.mapPending.title')} subtitle={isOffline ? translate('distance.mapPending.subtitle') : translate('distance.mapPending.onlineSubtitle')} style={styles.mapEditView}/>);
}
exports.default = MapViewImpl;
