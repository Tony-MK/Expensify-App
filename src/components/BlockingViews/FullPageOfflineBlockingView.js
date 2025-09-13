"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const BlockingView_1 = require("./BlockingView");
function FullPageOfflineBlockingView({ children, addBottomSafeAreaPadding = true, addOfflineIndicatorBottomSafeAreaPadding = addBottomSafeAreaPadding }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const theme = (0, useTheme_1.default)();
    if (isOffline) {
        return (<BlockingView_1.default icon={Expensicons.OfflineCloud} iconColor={theme.offline} title={translate('common.youAppearToBeOffline')} subtitle={translate('common.thisFeatureRequiresInternet')} addBottomSafeAreaPadding={addBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={addOfflineIndicatorBottomSafeAreaPadding}/>);
    }
    return children;
}
FullPageOfflineBlockingView.displayName = 'FullPageOfflineBlockingView';
exports.default = FullPageOfflineBlockingView;
