"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maps_1 = require("@rnmapbox/maps");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function Direction({ coordinates }) {
    const styles = (0, useThemeStyles_1.default)();
    if (coordinates.length < 1) {
        return null;
    }
    return (<maps_1.default.ShapeSource id="routeSource" shape={{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates,
            },
        }}>
            <maps_1.default.LineLayer id="routeFill" style={styles.mapDirection}/>
        </maps_1.default.ShapeSource>);
}
Direction.displayName = 'Direction';
exports.default = Direction;
