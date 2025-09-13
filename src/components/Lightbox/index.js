"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const AttachmentOfflineIndicator_1 = require("@components/AttachmentOfflineIndicator");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const Image_1 = require("@components/Image");
const MultiGestureCanvas_1 = require("@components/MultiGestureCanvas");
const utils_1 = require("@components/MultiGestureCanvas/utils");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const numberOfConcurrentLightboxes_1 = require("./numberOfConcurrentLightboxes");
const cachedImageDimensions = new Map();
/**
 * On the native layer, we use a image library to handle zoom functionality
 */
function Lightbox({ isAuthTokenRequired = false, uri, onScaleChanged: onScaleChangedProp, onError, style, zoomRange = MultiGestureCanvas_1.DEFAULT_ZOOM_RANGE, onLoad }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    /**
     * React hooks must be used in the render function of the component at top-level and unconditionally.
     * Therefore, in order to provide a default value for "isPagerScrolling" if the "AttachmentCarouselPagerContext" is not available,
     * we need to create a shared value that can be used in the render function.
     */
    const isPagerScrollingFallback = (0, react_native_reanimated_1.useSharedValue)(false);
    const isScrollingEnabledFallback = (0, react_native_reanimated_1.useSharedValue)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const attachmentCarouselPagerContext = (0, react_1.useContext)(AttachmentCarouselPagerContext_1.default);
    const { isUsedInCarousel, isSingleCarouselItem, isPagerScrolling, page, activePage, onTap, onScaleChanged: onScaleChangedContext, onSwipeDown, pagerRef, isScrollEnabled, externalGestureHandler, } = (0, react_1.useMemo)(() => {
        if (attachmentCarouselPagerContext === null) {
            return {
                isUsedInCarousel: false,
                isSingleCarouselItem: true,
                isPagerScrolling: isPagerScrollingFallback,
                isScrollEnabled: isScrollingEnabledFallback,
                page: 0,
                activePage: 0,
                onTap: () => { },
                onScaleChanged: () => { },
                onSwipeDown: () => { },
                pagerRef: undefined,
                externalGestureHandler: undefined,
            };
        }
        const foundPage = attachmentCarouselPagerContext.pagerItems.findIndex((item) => item.source === uri || item.previewSource === uri);
        return {
            ...attachmentCarouselPagerContext,
            isUsedInCarousel: !!attachmentCarouselPagerContext.pagerRef,
            isSingleCarouselItem: attachmentCarouselPagerContext.pagerItems.length === 1,
            page: foundPage,
        };
    }, [attachmentCarouselPagerContext, isPagerScrollingFallback, isScrollingEnabledFallback, uri]);
    /** Whether the Lightbox is used within an attachment carousel and there are more than one page in the carousel */
    const hasSiblingCarouselItems = isUsedInCarousel && !isSingleCarouselItem;
    const isActive = page === activePage;
    const [canvasSize, setCanvasSize] = (0, react_1.useState)();
    const isCanvasLoading = canvasSize === undefined;
    const updateCanvasSize = (0, react_1.useCallback)(({ nativeEvent: { layout: { width, height }, }, }) => setCanvasSize({ width: react_native_1.PixelRatio.roundToNearestPixel(width), height: react_native_1.PixelRatio.roundToNearestPixel(height) }), []);
    const [contentSize, setInternalContentSize] = (0, react_1.useState)(() => cachedImageDimensions.get(uri));
    const setContentSize = (0, react_1.useCallback)((newDimensions) => {
        setInternalContentSize(newDimensions);
        cachedImageDimensions.set(uri, newDimensions);
    }, [uri]);
    const updateContentSize = (0, react_1.useCallback)(({ nativeEvent: { width, height } }) => {
        if (contentSize !== undefined) {
            return;
        }
        setContentSize({ width, height });
    }, [contentSize, setContentSize]);
    // Enables/disables the lightbox based on the number of concurrent lightboxes
    // On higher-end devices, we can show render lightboxes at the same time,
    // while on lower-end devices we want to only render the active carousel item as a lightbox
    // to avoid performance issues.
    const isLightboxVisible = (0, react_1.useMemo)(() => {
        if (!hasSiblingCarouselItems || numberOfConcurrentLightboxes_1.default === 'UNLIMITED') {
            return true;
        }
        const indexCanvasOffset = Math.floor((numberOfConcurrentLightboxes_1.default - 1) / 2) || 0;
        const indexOutOfRange = page > activePage + indexCanvasOffset || page < activePage - indexCanvasOffset;
        return !indexOutOfRange;
    }, [activePage, hasSiblingCarouselItems, page]);
    const [isLightboxImageLoaded, setLightboxImageLoaded] = (0, react_1.useState)(false);
    const [isFallbackVisible, setFallbackVisible] = (0, react_1.useState)(!isLightboxVisible);
    const [isFallbackImageLoaded, setFallbackImageLoaded] = (0, react_1.useState)(false);
    const fallbackSize = (0, react_1.useMemo)(() => {
        if (!hasSiblingCarouselItems || !contentSize || isCanvasLoading) {
            return undefined;
        }
        const { minScale } = (0, utils_1.getCanvasFitScale)({ canvasSize, contentSize });
        return {
            width: react_native_1.PixelRatio.roundToNearestPixel(contentSize.width * minScale),
            height: react_native_1.PixelRatio.roundToNearestPixel(contentSize.height * minScale),
        };
    }, [hasSiblingCarouselItems, contentSize, isCanvasLoading, canvasSize]);
    // If the fallback image is currently visible, we want to hide the Lightbox by setting the opacity to 0,
    // until the fallback gets hidden so that we don't see two overlapping images at the same time.
    // If there the Lightbox is not used within a carousel, we don't need to hide the Lightbox,
    // because it's only going to be rendered after the fallback image is hidden.
    const shouldShowLightbox = isLightboxImageLoaded && !isFallbackVisible;
    const isFallbackStillLoading = isFallbackVisible && !isFallbackImageLoaded;
    const isLightboxStillLoading = isLightboxVisible && !isLightboxImageLoaded;
    const isLoading = isActive && (isCanvasLoading || isFallbackStillLoading || isLightboxStillLoading);
    // Resets the lightbox when it becomes inactive
    (0, react_1.useEffect)(() => {
        if (isLightboxVisible) {
            return;
        }
        setLightboxImageLoaded(false);
        setContentSize(undefined);
    }, [isLightboxVisible, setContentSize]);
    // Enables and disables the fallback image when the carousel item is active or not
    (0, react_1.useEffect)(() => {
        // When there are no other carousel items, we don't need to show the fallback image
        if (!hasSiblingCarouselItems) {
            return;
        }
        // When the carousel item is active and the lightbox has finished loading, we want to hide the fallback image
        if (isActive && isFallbackVisible && isLightboxVisible && isLightboxImageLoaded) {
            setFallbackVisible(false);
            setFallbackImageLoaded(false);
            return;
        }
        // If the carousel item has become inactive and the lightbox is not continued to be rendered, we want to show the fallback image
        if (!isActive && !isLightboxVisible) {
            setFallbackVisible(true);
        }
    }, [hasSiblingCarouselItems, isActive, isFallbackVisible, isLightboxImageLoaded, isLightboxVisible]);
    const scaleChange = (0, react_1.useCallback)((scale) => {
        onScaleChangedProp?.(scale);
        onScaleChangedContext?.(scale);
    }, [onScaleChangedContext, onScaleChangedProp]);
    const isALocalFile = (0, FileUtils_1.isLocalFile)(uri);
    return (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, style]} onLayout={updateCanvasSize}>
            {!isCanvasLoading && (<>
                    {isLightboxVisible && (<react_native_1.View style={[StyleUtils.getFullscreenCenteredContentStyles(), StyleUtils.getOpacityStyle(Number(shouldShowLightbox))]}>
                            <MultiGestureCanvas_1.default isActive={isActive} canvasSize={canvasSize} contentSize={contentSize} zoomRange={zoomRange} pagerRef={pagerRef} isUsedInCarousel={isUsedInCarousel} shouldDisableTransformationGestures={isPagerScrolling} isPagerScrollEnabled={isScrollEnabled} onTap={onTap} onScaleChanged={scaleChange} onSwipeDown={onSwipeDown} externalGestureHandler={externalGestureHandler}>
                                <Image_1.default source={{ uri }} style={[contentSize ?? styles.invisibleImage]} isAuthTokenRequired={isAuthTokenRequired} onError={onError} onLoad={(e) => {
                    updateContentSize(e);
                    setLightboxImageLoaded(true);
                    onLoad?.();
                }} waitForSession={() => {
                    // only active lightbox should call this function
                    if (!isActive || isFallbackVisible || !isLightboxVisible) {
                        return;
                    }
                    setContentSize(cachedImageDimensions.get(uri));
                    setLightboxImageLoaded(false);
                }}/>
                            </MultiGestureCanvas_1.default>
                        </react_native_1.View>)}

                    {/* Keep rendering the image without gestures as fallback if the carousel item is not active and while the lightbox is loading the image */}
                    {isFallbackVisible && (<react_native_1.View style={StyleUtils.getFullscreenCenteredContentStyles()}>
                            <Image_1.default source={{ uri }} resizeMode="contain" style={[fallbackSize ?? styles.invisibleImage]} isAuthTokenRequired={isAuthTokenRequired} onLoad={(e) => {
                    updateContentSize(e);
                    setFallbackImageLoaded(true);
                    onLoad?.();
                }}/>
                        </react_native_1.View>)}

                    {/* Show activity indicator while the lightbox is still loading the image. */}
                    {isLoading && (!isOffline || isALocalFile) && (<react_native_1.ActivityIndicator size="large" style={react_native_1.StyleSheet.absoluteFill}/>)}
                    {isLoading && !isALocalFile && <AttachmentOfflineIndicator_1.default />}
                </>)}
        </react_native_1.View>);
}
Lightbox.displayName = 'Lightbox';
exports.default = Lightbox;
