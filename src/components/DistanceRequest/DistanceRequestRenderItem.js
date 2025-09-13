"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
function DistanceRequestRenderItem({ waypoints, item = '', onSecondaryInteraction, getIndex, isActive = false, onPress = () => { }, disabled = false }) {
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const numberOfWaypoints = Object.keys(waypoints ?? {}).length;
    const lastWaypointIndex = numberOfWaypoints - 1;
    const index = getIndex?.() ?? -1;
    let descriptionKey = 'distance.waypointDescription.';
    let waypointIcon;
    if (index === 0) {
        descriptionKey += 'start';
        waypointIcon = Expensicons.DotIndicatorUnfilled;
    }
    else if (index === lastWaypointIndex) {
        descriptionKey += 'stop';
        waypointIcon = Expensicons.Location;
    }
    else {
        descriptionKey += 'stop';
        waypointIcon = Expensicons.DotIndicator;
    }
    const waypoint = waypoints?.[`waypoint${index}`] ?? {};
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const title = waypoint.name || waypoint.address;
    return (<MenuItemWithTopDescription_1.default description={translate(descriptionKey)} title={title} icon={Expensicons.DragHandles} iconFill={theme.icon} secondaryIcon={waypointIcon} secondaryIconFill={theme.icon} shouldShowRightIcon onPress={() => onPress(index)} onSecondaryInteraction={onSecondaryInteraction} focused={isActive} key={item} disabled={disabled}/>);
}
DistanceRequestRenderItem.displayName = 'DistanceRequestRenderItem';
exports.default = DistanceRequestRenderItem;
