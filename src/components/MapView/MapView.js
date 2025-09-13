"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const maps_1 = require("@rnmapbox/maps");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const UserLocation_1 = require("@libs/actions/UserLocation");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const getCurrentPosition_1 = require("@libs/getCurrentPosition");
const getCurrentPosition_types_1 = require("@libs/getCurrentPosition/getCurrentPosition.types");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
const useLocalize_1 = require("@src/hooks/useLocalize");
const useNetwork_1 = require("@src/hooks/useNetwork");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Direction_1 = require("./Direction");
const PendingMapView_1 = require("./PendingMapView");
const responder_1 = require("./responder");
const ToggleDistanceUnitButton_1 = require("./ToggleDistanceUnitButton");
const utils_1 = require("./utils");
function MapView({ accessToken, style, mapPadding, styleURL, pitchEnabled, initialState, waypoints, directionCoordinates, onMapReady, interactive = true, distanceInMeters, unit, ref, }) {
    const [userLocation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_LOCATION, { canBeMissing: true });
    const navigation = (0, native_1.useNavigation)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const cameraRef = (0, react_1.useRef)(null);
    const [isIdle, setIsIdle] = (0, react_1.useState)(false);
    const initialLocation = (0, react_1.useMemo)(() => initialState && { longitude: initialState.location[0], latitude: initialState.location[1] }, [initialState]);
    const currentPosition = userLocation ?? initialLocation;
    const [userInteractedWithMap, setUserInteractedWithMap] = (0, react_1.useState)(false);
    const shouldInitializeCurrentPosition = (0, react_1.useRef)(true);
    const [isAccessTokenSet, setIsAccessTokenSet] = (0, react_1.useState)(false);
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
    const distanceLabelText = (0, react_1.useMemo)(() => DistanceRequestUtils_1.default.getDistanceForDisplayLabel(distanceInMeters ?? 0, distanceUnit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS), [distanceInMeters, distanceUnit]);
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
        if (!currentPosition || !cameraRef.current) {
            return;
        }
        if (!shouldPanMapToCurrentPosition()) {
            return;
        }
        cameraRef.current.setCamera({
            zoomLevel: CONST_1.default.MAPBOX.DEFAULT_ZOOM,
            animationDuration: 1500,
            centerCoordinate: [currentPosition.longitude, currentPosition.latitude],
        });
    }, [currentPosition, shouldPanMapToCurrentPosition]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        flyTo: (location, zoomLevel = CONST_1.default.MAPBOX.DEFAULT_ZOOM, animationDuration) => cameraRef.current?.setCamera({ zoomLevel, centerCoordinate: location, animationDuration }),
        fitBounds: (northEast, southWest, paddingConfig, animationDuration) => cameraRef.current?.fitBounds(northEast, southWest, paddingConfig, animationDuration),
    }), []);
    // When the page loses focus, we temporarily set the "idled" state to false.
    // When the page regains focus, the onIdled method of the map will set the actual "idled" state,
    // which in turn triggers the callback.
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!waypoints || waypoints.length === 0 || !isIdle) {
            return;
        }
        if (waypoints.length === 1) {
            cameraRef.current?.setCamera({
                zoomLevel: CONST_1.default.MAPBOX.SINGLE_MARKER_ZOOM,
                animationDuration: 1500,
                centerCoordinate: waypoints.at(0)?.coordinate,
            });
        }
        else {
            const { southWest, northEast } = utils_1.default.getBounds(waypoints.map((waypoint) => waypoint.coordinate), directionCoordinates);
            cameraRef.current?.fitBounds(northEast, southWest, mapPadding, 1000);
        }
    }, [mapPadding, waypoints, isIdle, directionCoordinates]));
    (0, react_1.useEffect)(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setIsIdle(false);
        });
        return unsubscribe;
    }, [navigation]);
    (0, react_1.useEffect)(() => {
        (0, maps_1.setAccessToken)(accessToken).then((token) => {
            if (!token) {
                return;
            }
            setIsAccessTokenSet(true);
        });
    }, [accessToken]);
    const setMapIdle = (e) => {
        if (e.gestures.isGestureActive) {
            return;
        }
        setIsIdle(true);
        if (onMapReady) {
            onMapReady();
        }
    };
    const centerMap = (0, react_1.useCallback)(() => {
        const waypointCoordinates = waypoints?.map((waypoint) => waypoint.coordinate) ?? [];
        if (waypointCoordinates.length > 1 || (directionCoordinates ?? []).length > 1) {
            const { southWest, northEast } = utils_1.default.getBounds(waypoints?.map((waypoint) => waypoint.coordinate) ?? [], directionCoordinates);
            cameraRef.current?.fitBounds(southWest, northEast, mapPadding, CONST_1.default.MAPBOX.ANIMATION_DURATION_ON_CENTER_ME);
            return;
        }
        cameraRef?.current?.setCamera({
            heading: 0,
            centerCoordinate: [currentPosition?.longitude ?? 0, currentPosition?.latitude ?? 0],
            animationDuration: CONST_1.default.MAPBOX.ANIMATION_DURATION_ON_CENTER_ME,
            zoomLevel: CONST_1.default.MAPBOX.SINGLE_MARKER_ZOOM,
        });
    }, [directionCoordinates, currentPosition, mapPadding, waypoints]);
    const centerCoordinate = (0, react_1.useMemo)(() => (currentPosition ? [currentPosition.longitude, currentPosition.latitude] : initialState?.location), [currentPosition, initialState?.location]);
    const waypointsBounds = (0, react_1.useMemo)(() => {
        if (!waypoints) {
            return undefined;
        }
        const { northEast, southWest } = utils_1.default.getBounds(waypoints.map((waypoint) => waypoint.coordinate), directionCoordinates);
        return { ne: northEast, sw: southWest };
    }, [waypoints, directionCoordinates]);
    const defaultSettings = (0, react_1.useMemo)(() => {
        if (interactive) {
            if (!centerCoordinate) {
                return undefined;
            }
            return {
                zoomLevel: initialState?.zoom,
                centerCoordinate,
            };
        }
        if (!waypointsBounds) {
            return undefined;
        }
        return {
            bounds: waypointsBounds,
        };
    }, [interactive, centerCoordinate, waypointsBounds, initialState?.zoom]);
    const initCenterCoordinate = (0, react_1.useMemo)(() => (interactive ? centerCoordinate : undefined), [interactive, centerCoordinate]);
    const initBounds = (0, react_1.useMemo)(() => (interactive ? undefined : waypointsBounds), [interactive, waypointsBounds]);
    const distanceSymbolCoordinate = (0, react_1.useMemo)(() => {
        if (!directionCoordinates?.length || !waypoints?.length) {
            return;
        }
        const { northEast, southWest } = utils_1.default.getBounds(waypoints.map((waypoint) => waypoint.coordinate), directionCoordinates);
        const boundsCenter = utils_1.default.getBoundsCenter({ northEast, southWest });
        return utils_1.default.findClosestCoordinateOnLineFromCenter(boundsCenter, directionCoordinates);
    }, [waypoints, directionCoordinates]);
    return !isOffline && isAccessTokenSet && !!defaultSettings ? (<react_native_1.View style={[style, !interactive ? styles.pointerEventsNone : {}]}>
            <maps_1.default.MapView style={{ flex: 1 }} styleURL={styleURL} onMapIdle={setMapIdle} onTouchStart={() => setUserInteractedWithMap(true)} pitchEnabled={pitchEnabled} attributionPosition={{ ...styles.r2, ...styles.b2 }} scaleBarEnabled={false} 
    // We use scaleBarPosition with top: -32 to hide the scale bar on iOS because scaleBarEnabled={false} not work on iOS
    scaleBarPosition={{ ...styles.tn8, left: 0 }} compassEnabled compassPosition={{ ...styles.l2, ...styles.t5 }} logoPosition={{ ...styles.l2, ...styles.b2 }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...responder_1.default.panHandlers}>
                <maps_1.default.Camera ref={cameraRef} defaultSettings={defaultSettings} 
    // Include centerCoordinate here as well to address the issue of incorrect coordinates
    // displayed after the first render when the app's storage is cleared.
    centerCoordinate={initCenterCoordinate} bounds={initBounds}/>
                {interactive && (<maps_1.default.ShapeSource id="user-location" shape={{
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [currentPosition?.longitude ?? 0, currentPosition?.latitude ?? 0],
                        },
                        properties: {},
                    },
                ],
            }}>
                        <maps_1.default.CircleLayer id="user-location-layer" sourceID="user-location" style={{
                circleColor: colors_1.default.blue400,
                circleRadius: 8,
            }}/>
                    </maps_1.default.ShapeSource>)}
                {waypoints?.map(({ coordinate, markerComponent, id }) => {
            const MarkerComponent = markerComponent;
            if (utils_1.default.areSameCoordinate([coordinate[0], coordinate[1]], [currentPosition?.longitude ?? 0, currentPosition?.latitude ?? 0]) && interactive) {
                return null;
            }
            return (<maps_1.MarkerView id={id} key={id} coordinate={coordinate}>
                            <MarkerComponent />
                        </maps_1.MarkerView>);
        })}

                {!!directionCoordinates && <Direction_1.default coordinates={directionCoordinates}/>}
                {!!distanceSymbolCoordinate && !!distanceInMeters && !!distanceUnit && (<maps_1.MarkerView coordinate={distanceSymbolCoordinate} id="distance-label" key="distance-label">
                        <react_native_1.View style={{ zIndex: 1 }}>
                            <ToggleDistanceUnitButton_1.default accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel="distance-label" onPress={toggleDistanceUnit}>
                                <react_native_1.View style={[styles.distanceLabelWrapper]}>
                                    <Text_1.default style={styles.distanceLabelText}> {distanceLabelText}</Text_1.default>
                                </react_native_1.View>
                            </ToggleDistanceUnitButton_1.default>
                        </react_native_1.View>
                    </maps_1.MarkerView>)}
            </maps_1.default.MapView>
            {interactive && (<react_native_1.View style={[styles.pAbsolute, styles.p5, styles.t0, styles.r0, { zIndex: 1 }]}>
                    <Button_1.default onPress={centerMap} iconFill={theme.icon} icon={Expensicons.Crosshair} accessibilityLabel={translate('common.center')}/>
                </react_native_1.View>)}
        </react_native_1.View>) : (<PendingMapView_1.default title={translate('distance.mapPending.title')} subtitle={isOffline ? translate('distance.mapPending.subtitle') : translate('distance.mapPending.onlineSubtitle')} style={styles.mapEditView}/>);
}
exports.default = (0, react_1.memo)(MapView);
