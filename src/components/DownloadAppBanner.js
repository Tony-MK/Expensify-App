"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useHasLoggedIntoMobileApp_1 = require("@hooks/useHasLoggedIntoMobileApp");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const BillingBanner_1 = require("@pages/settings/Subscription/CardSection/BillingBanner/BillingBanner");
const ROUTES_1 = require("@src/ROUTES");
const Button_1 = require("./Button");
const Illustrations_1 = require("./Icon/Illustrations");
function DownloadAppBanner({ onLayout }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { hasLoggedIntoMobileApp, isLastMobileAppLoginLoaded } = (0, useHasLoggedIntoMobileApp_1.default)();
    if (!isLastMobileAppLoginLoaded || hasLoggedIntoMobileApp) {
        return null;
    }
    return (<react_native_1.View style={[styles.ph2, styles.mb2, styles.stickToBottom, styles.pt2]} onLayout={onLayout}>
            <BillingBanner_1.default icon={Illustrations_1.ExpensifyMobileApp} title={translate('common.getTheApp')} subtitle={translate('common.scanReceiptsOnTheGo')} subtitleStyle={[styles.mt1, styles.mutedTextLabel]} style={[styles.borderRadiusComponentNormal, styles.hoveredComponentBG]} rightComponent={<Button_1.default small success text={translate('common.download')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_APP_DOWNLOAD_LINKS)}/>}/>
        </react_native_1.View>);
}
exports.default = DownloadAppBanner;
