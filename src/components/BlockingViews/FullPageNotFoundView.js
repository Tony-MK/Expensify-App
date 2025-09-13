"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const StatsCounter_1 = require("@libs/actions/StatsCounter");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const BlockingView_1 = require("./BlockingView");
const ForceFullScreenView_1 = require("./ForceFullScreenView");
// eslint-disable-next-line rulesdir/no-negated-variables
function FullPageNotFoundView({ testID, children = null, shouldShow = false, titleKey = 'notFound.notHere', subtitleKey = 'notFound.pageNotFound', linkTranslationKey = 'notFound.goBackHome', subtitleKeyBelowLink, onBackButtonPress = () => Navigation_1.default.goBack(), shouldShowLink = true, shouldShowBackButton = true, onLinkPress = () => Navigation_1.default.goBackToHome(), shouldForceFullScreen = false, subtitleStyle, shouldDisplaySearchRouter, addBottomSafeAreaPadding = true, addOfflineIndicatorBottomSafeAreaPadding = addBottomSafeAreaPadding, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isMediumScreenWidth, isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if (shouldShow) {
        (0, StatsCounter_1.default)('FullPageNotFoundView');
        return (<ForceFullScreenView_1.default shouldForceFullScreen={shouldForceFullScreen}>
                <HeaderWithBackButton_1.default onBackButtonPress={onBackButtonPress} shouldShowBackButton={shouldShowBackButton} shouldDisplaySearchRouter={shouldDisplaySearchRouter && (isMediumScreenWidth || isLargeScreenWidth)}/>
                <react_native_1.View style={[styles.flex1, styles.blockingViewContainer]} testID={testID}>
                    <BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate(titleKey)} subtitle={subtitleKey && translate(subtitleKey)} linkTranslationKey={shouldShowLink ? linkTranslationKey : undefined} subtitleKeyBelowLink={subtitleKeyBelowLink} onLinkPress={onLinkPress} subtitleStyle={subtitleStyle} addBottomSafeAreaPadding={addBottomSafeAreaPadding} addOfflineIndicatorBottomSafeAreaPadding={addOfflineIndicatorBottomSafeAreaPadding} testID={FullPageNotFoundView.displayName}/>
                </react_native_1.View>
            </ForceFullScreenView_1.default>);
    }
    return children;
}
FullPageNotFoundView.displayName = 'FullPageNotFoundView';
exports.default = FullPageNotFoundView;
