"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const TopBar_1 = require("@components/Navigation/TopBar");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const Performance_1 = require("@libs/Performance");
const CONST_1 = require("@src/CONST");
const SidebarLinksData_1 = require("./SidebarLinksData");
function BaseSidebarScreen() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const shouldDisplayLHB = !shouldUseNarrowLayout;
    (0, react_1.useEffect)(() => {
        Performance_1.default.markStart(CONST_1.default.TIMING.SIDEBAR_LOADED);
    }, []);
    return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} style={[styles.sidebar, (0, Browser_1.isMobile)() ? styles.userSelectNone : {}]} testID={BaseSidebarScreen.displayName} bottomContent={!shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.HOME}/>}>
            {({ insets }) => (<>
                    <TopBar_1.default breadcrumbLabel={translate('common.inbox')} shouldDisplaySearch={shouldUseNarrowLayout} shouldDisplayHelpButton={shouldUseNarrowLayout}/>
                    <react_native_1.View style={[styles.flex1]}>
                        <SidebarLinksData_1.default insets={insets}/>
                    </react_native_1.View>
                    {shouldDisplayLHB && <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.HOME}/>}
                </>)}
        </ScreenWrapper_1.default>);
}
BaseSidebarScreen.displayName = 'BaseSidebarScreen';
exports.default = BaseSidebarScreen;
