"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Button_1 = require("./Button");
const CheckboxWithLabel_1 = require("./CheckboxWithLabel");
const FormAlertWithSubmitButton_1 = require("./FormAlertWithSubmitButton");
const ImageSVG_1 = require("./ImageSVG");
const Lottie_1 = require("./Lottie");
const LottieAnimations_1 = require("./LottieAnimations");
const Modal_1 = require("./Modal");
const OfflineIndicator_1 = require("./OfflineIndicator");
const RenderHTML_1 = require("./RenderHTML");
const ScrollView_1 = require("./ScrollView");
const Text_1 = require("./Text");
const VideoPlayer_1 = require("./VideoPlayer");
// Aspect ratio and height of the video.
// Useful before video loads to reserve space.
const VIDEO_ASPECT_RATIO = 1280 / 960;
const MODAL_PADDING = variables_1.default.spacing2;
function FeatureTrainingModal({ animation, animationStyle, illustrationInnerContainerStyle, illustrationOuterContainerStyle, videoURL, illustrationAspectRatio: illustrationAspectRatioProp, image, contentFitImage, width = variables_1.default.featureTrainingModalWidth, title = '', description = '', secondaryDescription = '', titleStyles, shouldShowDismissModalOption = false, confirmText = '', onConfirm = () => { }, onClose = () => { }, helpText = '', onHelp = () => { }, children, contentInnerContainerStyles, contentOuterContainerStyles, modalInnerContainerStyle, imageWidth, imageHeight, isModalDisabled = true, shouldRenderSVG = true, shouldRenderHTMLDescription = false, shouldCloseOnConfirm = true, avoidKeyboard = false, shouldUseScrollView = false, shouldShowConfirmationLoader = false, canConfirmWhileOffline = true, shouldGoBack = true, shouldCallOnHelpWhenModalHidden = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const [willShowAgain, setWillShowAgain] = (0, react_1.useState)(true);
    const [videoStatus, setVideoStatus] = (0, react_1.useState)('video');
    const [isVideoStatusLocked, setIsVideoStatusLocked] = (0, react_1.useState)(false);
    const [illustrationAspectRatio, setIllustrationAspectRatio] = (0, react_1.useState)(illustrationAspectRatioProp ?? VIDEO_ASPECT_RATIO);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const hasHelpButtonBeenPressed = (0, react_1.useRef)(false);
    const scrollViewRef = (0, react_1.useRef)(null);
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(0);
    const [contentHeight, setContentHeight] = (0, react_1.useState)(0);
    const insets = (0, useSafeAreaInsets_1.default)();
    const { isKeyboardActive } = (0, useKeyboardState_1.default)();
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            if (!isModalDisabled) {
                setIsModalVisible(false);
                return;
            }
            setIsModalVisible(true);
        });
    }, [isModalDisabled]);
    (0, react_1.useEffect)(() => {
        if (isVideoStatusLocked) {
            return;
        }
        if (isOffline) {
            setVideoStatus('animation');
        }
        else if (!isOffline) {
            setVideoStatus('video');
            setIsVideoStatusLocked(true);
        }
    }, [isOffline, isVideoStatusLocked]);
    const setAspectRatio = (event) => {
        if (!event) {
            return;
        }
        if ('naturalSize' in event) {
            setIllustrationAspectRatio(event.naturalSize.width / event.naturalSize.height);
        }
        else {
            setIllustrationAspectRatio(event.srcElement.videoWidth / event.srcElement.videoHeight);
        }
    };
    const renderIllustration = (0, react_1.useCallback)(() => {
        const aspectRatio = illustrationAspectRatio || VIDEO_ASPECT_RATIO;
        return (<react_native_1.View style={[
                styles.w100,
                // Prevent layout jumps by reserving height
                // for the video until it loads. Also, when
                // videoStatus === 'animation' it will
                // set the same aspect ratio as the video would.
                illustrationInnerContainerStyle,
                (!!videoURL || !!image) && { aspectRatio },
            ]}>
                {!!image &&
                (shouldRenderSVG ? (<ImageSVG_1.default src={image} contentFit={contentFitImage} width={imageWidth} height={imageHeight} testID={CONST_1.default.IMAGE_SVG_TEST_ID}/>) : (<react_native_1.Image source={image} resizeMode={contentFitImage} style={styles.featureTrainingModalImage} testID={CONST_1.default.IMAGE_TEST_ID}/>))}
                {!!videoURL && videoStatus === 'video' && (<react_native_gesture_handler_1.GestureHandlerRootView>
                        <VideoPlayer_1.default url={videoURL} videoPlayerStyle={[styles.onboardingVideoPlayer, { aspectRatio }]} onVideoLoaded={setAspectRatio} controlsStatus={CONST_1.default.VIDEO_PLAYER.CONTROLS_STATUS.HIDE} shouldUseControlsBottomMargin={false} shouldPlay isLooping/>
                    </react_native_gesture_handler_1.GestureHandlerRootView>)}
                {((!videoURL && !image) || (!!videoURL && videoStatus === 'animation')) && (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter, !!videoURL && { aspectRatio }, animationStyle]}>
                        <Lottie_1.default source={animation ?? LottieAnimations_1.default.Hands} style={styles.h100} webStyle={shouldUseNarrowLayout ? styles.h100 : undefined} autoPlay loop/>
                    </react_native_1.View>)}
            </react_native_1.View>);
    }, [
        illustrationAspectRatio,
        styles.w100,
        styles.featureTrainingModalImage,
        styles.onboardingVideoPlayer,
        styles.flex1,
        styles.alignItemsCenter,
        styles.justifyContentCenter,
        styles.h100,
        illustrationInnerContainerStyle,
        videoURL,
        image,
        shouldRenderSVG,
        contentFitImage,
        imageWidth,
        imageHeight,
        videoStatus,
        animationStyle,
        animation,
        shouldUseNarrowLayout,
    ]);
    const toggleWillShowAgain = (0, react_1.useCallback)(() => setWillShowAgain((prevWillShowAgain) => !prevWillShowAgain), []);
    const closeModal = (0, react_1.useCallback)(() => {
        Log_1.default.hmmm(`[FeatureTrainingModal] closeModal called - willShowAgain: ${willShowAgain}, shouldGoBack: ${shouldGoBack}, hasOnClose: ${!!onClose}`);
        if (!willShowAgain) {
            Log_1.default.hmmm('[FeatureTrainingModal] Dismissing track training modal');
            (0, User_1.setNameValuePair)(ONYXKEYS_1.default.NVP_HAS_SEEN_TRACK_TRAINING, true, false);
        }
        Log_1.default.hmmm('[FeatureTrainingModal] Setting modal invisible');
        setIsModalVisible(false);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Log_1.default.hmmm(`[FeatureTrainingModal] Running after interactions - shouldGoBack: ${shouldGoBack}, hasOnClose: ${!!onClose}`);
            if (shouldGoBack) {
                Log_1.default.hmmm('[FeatureTrainingModal] Navigating back');
                Navigation_1.default.goBack();
            }
            if (onClose) {
                Log_1.default.hmmm('[FeatureTrainingModal] Calling onClose callback');
                onClose();
            }
            else {
                Log_1.default.hmmm('[FeatureTrainingModal] No onClose callback provided');
            }
        });
    }, [onClose, shouldGoBack, willShowAgain]);
    const closeAndConfirmModal = (0, react_1.useCallback)(() => {
        Log_1.default.hmmm(`[FeatureTrainingModal] Button pressed - shouldCloseOnConfirm: ${shouldCloseOnConfirm}, hasOnConfirm: ${!!onConfirm}, willShowAgain: ${willShowAgain}`);
        if (shouldCloseOnConfirm) {
            Log_1.default.hmmm('[FeatureTrainingModal] Calling closeModal');
            closeModal();
        }
        if (onConfirm) {
            Log_1.default.hmmm('[FeatureTrainingModal] Calling onConfirm callback');
            onConfirm(willShowAgain);
        }
        else {
            Log_1.default.hmmm('[FeatureTrainingModal] No onConfirm callback provided');
        }
    }, [shouldCloseOnConfirm, onConfirm, closeModal, willShowAgain]);
    // Scrolls modal to the bottom when keyboard appears so the action buttons are visible.
    (0, react_1.useEffect)(() => {
        if (contentHeight <= containerHeight || onboardingIsMediumOrLargerScreenWidth || !shouldUseScrollView) {
            return;
        }
        scrollViewRef.current?.scrollToEnd({ animated: false });
    }, [contentHeight, containerHeight, onboardingIsMediumOrLargerScreenWidth, shouldUseScrollView]);
    const Wrapper = shouldUseScrollView ? ScrollView_1.default : react_native_1.View;
    const wrapperStyles = (0, react_1.useMemo)(() => (shouldUseScrollView ? StyleUtils.getScrollableFeatureTrainingModalStyles(insets, isKeyboardActive) : {}), [shouldUseScrollView, StyleUtils, insets, isKeyboardActive]);
    return (<Modal_1.default avoidKeyboard={avoidKeyboard} isVisible={isModalVisible} type={onboardingIsMediumOrLargerScreenWidth ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE : CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED} onClose={closeModal} innerContainerStyle={{
            boxShadow: 'none',
            ...(shouldUseScrollView ? styles.pb0 : styles.pb5),
            paddingTop: onboardingIsMediumOrLargerScreenWidth ? undefined : MODAL_PADDING,
            ...(onboardingIsMediumOrLargerScreenWidth
                ? // Override styles defined by MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE
                    // To make it take as little space as possible.
                    {
                        flex: undefined,
                        width: 'auto',
                    }
                : {}),
            ...modalInnerContainerStyle,
        }} onModalHide={() => {
            if (!shouldCallOnHelpWhenModalHidden || !hasHelpButtonBeenPressed.current) {
                return;
            }
            onHelp();
        }} shouldDisableBottomSafeAreaPadding={shouldUseScrollView}>
            <Wrapper scrollsToTop={false} style={[styles.mh100, onboardingIsMediumOrLargerScreenWidth && StyleUtils.getWidthStyle(width), wrapperStyles.style]} contentContainerStyle={wrapperStyles.containerStyle} keyboardShouldPersistTaps={shouldUseScrollView ? 'handled' : undefined} ref={shouldUseScrollView ? scrollViewRef : undefined} onLayout={shouldUseScrollView ? (e) => setContainerHeight(e.nativeEvent.layout.height) : undefined} onContentSizeChange={shouldUseScrollView ? (_w, h) => setContentHeight(h) : undefined} 
    // Wrapper is either a View or ScrollView, which is also a View.
    // eslint-disable-next-line react/forbid-component-props
    fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? { padding: MODAL_PADDING } : { paddingHorizontal: MODAL_PADDING }, illustrationOuterContainerStyle]}>
                    {renderIllustration()}
                </react_native_1.View>
                <react_native_1.View style={[styles.mt5, styles.mh5, contentOuterContainerStyles]}>
                    {!!title && !!description && (<react_native_1.View style={[
                onboardingIsMediumOrLargerScreenWidth ? [styles.gap1, styles.mb8] : [shouldRenderHTMLDescription ? styles.mb5 : styles.mb10],
                contentInnerContainerStyles,
            ]}>
                            {typeof title === 'string' ? <Text_1.default style={[styles.textHeadlineH1, titleStyles]}>{title}</Text_1.default> : title}
                            {shouldRenderHTMLDescription ? (<react_native_1.View style={styles.mb2}>
                                    <RenderHTML_1.default html={description}/>
                                </react_native_1.View>) : (<Text_1.default style={styles.textSupporting}>{description}</Text_1.default>)}
                            {secondaryDescription.length > 0 && <Text_1.default style={[styles.textSupporting, styles.mt4]}>{secondaryDescription}</Text_1.default>}
                            {children}
                        </react_native_1.View>)}
                    {shouldShowDismissModalOption && (<CheckboxWithLabel_1.default label={translate('featureTraining.doNotShowAgain')} accessibilityLabel={translate('featureTraining.doNotShowAgain')} style={[styles.mb5]} isChecked={!willShowAgain} onInputChange={toggleWillShowAgain}/>)}
                    {!!helpText && (<Button_1.default large style={[styles.mb3]} onPress={() => {
                if (shouldCallOnHelpWhenModalHidden) {
                    setIsModalVisible(false);
                    hasHelpButtonBeenPressed.current = true;
                    return;
                }
                onHelp();
            }} text={helpText}/>)}
                    <FormAlertWithSubmitButton_1.default onSubmit={closeAndConfirmModal} isLoading={shouldShowConfirmationLoader} buttonText={confirmText} enabledWhenOffline={canConfirmWhileOffline}/>
                    {!canConfirmWhileOffline && <OfflineIndicator_1.default />}
                </react_native_1.View>
            </Wrapper>
        </Modal_1.default>);
}
exports.default = FeatureTrainingModal;
