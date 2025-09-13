"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const BaseReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/BaseReportActionContextMenu");
const CONST_1 = require("@src/CONST");
function MiniReportActionContextMenu({ displayAsGroup = false, ...rest }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    return (<react_native_1.View style={StyleUtils.getMiniReportActionContextMenuWrapperStyle(displayAsGroup)} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: rest.isVisible ?? false }}>
            <BaseReportActionContextMenu_1.default isMini 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </react_native_1.View>);
}
MiniReportActionContextMenu.displayName = 'MiniReportActionContextMenu';
exports.default = MiniReportActionContextMenu;
