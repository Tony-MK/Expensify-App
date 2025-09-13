"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SidebarLinks_1 = require("./SidebarLinks");
function SidebarLinksData({ insets }) {
    const isFocused = (0, native_1.useIsFocused)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [priorityMode = CONST_1.default.PRIORITY_MODE.DEFAULT] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true });
    const { orderedReports, currentReportID } = (0, useSidebarOrderedReports_1.useSidebarOrderedReports)();
    const currentReportIDRef = (0, react_1.useRef)(currentReportID);
    // eslint-disable-next-line react-compiler/react-compiler
    currentReportIDRef.current = currentReportID;
    const isActiveReport = (0, react_1.useCallback)((reportID) => currentReportIDRef.current === reportID, []);
    return (<react_native_1.View accessibilityElementsHidden={!isFocused} collapsable={false} accessibilityLabel={translate('sidebarScreen.listOfChats')} style={[styles.flex1, styles.h100]}>
            <SidebarLinks_1.default 
    // Forwarded props:
    insets={insets} priorityMode={priorityMode ?? CONST_1.default.PRIORITY_MODE.DEFAULT} 
    // Data props:
    isActiveReport={isActiveReport} isLoading={isLoadingApp ?? false} optionListItems={orderedReports}/>
        </react_native_1.View>);
}
SidebarLinksData.displayName = 'SidebarLinksData';
exports.default = SidebarLinksData;
