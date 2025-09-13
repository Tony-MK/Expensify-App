"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBackgroundColor({ routesLength, tabIndex, affectedTabs, theme, position, isActive }) {
    if (routesLength > 1) {
        const inputRange = Array.from({ length: routesLength }, (_, i) => i);
        if (position) {
            return position.interpolate({
                inputRange,
                outputRange: inputRange.map((i) => {
                    return affectedTabs.includes(tabIndex) && i === tabIndex ? theme.border : theme.appBG;
                }),
            });
        }
        return affectedTabs.includes(tabIndex) && isActive ? theme.border : theme.appBG;
    }
    return theme.border;
}
exports.default = getBackgroundColor;
