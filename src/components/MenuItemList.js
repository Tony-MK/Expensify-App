"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const mergeRefs_1 = require("@libs/mergeRefs");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const MenuItem_1 = require("./MenuItem");
const OfflineWithFeedback_1 = require("./OfflineWithFeedback");
function MenuItemList({ menuItems = [], shouldUseSingleExecution = false, wrapperStyle = {}, icon = undefined, iconWidth = undefined, iconHeight = undefined }) {
    const popoverAnchor = (0, react_1.useRef)(null);
    const { isExecuting, singleExecution } = (0, useSingleExecution_1.default)();
    /**
     * Handle the secondary interaction for a menu item.
     *
     * @param link the menu item link or function to get the link
     * @param event the interaction event
     */
    const secondaryInteraction = (link, event) => {
        if (typeof link === 'function') {
            link().then((url) => (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event,
                selection: url,
                contextMenuAnchor: popoverAnchor.current,
            }));
        }
        else if (link) {
            (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event,
                selection: link,
                contextMenuAnchor: popoverAnchor.current,
            });
        }
    };
    return (
    // ref is accessed for MenuItem's ref initialization
    // eslint-disable-next-line react-compiler/react-compiler
    menuItems.map(({ key, ref, ...menuItemProps }) => (<OfflineWithFeedback_1.default key={key ?? menuItemProps.title} pendingAction={menuItemProps.pendingAction} onClose={menuItemProps.onPendingActionDismiss} errors={menuItemProps.error} shouldForceOpacity={menuItemProps.shouldForceOpacity}>
                <MenuItem_1.default key={key ?? menuItemProps.title} wrapperStyle={wrapperStyle} onSecondaryInteraction={menuItemProps.link !== undefined ? (e) => secondaryInteraction(menuItemProps.link, e) : undefined} ref={(0, mergeRefs_1.default)(ref, popoverAnchor)} shouldBlockSelection={!!menuItemProps.link} icon={icon} iconWidth={iconWidth} iconHeight={iconHeight} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...menuItemProps} disabled={!!menuItemProps.disabled || isExecuting} onPress={shouldUseSingleExecution ? singleExecution(menuItemProps.onPress) : menuItemProps.onPress}/>
            </OfflineWithFeedback_1.default>)));
}
MenuItemList.displayName = 'MenuItemList';
exports.default = MenuItemList;
