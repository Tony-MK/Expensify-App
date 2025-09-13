"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function SavedSearchItemThreeDotMenu({ menuItems, isDisabledItem, hideProductTrainingTooltip, renderTooltipContent, shouldRenderTooltip }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[isDisabledItem && styles.pointerEventsNone]}>
            <ThreeDotsMenu_1.default shouldSelfPosition menuItems={menuItems} renderProductTrainingTooltipContent={renderTooltipContent} shouldShowProductTrainingTooltip={shouldRenderTooltip} anchorAlignment={{
            horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
        }} iconStyles={styles.wAuto} hideProductTrainingTooltip={hideProductTrainingTooltip}/>
        </react_native_1.View>);
}
exports.default = SavedSearchItemThreeDotMenu;
