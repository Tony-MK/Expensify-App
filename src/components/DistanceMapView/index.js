"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MapView_1 = require("@components/MapView");
function DistanceMapView({ overlayStyle, ...rest }) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MapView_1.default {...rest}/>;
}
DistanceMapView.displayName = 'DistanceMapView';
exports.default = DistanceMapView;
