"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentOfflineIndicator_1 = require("@components/AttachmentOfflineIndicator");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const Image_1 = require("@components/Image");
const resizeModes_1 = require("@components/Image/resizeModes");
const Lightbox_1 = require("@components/Lightbox");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
const viewRef_1 = require("@src/types/utils/viewRef");
function ImageView({ isAuthTokenRequired = false, url, fileName, onError }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(0);
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(0);
    const [isZoomed, setIsZoomed] = (0, react_1.useState)(false);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [isMouseDown, setIsMouseDown] = (0, react_1.useState)(false);
    const [initialScrollLeft, setInitialScrollLeft] = (0, react_1.useState)(0);
    const [initialScrollTop, setInitialScrollTop] = (0, react_1.useState)(0);
    const [initialX, setInitialX] = (0, react_1.useState)(0);
    const [initialY, setInitialY] = (0, react_1.useState)(0);
    const [imgWidth, setImgWidth] = (0, react_1.useState)(0);
    const [imgHeight, setImgHeight] = (0, react_1.useState)(0);
    const [zoomScale, setZoomScale] = (0, react_1.useState)(0);
    const [zoomDelta, setZoomDelta] = (0, react_1.useState)();
    const { isOffline } = (0, useNetwork_1.default)();
    const scrollableRef = (0, react_1.useRef)(null);
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    const setScale = (newContainerWidth, newContainerHeight, newImageWidth, newImageHeight) => {
        if (!newContainerWidth || !newImageWidth || !newContainerHeight || !newImageHeight) {
            return;
        }
        const newZoomScale = Math.min(newContainerWidth / newImageWidth, newContainerHeight / newImageHeight);
        setZoomScale(newZoomScale);
    };
    const onContainerLayoutChanged = (e) => {
        const { width, height } = e.nativeEvent.layout;
        setScale(width, height, imgWidth, imgHeight);
        setContainerHeight(height);
        setContainerWidth(width);
    };
    /**
     * When open image, set image width, height.
     */
    const setImageRegion = (imageWidth, imageHeight) => {
        if (imageHeight <= 0) {
            return;
        }
        setScale(containerWidth, containerHeight, imageWidth, imageHeight);
        setImgWidth(imageWidth);
        setImgHeight(imageHeight);
    };
    const imageLoadingStart = () => {
        if (!isLoading) {
            return;
        }
        setIsLoading(true);
        setZoomScale(0);
        setIsZoomed(false);
    };
    const attachmentCarouselPagerContext = (0, react_1.useContext)(AttachmentCarouselPagerContext_1.default);
    const { onAttachmentLoaded } = attachmentCarouselPagerContext ?? {};
    const imageLoad = ({ nativeEvent }) => {
        setImageRegion(nativeEvent.width, nativeEvent.height);
        setIsLoading(false);
        onAttachmentLoaded?.(url, true);
    };
    const onContainerPressIn = (e) => {
        const { pageX, pageY } = e.nativeEvent;
        setIsMouseDown(true);
        setInitialX(pageX);
        setInitialY(pageY);
        setInitialScrollLeft(scrollableRef.current?.scrollLeft ?? 0);
        setInitialScrollTop(scrollableRef.current?.scrollTop ?? 0);
    };
    /**
     * Convert touch point to zoomed point
     * @param x point when click zoom
     * @param y point when click zoom
     * @returns converted touch point
     */
    const getScrollOffset = (x, y) => {
        let offsetX = 0;
        let offsetY = 0;
        // Container size bigger than clicked position offset
        if (x <= containerWidth / 2) {
            offsetX = 0;
        }
        else if (x > containerWidth / 2) {
            // Minus half of container size because we want to be center clicked position
            offsetX = x - containerWidth / 2;
        }
        if (y <= containerHeight / 2) {
            offsetY = 0;
        }
        else if (y > containerHeight / 2) {
            // Minus half of container size because we want to be center clicked position
            offsetY = y - containerHeight / 2;
        }
        return { offsetX, offsetY };
    };
    const onContainerPress = (e) => {
        if (!isZoomed && !isDragging) {
            if (e && 'nativeEvent' in e && e.nativeEvent instanceof PointerEvent) {
                const { offsetX, offsetY } = e.nativeEvent;
                // Dividing clicked positions by the zoom scale to get coordinates
                // so that once we zoom we will scroll to the clicked location.
                const delta = getScrollOffset(offsetX / zoomScale, offsetY / zoomScale);
                setZoomDelta(delta);
            }
            else {
                setZoomDelta({ offsetX: 0, offsetY: 0 });
            }
        }
        if (isZoomed && isDragging && isMouseDown) {
            setIsDragging(false);
            setIsMouseDown(false);
        }
        else {
            // We first zoom and once its done then we scroll to the location the user clicked.
            setIsZoomed(!isZoomed);
            setIsMouseDown(false);
        }
    };
    const trackPointerPosition = (0, react_1.useCallback)((event) => {
        // Whether the pointer is released inside the ImageView
        const isInsideImageView = scrollableRef.current?.contains(event.target);
        if (!isInsideImageView && isZoomed && isDragging && isMouseDown) {
            setIsDragging(false);
            setIsMouseDown(false);
        }
    }, [isDragging, isMouseDown, isZoomed]);
    const trackMovement = (0, react_1.useCallback)((event) => {
        if (!isZoomed) {
            return;
        }
        if (isDragging && isMouseDown && scrollableRef.current) {
            const x = event.x;
            const y = event.y;
            const moveX = initialX - x;
            const moveY = initialY - y;
            scrollableRef.current.scrollLeft = initialScrollLeft + moveX;
            scrollableRef.current.scrollTop = initialScrollTop + moveY;
        }
        setIsDragging(isMouseDown);
    }, [initialScrollLeft, initialScrollTop, initialX, initialY, isDragging, isMouseDown, isZoomed]);
    (0, react_1.useEffect)(() => {
        if (!isZoomed || !zoomDelta || !scrollableRef.current) {
            return;
        }
        scrollableRef.current.scrollLeft = zoomDelta.offsetX;
        scrollableRef.current.scrollTop = zoomDelta.offsetY;
    }, [zoomDelta, isZoomed]);
    (0, react_1.useEffect)(() => {
        if (canUseTouchScreen) {
            return;
        }
        document.addEventListener('mousemove', trackMovement);
        document.addEventListener('mouseup', trackPointerPosition);
        return () => {
            document.removeEventListener('mousemove', trackMovement);
            document.removeEventListener('mouseup', trackPointerPosition);
        };
    }, [canUseTouchScreen, trackMovement, trackPointerPosition]);
    // isLocalToUserDeviceFile means the file is located on the user device,
    // not loaded on the server yet (the user is offline when loading this file in fact)
    let isLocalToUserDeviceFile = (0, FileUtils_1.isLocalFile)(url);
    if (isLocalToUserDeviceFile && typeof url === 'string' && url.startsWith('/chat-attachments')) {
        isLocalToUserDeviceFile = false;
    }
    if (canUseTouchScreen) {
        return (<Lightbox_1.default uri={url} isAuthTokenRequired={isAuthTokenRequired} onError={onError} onLoad={() => onAttachmentLoaded?.(url, true)}/>);
    }
    return (<react_native_1.View 
    // eslint-disable-next-line react-compiler/react-compiler
    ref={(0, viewRef_1.default)(scrollableRef)} onLayout={onContainerLayoutChanged} style={[styles.imageViewContainer, styles.overflowAuto, styles.pRelative]}>
            <PressableWithoutFeedback_1.default style={{
            ...StyleUtils.getZoomSizingStyle(isZoomed, imgWidth, imgHeight, zoomScale, containerHeight, containerWidth, isLoading),
            ...StyleUtils.getZoomCursorStyle(isZoomed, isDragging),
            ...(isZoomed && zoomScale >= 1 ? styles.pRelative : styles.pAbsolute),
            ...styles.flex1,
        }} onPressIn={onContainerPressIn} onPress={onContainerPress} role={CONST_1.default.ROLE.IMG} accessibilityLabel={fileName}>
                <Image_1.default source={{ uri: url }} isAuthTokenRequired={isAuthTokenRequired} style={[styles.h100, styles.w100]} resizeMode={resizeModes_1.default.contain} onLoadStart={imageLoadingStart} onLoad={imageLoad} waitForSession={() => {
            setIsLoading(true);
            setZoomScale(0);
            setIsZoomed(false);
        }} onError={onError}/>
            </PressableWithoutFeedback_1.default>

            {isLoading && (!isOffline || isLocalToUserDeviceFile) && <FullscreenLoadingIndicator_1.default style={[styles.opacity1, styles.bgTransparent]}/>}
            {isLoading && !isLocalToUserDeviceFile && <AttachmentOfflineIndicator_1.default />}
        </react_native_1.View>);
}
ImageView.displayName = 'ImageView';
exports.default = ImageView;
