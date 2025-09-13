"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Expensicons = require("@components/Icon/Expensicons");
const MapView_1 = require("@components/MapView");
const PendingMapView_1 = require("@components/MapView/PendingMapView");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function DistanceMapView({ overlayStyle, requireRouteToDisplayMap, ...rest }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isMapReady, setIsMapReady] = (0, react_1.useState)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<>
            <MapView_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} onMapReady={() => {
            if (isMapReady) {
                return;
            }
            setIsMapReady(true);
        }}/>
            {!isMapReady && (<react_native_1.View style={[styles.mapViewOverlay, overlayStyle, requireRouteToDisplayMap && StyleUtils.getBorderRadiusStyle(0)]}>
                    {/* The "map pending" text should only be shown in the IOU create flow. In the created IOU preview, only the icon should be shown. */}
                    {!requireRouteToDisplayMap ? (<BlockingView_1.default icon={Expensicons.EmptyStateRoutePending} title={translate('distance.mapPending.title')} subtitle={isOffline ? translate('distance.mapPending.subtitle') : translate('distance.mapPending.onlineSubtitle')} iconColor={theme.border}/>) : (<PendingMapView_1.default isSmallerIcon style={StyleUtils.getBorderRadiusStyle(0)}/>)}
                </react_native_1.View>)}
        </>);
}
DistanceMapView.displayName = 'DistanceMapView';
exports.default = DistanceMapView;
