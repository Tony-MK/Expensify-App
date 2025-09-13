"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const Text_1 = require("./Text");
function AttachmentOfflineIndicator({ isPreview = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // We don't want to show the offline indicator when the attachment is a cached one, so
    // we delay the display by 200 ms to ensure it is not a cached one.
    const [onCacheDelay, setOnCacheDelay] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const timeout = setTimeout(() => setOnCacheDelay(false), 200);
        return () => clearTimeout(timeout);
    }, []);
    if (!isOffline || onCacheDelay) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexColumn, styles.alignItemsCenter, styles.justifyContentCenter, styles.pAbsolute, styles.h100, styles.w100, isPreview && styles.hoveredComponentBG]}>
            <Icon_1.default fill={theme.icon} src={Expensicons.OfflineCloud} width={variables_1.default.iconSizeSuperLarge} height={variables_1.default.iconSizeSuperLarge}/>
            {!isPreview && (<react_native_1.View>
                    <Text_1.default style={[styles.notFoundTextHeader, styles.ph10]}>{translate('common.youAppearToBeOffline')}</Text_1.default>
                    <Text_1.default style={[styles.textAlignCenter, styles.ph11, styles.textSupporting]}>{translate('common.attachmentWillBeAvailableOnceBackOnline')}</Text_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
}
AttachmentOfflineIndicator.displayName = 'AttachmentOfflineIndicator';
exports.default = AttachmentOfflineIndicator;
