"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_image_size_1 = require("react-native-image-size");
const react_native_reanimated_1 = require("react-native-reanimated");
const Button_1 = require("@components/Button");
const HeaderGap_1 = require("@components/HeaderGap");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Modal_1 = require("@components/Modal");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const cropOrRotateImage_1 = require("@libs/cropOrRotateImage");
const CONST_1 = require("@src/CONST");
const ImageCropView_1 = require("./ImageCropView");
const Slider_1 = require("./Slider");
// This component can't be written using class since reanimated API uses hooks.
function AvatarCropModal({ imageUri = '', imageName = '', imageType = '', onClose, onSave, isVisible, maskImage }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const originalImageWidth = (0, react_native_reanimated_1.useSharedValue)(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
    const originalImageHeight = (0, react_native_reanimated_1.useSharedValue)(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
    const translateY = (0, react_native_reanimated_1.useSharedValue)(0);
    const translateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const scale = (0, react_native_reanimated_1.useSharedValue)(CONST_1.default.AVATAR_CROP_MODAL.MIN_SCALE);
    const rotation = (0, react_native_reanimated_1.useSharedValue)(0);
    const translateSlider = (0, react_native_reanimated_1.useSharedValue)(0);
    const isPressableEnabled = (0, react_native_reanimated_1.useSharedValue)(true);
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    // Check if image cropping, saving or uploading is in progress
    const isLoading = (0, react_native_reanimated_1.useSharedValue)(false);
    // The previous offset values are maintained to recalculate the offset value in proportion
    // to the container size, especially when the window size is first decreased and then increased
    const prevMaxOffsetX = (0, react_native_reanimated_1.useSharedValue)(0);
    const prevMaxOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const [imageContainerSize, setImageContainerSize] = (0, react_1.useState)(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
    const [sliderContainerSize, setSliderContainerSize] = (0, react_1.useState)(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
    const [isImageContainerInitialized, setIsImageContainerInitialized] = (0, react_1.useState)(false);
    const [isImageInitialized, setIsImageInitialized] = (0, react_1.useState)(false);
    // An onLayout callback, that initializes the image container, for proper render of an image
    const initializeImageContainer = (0, react_1.useCallback)((event) => {
        setIsImageContainerInitialized(true);
        const { height, width } = event.nativeEvent.layout;
        // Even if the browser height is reduced too much, the relative height should not be negative
        const relativeHeight = Math.max(height - CONST_1.default.AVATAR_CROP_MODAL.CONTAINER_VERTICAL_MARGIN, CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
        setImageContainerSize(Math.floor(Math.min(relativeHeight, width)));
    }, []);
    // An onLayout callback, that initializes the slider container size, for proper render of a slider
    const initializeSliderContainer = (0, react_1.useCallback)((event) => {
        setSliderContainerSize(event.nativeEvent.layout.width);
    }, []);
    // Changes the modal state values to initial
    const resetState = (0, react_1.useCallback)(() => {
        originalImageWidth.set(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
        originalImageHeight.set(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
        translateY.set(0);
        translateX.set(0);
        scale.set(CONST_1.default.AVATAR_CROP_MODAL.MIN_SCALE);
        rotation.set(0);
        translateSlider.set(0);
        prevMaxOffsetX.set(0);
        prevMaxOffsetY.set(0);
        isLoading.set(false);
        setImageContainerSize(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
        setSliderContainerSize(CONST_1.default.AVATAR_CROP_MODAL.INITIAL_SIZE);
        setIsImageContainerInitialized(false);
        setIsImageInitialized(false);
    }, [originalImageHeight, originalImageWidth, prevMaxOffsetX, prevMaxOffsetY, rotation, scale, translateSlider, translateX, translateY, isLoading]);
    // In order to calculate proper image position/size/animation, we have to know its size.
    // And we have to update image size if image url changes.
    (0, react_1.useEffect)(() => {
        if (!imageUri) {
            return;
        }
        // We need to have image sizes in shared values to properly calculate position/size/animation
        react_native_image_size_1.default.getSize(imageUri).then(({ width, height, rotation: originalRotation }) => {
            // On Android devices ImageSize library returns also rotation parameter.
            if (originalRotation === 90 || originalRotation === 270) {
                originalImageHeight.set(width);
                originalImageWidth.set(height);
            }
            else {
                originalImageHeight.set(height);
                originalImageWidth.set(width);
            }
            setIsImageInitialized(true);
            // Because the reanimated library has some internal optimizations,
            // sometimes when the modal is hidden styles of the image and slider might not be updated.
            // To trigger the update we need to slightly change the following values:
            translateSlider.set((value) => value + 0.01);
            rotation.set((value) => value + 360);
        });
    }, [imageUri, originalImageHeight, originalImageWidth, rotation, translateSlider]);
    /**
     * Validates that value is within the provided mix/max range.
     */
    const clamp = (0, react_1.useCallback)((value, [min, max]) => {
        'worklet';
        return (0, react_native_reanimated_1.interpolate)(value, [min, max], [min, max], 'clamp');
    }, []);
    /**
     * Returns current image size taking into account scale and rotation.
     */
    const getDisplayedImageSize = (0, react_1.useCallback)(() => {
        'worklet';
        let height = imageContainerSize * scale.get();
        let width = imageContainerSize * scale.get();
        // Since the smaller side will be always equal to the imageContainerSize multiplied by scale,
        // another side can be calculated with aspect ratio.
        if (originalImageWidth.get() > originalImageHeight.get()) {
            width *= originalImageWidth.get() / originalImageHeight.get();
        }
        else {
            height *= originalImageHeight.get() / originalImageWidth.get();
        }
        return { height, width };
    }, [imageContainerSize, originalImageHeight, originalImageWidth, scale]);
    /**
     * Validates the offset to prevent overflow, and updates the image offset.
     */
    const updateImageOffset = (0, react_1.useCallback)((offsetX, offsetY) => {
        'worklet';
        const { height, width } = getDisplayedImageSize();
        const maxOffsetX = (width - imageContainerSize) / 2;
        const maxOffsetY = (height - imageContainerSize) / 2;
        translateX.set(clamp(offsetX, [maxOffsetX * -1, maxOffsetX]));
        translateY.set(clamp(offsetY, [maxOffsetY * -1, maxOffsetY]));
        prevMaxOffsetX.set(maxOffsetX);
        prevMaxOffsetY.set(maxOffsetY);
    }, [getDisplayedImageSize, imageContainerSize, translateX, clamp, translateY, prevMaxOffsetX, prevMaxOffsetY]);
    const newScaleValue = (0, react_1.useCallback)((newSliderValue, containerSize) => {
        'worklet';
        const { MAX_SCALE, MIN_SCALE } = CONST_1.default.AVATAR_CROP_MODAL;
        return (newSliderValue / containerSize) * (MAX_SCALE - MIN_SCALE) + MIN_SCALE;
    }, []);
    /**
     * Calculates new x & y image translate value on image panning
     * and updates image's offset.
     */
    const panGesture = react_native_gesture_handler_1.Gesture.Pan().onChange((event) => {
        const newX = translateX.get() + event.changeX;
        const newY = translateY.get() + event.changeY;
        updateImageOffset(newX, newY);
    });
    // This effect is needed to recalculate the maximum offset values
    // when the browser window is resized.
    (0, react_1.useEffect)(() => {
        // If no panning has happened and the value is 0, do an early return.
        if (!prevMaxOffsetX.get() && !prevMaxOffsetY.get()) {
            return;
        }
        const { height, width } = getDisplayedImageSize();
        const maxOffsetX = (width - imageContainerSize) / 2;
        const maxOffsetY = (height - imageContainerSize) / 2;
        // Since interpolation is expensive, we only want to do it if
        // image has been panned across X or Y axis by the user.
        if (prevMaxOffsetX) {
            translateX.set((0, react_native_reanimated_1.interpolate)(translateX.get(), [prevMaxOffsetX.get() * -1, prevMaxOffsetX.get()], [maxOffsetX * -1, maxOffsetX]));
        }
        if (prevMaxOffsetY) {
            translateY.set((0, react_native_reanimated_1.interpolate)(translateY.get(), [prevMaxOffsetY.get() * -1, prevMaxOffsetY.get()], [maxOffsetY * -1, maxOffsetY]));
        }
        prevMaxOffsetX.set(maxOffsetX);
        prevMaxOffsetY.set(maxOffsetY);
    }, [getDisplayedImageSize, imageContainerSize, prevMaxOffsetX, prevMaxOffsetY, translateX, translateY]);
    /**
     * Calculates new scale value and updates images offset to ensure
     * that image stays in the center of the container after changing scale.
     */
    const sliderPanGestureCallbacks = {
        onBegin: () => {
            'worklet';
            isPressableEnabled.set(false);
        },
        onChange: (event) => {
            'worklet';
            const newSliderValue = clamp(translateSlider.get() + event.changeX, [0, sliderContainerSize]);
            const newScale = newScaleValue(newSliderValue, sliderContainerSize);
            const differential = newScale / scale.get();
            scale.set(newScale);
            translateSlider.set(newSliderValue);
            const newX = translateX.get() * differential;
            const newY = translateY.get() * differential;
            updateImageOffset(newX, newY);
        },
        onFinalize: () => {
            'worklet';
            isPressableEnabled.set(true);
        },
    };
    // This effect is needed to prevent the incorrect position of
    // the slider's knob when the window's layout changes
    (0, react_1.useEffect)(() => {
        translateSlider.set((0, react_native_reanimated_1.interpolate)(scale.get(), [CONST_1.default.AVATAR_CROP_MODAL.MIN_SCALE, CONST_1.default.AVATAR_CROP_MODAL.MAX_SCALE], [0, sliderContainerSize]));
    }, [scale, sliderContainerSize, translateSlider]);
    // Rotates the image by changing the rotation value by 90 degrees
    // and updating the position so the image remains in the same place after rotation
    const rotateImage = (0, react_1.useCallback)(() => {
        (0, react_native_reanimated_1.runOnUI)(() => {
            rotation.set((value) => value - 90);
            const oldTranslateX = translateX.get();
            translateX.set(translateY.get());
            translateY.set(oldTranslateX * -1);
            const oldOriginalImageHeight = originalImageHeight.get();
            originalImageHeight.set(originalImageWidth.get());
            originalImageWidth.set(oldOriginalImageHeight);
        })();
    }, [originalImageHeight, originalImageWidth, rotation, translateX, translateY]);
    // Crops an image that was provided in the imageUri prop, using the current position/scale
    // then calls onSave and onClose callbacks
    const cropAndSaveImage = (0, react_1.useCallback)(() => {
        if (isLoading.get()) {
            return;
        }
        isLoading.set(true);
        const smallerSize = Math.min(originalImageHeight.get(), originalImageWidth.get());
        const size = smallerSize / scale.get();
        const imageCenterX = originalImageWidth.get() / 2;
        const imageCenterY = originalImageHeight.get() / 2;
        const apothem = size / 2; // apothem for squares is equals to half of it size
        // Since the translate value is only a distance from the image center, we are able to calculate
        // the originX and the originY - start coordinates of cropping view.
        const originX = imageCenterX - apothem - (translateX.get() / imageContainerSize / scale.get()) * smallerSize;
        const originY = imageCenterY - apothem - (translateY.get() / imageContainerSize / scale.get()) * smallerSize;
        const crop = {
            height: size,
            width: size,
            originX,
            originY,
        };
        // Svg images are converted to a png blob to preserve transparency, so we need to update the
        // image name and type accordingly.
        const isSvg = imageType.includes('image/svg');
        const name = isSvg ? 'fileName.png' : imageName;
        const type = isSvg ? 'image/png' : imageType;
        (0, cropOrRotateImage_1.default)(imageUri, [{ rotate: rotation.get() % 360 }, { crop }], { compress: 1, name, type })
            .then((newImage) => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                onClose?.();
            });
            onSave?.(newImage);
        })
            .catch(() => {
            isLoading.set(false);
        });
    }, [isLoading, originalImageHeight, originalImageWidth, scale, translateX, imageContainerSize, translateY, imageType, imageName, imageUri, rotation, onClose, onSave]);
    const sliderOnPress = (locationX) => {
        // We are using the worklet directive here and running on the UI thread to ensure the Reanimated
        // shared values are updated synchronously, as they update asynchronously on the JS thread.
        'worklet';
        if (!locationX || !isPressableEnabled.get()) {
            return;
        }
        const newSliderValue = clamp(locationX, [0, sliderContainerSize]);
        const newScale = newScaleValue(newSliderValue, sliderContainerSize);
        translateSlider.set(newSliderValue);
        const differential = newScale / scale.get();
        scale.set(newScale);
        const newX = translateX.get() * differential;
        const newY = translateY.get() * differential;
        updateImageOffset(newX, newY);
    };
    return (<Modal_1.default onClose={() => onClose?.()} isVisible={isVisible} type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} onModalHide={resetState} shouldUseCustomBackdrop shouldHandleNavigationBack enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default style={[styles.pb0]} includePaddingTop={false} includeSafeAreaPaddingBottom shouldEnableKeyboardAvoidingView={false} testID={AvatarCropModal.displayName}>
                {shouldUseNarrowLayout && <HeaderGap_1.default />}
                <HeaderWithBackButton_1.default title={translate('avatarCropModal.title')} onBackButtonPress={onClose}/>
                <Text_1.default style={[styles.mh5]}>{translate('avatarCropModal.description')}</Text_1.default>
                <react_native_gesture_handler_1.GestureHandlerRootView onLayout={initializeImageContainer} style={[styles.alignSelfStretch, styles.m5, styles.flex1, styles.alignItemsCenter]}>
                    {/* To avoid layout shift we should hide this component until the image container & image is initialized */}
                    {!isImageInitialized || !isImageContainerInitialized ? (<react_native_1.ActivityIndicator color={theme.spinner} style={[styles.flex1]} size="large"/>) : (<>
                            <ImageCropView_1.default imageUri={imageUri} containerSize={imageContainerSize} panGesture={panGesture} originalImageHeight={originalImageHeight} originalImageWidth={originalImageWidth} scale={scale} translateY={translateY} translateX={translateX} rotation={rotation} maskImage={maskImage}/>
                            <react_native_1.View style={[styles.mt5, styles.justifyContentBetween, styles.alignItemsCenter, styles.flexRow, StyleUtils.getWidthStyle(imageContainerSize)]}>
                                <Icon_1.default src={Expensicons.Zoom} fill={theme.icon}/>

                                <PressableWithoutFeedback_1.default style={[styles.mh5, styles.flex1]} onLayout={initializeSliderContainer} onPressIn={(e) => (0, react_native_reanimated_1.runOnUI)(sliderOnPress)(e.nativeEvent.locationX)} accessibilityLabel="slider" role={CONST_1.default.ROLE.SLIDER}>
                                    <Slider_1.default sliderValue={translateSlider} gestureCallbacks={sliderPanGestureCallbacks}/>
                                </PressableWithoutFeedback_1.default>
                                <Tooltip_1.default text={translate('common.rotate')} shiftVertical={-2}>
                                    <react_native_1.View>
                                        <Button_1.default icon={Expensicons.Rotate} iconFill={theme.icon} onPress={rotateImage}/>
                                    </react_native_1.View>
                                </Tooltip_1.default>
                            </react_native_1.View>
                        </>)}
                </react_native_gesture_handler_1.GestureHandlerRootView>
                <Button_1.default success style={[styles.m5]} onPress={cropAndSaveImage} pressOnEnter large text={translate('common.save')}/>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
AvatarCropModal.displayName = 'AvatarCropModal';
exports.default = AvatarCropModal;
