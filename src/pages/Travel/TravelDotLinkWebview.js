"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_webview_1 = require("react-native-webview");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Link_1 = require("@libs/actions/Link");
function TravelDotLinkWebview(_a) {
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var _b = route.params, token = _b.token, isTestAccount = _b.isTestAccount;
    var webViewRef = (0, react_1.useRef)(null);
    var styles = (0, useThemeStyles_1.default)();
    var url = (0, Link_1.buildTravelDotURL)(token, isTestAccount === 'true');
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={TravelDotLinkWebview.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('travel.header')} shouldShowBackButton/>
            <react_native_webview_1.default ref={webViewRef} source={{ uri: url }} style={styles.flex1} incognito originWhitelist={['https://*']}/>
        </ScreenWrapper_1.default>);
}
TravelDotLinkWebview.displayName = 'TravelDotLinkWebview';
exports.default = TravelDotLinkWebview;
