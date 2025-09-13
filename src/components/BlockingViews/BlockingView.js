"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Lottie_1 = require("@components/Lottie");
const Text_1 = require("@components/Text");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const BlockingViewSubtitle_1 = require("./BlockingViewSubtitle");
const SubtitleWithBelowLink_1 = require("./SubtitleWithBelowLink");
function BlockingView({ animation, icon, iconColor, title, subtitle = '', subtitleStyle, linkTranslationKey, subtitleKeyBelowLink, iconWidth = variables_1.default.iconSizeSuperLarge, iconHeight = variables_1.default.iconSizeSuperLarge, onLinkPress = () => Navigation_1.default.dismissModal(), shouldEmbedLinkWithSubtitle = false, animationStyles = [], animationWebStyle = {}, accessibilityLabel = '', CustomSubtitle, contentFitImage, containerStyle: containerStyleProp, addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, testID, }) {
    const styles = (0, useThemeStyles_1.default)();
    const SubtitleWrapper = shouldEmbedLinkWithSubtitle ? Text_1.default : react_native_1.View;
    const subtitleWrapperStyle = (0, react_1.useMemo)(() => (shouldEmbedLinkWithSubtitle ? [styles.textAlignCenter] : [styles.alignItemsCenter, styles.justifyContentCenter]), [shouldEmbedLinkWithSubtitle, styles]);
    const containerStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, style: containerStyleProp });
    return (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter, styles.ph10, containerStyle]} accessibilityLabel={accessibilityLabel} testID={testID}>
            {!!animation && (<Lottie_1.default source={animation} loop autoPlay style={animationStyles} webStyle={animationWebStyle}/>)}
            {!!icon && (<Icon_1.default src={icon} fill={iconColor} width={iconWidth} height={iconHeight} contentFit={contentFitImage}/>)}
            <react_native_1.View>
                <Text_1.default style={[styles.notFoundTextHeader]}>{title}</Text_1.default>

                {CustomSubtitle}
                {!CustomSubtitle && (<SubtitleWrapper style={subtitleWrapperStyle}>
                        {!!subtitleKeyBelowLink && !!linkTranslationKey ? (<SubtitleWithBelowLink_1.default subtitle={subtitle} subtitleStyle={subtitleStyle} subtitleKeyBelowLink={subtitleKeyBelowLink} onLinkPress={onLinkPress} linkTranslationKey={linkTranslationKey}/>) : (<BlockingViewSubtitle_1.default subtitle={subtitle} subtitleStyle={subtitleStyle} onLinkPress={onLinkPress} linkTranslationKey={linkTranslationKey}/>)}
                    </SubtitleWrapper>)}
            </react_native_1.View>
        </react_native_1.View>);
}
BlockingView.displayName = 'BlockingView';
exports.default = BlockingView;
