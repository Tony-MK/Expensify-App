"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function PendingMapView({ title = '', subtitle = '', style, isSmallerIcon = false }) {
    const hasTextContent = !(0, isEmpty_1.default)(title) || !(0, isEmpty_1.default)(subtitle);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const iconSize = isSmallerIcon ? variables_1.default.iconSizeSuperLarge : variables_1.default.iconSizeUltraLarge;
    return (<react_native_1.View style={[styles.mapPendingView, style]}>
            {hasTextContent ? (<BlockingView_1.default icon={Expensicons.EmptyStateRoutePending} iconColor={theme.border} title={title} subtitle={subtitle} subtitleStyle={styles.textSupporting}/>) : (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter, styles.ph10]}>
                    <Icon_1.default src={Expensicons.EmptyStateRoutePending} width={iconSize} height={iconSize} fill={theme.border}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
PendingMapView.displayName = 'PendingMapView';
exports.default = PendingMapView;
