"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Icon_1 = require("@components/Icon");
var Lottie_1 = require("@components/Lottie");
var Text_1 = require("@components/Text");
var useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var variables_1 = require("@styles/variables");
var BlockingViewSubtitle_1 = require("./BlockingViewSubtitle");
var SubtitleWithBelowLink_1 = require("./SubtitleWithBelowLink");
function BlockingView(_a) {
    var animation = _a.animation, icon = _a.icon, iconColor = _a.iconColor, title = _a.title, _b = _a.subtitle, subtitle = _b === void 0 ? '' : _b, subtitleStyle = _a.subtitleStyle, linkTranslationKey = _a.linkTranslationKey, subtitleKeyBelowLink = _a.subtitleKeyBelowLink, _c = _a.iconWidth, iconWidth = _c === void 0 ? variables_1.default.iconSizeSuperLarge : _c, _d = _a.iconHeight, iconHeight = _d === void 0 ? variables_1.default.iconSizeSuperLarge : _d, _e = _a.onLinkPress, onLinkPress = _e === void 0 ? function () { return Navigation_1.default.dismissModal(); } : _e, _f = _a.shouldEmbedLinkWithSubtitle, shouldEmbedLinkWithSubtitle = _f === void 0 ? false : _f, _g = _a.animationStyles, animationStyles = _g === void 0 ? [] : _g, _h = _a.animationWebStyle, animationWebStyle = _h === void 0 ? {} : _h, _j = _a.accessibilityLabel, accessibilityLabel = _j === void 0 ? '' : _j, CustomSubtitle = _a.CustomSubtitle, contentFitImage = _a.contentFitImage, containerStyleProp = _a.containerStyle, addBottomSafeAreaPadding = _a.addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding = _a.addOfflineIndicatorBottomSafeAreaPadding, testID = _a.testID;
    var styles = (0, useThemeStyles_1.default)();
    var SubtitleWrapper = shouldEmbedLinkWithSubtitle ? Text_1.default : react_native_1.View;
    var subtitleWrapperStyle = (0, react_1.useMemo)(function () { return (shouldEmbedLinkWithSubtitle ? [styles.textAlignCenter] : [styles.alignItemsCenter, styles.justifyContentCenter]); }, [shouldEmbedLinkWithSubtitle, styles]);
    var containerStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding: addOfflineIndicatorBottomSafeAreaPadding, style: containerStyleProp });
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
