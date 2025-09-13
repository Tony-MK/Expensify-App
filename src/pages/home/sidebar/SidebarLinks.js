"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const LHNOptionsList_1 = require("@components/LHNOptionsList/LHNOptionsList");
const OptionsListSkeletonView_1 = require("@components/OptionsListSkeletonView");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const App_1 = require("@libs/actions/App");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionContextMenu = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SidebarLinks({ insets, optionListItems, isLoading, priorityMode = CONST_1.default.PRIORITY_MODE.DEFAULT, isActiveReport }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    (0, react_1.useEffect)(() => {
        (0, App_1.confirmReadyToOpenApp)();
    }, []);
    (0, react_1.useEffect)(() => {
        ReportActionContextMenu.hideContextMenu(false);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    /**
     * Show Report page with selected report id
     */
    const showReportPage = (0, react_1.useCallback)((option) => {
        // Prevent opening Report page when clicking LHN row quickly after clicking FAB icon
        // or when clicking the active LHN row on large screens
        // or when continuously clicking different LHNs, only apply to small screen
        // since getTopmostReportId always returns on other devices
        const reportActionID = Navigation_1.default.getTopmostReportActionId();
        // Prevent opening a new Report page if the user quickly taps on another conversation
        // before the first one is displayed.
        const shouldBlockReportNavigation = Navigation_1.default.getActiveRoute() !== '/home' && shouldUseNarrowLayout;
        if ((option.reportID === Navigation_1.default.getTopmostReportId() && !reportActionID) ||
            (shouldUseNarrowLayout && isActiveReport(option.reportID) && !reportActionID) ||
            shouldBlockReportNavigation) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(option.reportID));
    }, [shouldUseNarrowLayout, isActiveReport]);
    const viewMode = priorityMode === CONST_1.default.PRIORITY_MODE.GSD ? CONST_1.default.OPTION_MODE.COMPACT : CONST_1.default.OPTION_MODE.DEFAULT;
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    const contentContainerStyles = (0, react_1.useMemo)(() => react_native_1.StyleSheet.flatten([styles.pt2, { paddingBottom: StyleUtils.getSafeAreaMargins(insets).marginBottom }]), [insets]);
    return (<react_native_1.View style={[styles.flex1, styles.h100]}>
            <react_native_1.View style={[styles.pRelative, styles.flex1]}>
                <LHNOptionsList_1.default style={styles.flex1} contentContainerStyles={contentContainerStyles} data={optionListItems} onSelectRow={showReportPage} shouldDisableFocusOptions={shouldUseNarrowLayout} optionMode={viewMode} onFirstItemRendered={App_1.setSidebarLoaded}/>
                {!!isLoading && optionListItems?.length === 0 && (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFillObject, styles.appBG, styles.mt3]}>
                        <OptionsListSkeletonView_1.default shouldAnimate/>
                    </react_native_1.View>)}
            </react_native_1.View>
        </react_native_1.View>);
}
SidebarLinks.displayName = 'SidebarLinks';
exports.default = (0, react_1.memo)(SidebarLinks);
