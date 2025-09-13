"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ImageSVG_1 = require("@components/ImageSVG");
const Lottie_1 = require("@components/Lottie");
const Text_1 = require("@components/Text");
const VideoPlayer_1 = require("@components/VideoPlayer");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const EmojiUtils_1 = require("@libs/EmojiUtils");
const TextWithEmojiFragment_1 = require("@pages/home/report/comment/TextWithEmojiFragment");
const CONST_1 = require("@src/CONST");
const VIDEO_ASPECT_RATIO = 400 / 225;
function EmptyStateComponent({ SkeletonComponent, headerMediaType, headerMedia, buttons, containerStyles, title, titleStyles, subtitle, children, headerStyles, cardStyles, cardContentStyles, headerContentStyles, lottieWebViewStyles, minModalHeight = 400, subtitleText, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [videoAspectRatio, setVideoAspectRatio] = (0, react_1.useState)(VIDEO_ASPECT_RATIO);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const doesSubtitleContainCustomEmojiAndMore = (0, EmojiUtils_1.containsCustomEmoji)(subtitle ?? '') && !(0, EmojiUtils_1.containsOnlyCustomEmoji)(subtitle ?? '');
    const setAspectRatio = (event) => {
        if (!event) {
            return;
        }
        if ('naturalSize' in event) {
            setVideoAspectRatio(event.naturalSize.width / event.naturalSize.height);
        }
        else {
            setVideoAspectRatio(event.srcElement.videoWidth / event.srcElement.videoHeight);
        }
    };
    const HeaderComponent = (0, react_1.useMemo)(() => {
        switch (headerMediaType) {
            case CONST_1.default.EMPTY_STATE_MEDIA.VIDEO:
                return (<VideoPlayer_1.default url={headerMedia} videoPlayerStyle={[headerContentStyles, { aspectRatio: videoAspectRatio }]} videoStyle={styles.emptyStateVideo} onVideoLoaded={setAspectRatio} controlsStatus={CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.SHOW} shouldUseControlsBottomMargin={false} shouldPlay isLooping/>);
            case CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION:
                return (<Lottie_1.default source={headerMedia} autoPlay loop style={headerContentStyles} webStyle={lottieWebViewStyles}/>);
            case CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION:
                return (<ImageSVG_1.default style={headerContentStyles} src={headerMedia}/>);
            default:
                return null;
        }
    }, [headerMedia, headerMediaType, headerContentStyles, videoAspectRatio, styles.emptyStateVideo, lottieWebViewStyles]);
    return (<react_native_1.View style={[{ minHeight: minModalHeight }, styles.flexGrow1, styles.flexShrink0, containerStyles]}>
            {!!SkeletonComponent && (<react_native_1.View style={[styles.skeletonBackground, styles.overflowHidden]}>
                    <SkeletonComponent gradientOpacityEnabled shouldAnimate={false}/>
                </react_native_1.View>)}
            <react_native_1.View style={styles.emptyStateForeground}>
                <react_native_1.View style={[styles.emptyStateContent, cardStyles]}>
                    <react_native_1.View style={[styles.emptyStateHeader(headerMediaType === CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION), headerStyles]}>{HeaderComponent}</react_native_1.View>
                    <react_native_1.View style={[shouldUseNarrowLayout ? styles.p5 : styles.p8, cardContentStyles]}>
                        <Text_1.default style={[styles.textAlignCenter, styles.textHeadlineH1, styles.mb2, titleStyles]}>{title}</Text_1.default>
                        {subtitleText ??
            (doesSubtitleContainCustomEmojiAndMore ? (<TextWithEmojiFragment_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.textNormal]} message={subtitle}/>) : (<Text_1.default style={[styles.textAlignCenter, styles.textSupporting, styles.textNormal]}>{subtitle}</Text_1.default>))}
                        {children}
                        {!(0, isEmpty_1.default)(buttons) && (<react_native_1.View style={[styles.gap2, styles.mt5, !shouldUseNarrowLayout ? styles.flexRow : styles.flexColumn]}>
                                {buttons?.map(({ buttonText, buttonAction, success, icon, isDisabled, style }) => (<Button_1.default key={buttonText} success={success} onPress={buttonAction} text={buttonText} icon={icon} large isDisabled={isDisabled} style={[styles.flex1, style]}/>))}
                            </react_native_1.View>)}
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
EmptyStateComponent.displayName = 'EmptyStateComponent';
exports.default = EmptyStateComponent;
