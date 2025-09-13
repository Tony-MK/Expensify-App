"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
function SavedSearchItemThreeDotMenu(_a) {
    var menuItems = _a.menuItems, isDisabledItem = _a.isDisabledItem, hideProductTrainingTooltip = _a.hideProductTrainingTooltip, renderTooltipContent = _a.renderTooltipContent, shouldRenderTooltip = _a.shouldRenderTooltip;
    var styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[isDisabledItem && styles.pointerEventsNone]}>
            <ThreeDotsMenu_1.default shouldSelfPosition menuItems={menuItems} renderProductTrainingTooltipContent={renderTooltipContent} shouldShowProductTrainingTooltip={shouldRenderTooltip} anchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        }} iconStyles={styles.wAuto} hideProductTrainingTooltip={hideProductTrainingTooltip}/>
        </react_native_1.View>);
}
exports.default = SavedSearchItemThreeDotMenu;
