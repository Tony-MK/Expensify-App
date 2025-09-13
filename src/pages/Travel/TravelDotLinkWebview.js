"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_webview_1 = require("react-native-webview");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
function TravelDotLinkWebview({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const { token, isTestAccount } = route.params;
    const webViewRef = (0, react_1.useRef)(null);
    const styles = (0, useThemeStyles_1.default)();
    const url = (0, Link_1.buildTravelDotURL)(token, isTestAccount === 'true');
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={TravelDotLinkWebview.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('travel.header')} shouldShowBackButton/>
            <react_native_webview_1.default ref={webViewRef} source={{ uri: url }} style={styles.flex1} incognito originWhitelist={['https://*']}/>
        </ScreenWrapper_1.default>);
}
TravelDotLinkWebview.displayName = 'TravelDotLinkWebview';
exports.default = TravelDotLinkWebview;
