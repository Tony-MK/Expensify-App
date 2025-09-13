"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const Text_1 = require("./Text");
function OfflineIndicator({ style, containerStyles: containerStylesProp, addBottomSafeAreaPadding = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const fallbackStyle = (0, react_1.useMemo)(() => [styles.offlineIndicatorContainer, containerStylesProp], [styles.offlineIndicatorContainer, containerStylesProp]);
    const containerStyles = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({
        addBottomSafeAreaPadding,
        addOfflineIndicatorBottomSafeAreaPadding: false,
        style: fallbackStyle,
    });
    if (!isOffline) {
        return null;
    }
    return (<react_native_1.View style={[containerStyles, styles.flexRow, styles.alignItemsCenter, style]}>
            <Icon_1.default fill={theme.icon} src={Expensicons.OfflineCloud} width={variables_1.default.iconSizeSmall} height={variables_1.default.iconSizeSmall}/>
            <Text_1.default style={[styles.ml3, styles.chatItemComposeSecondaryRowSubText]}>{translate('common.youAppearToBeOffline')}</Text_1.default>
        </react_native_1.View>);
}
OfflineIndicator.displayName = 'OfflineIndicator';
exports.default = OfflineIndicator;
