"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const CarouselActions_1 = require("@components/Attachments/AttachmentCarousel/CarouselActions");
const CarouselButtons_1 = require("@components/Attachments/AttachmentCarousel/CarouselButtons");
const CarouselItem_1 = require("@components/Attachments/AttachmentCarousel/CarouselItem");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const useCarouselContextEvents_1 = require("@components/Attachments/AttachmentCarousel/useCarouselContextEvents");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const FullScreenContext_1 = require("@components/VideoPlayerContexts/FullScreenContext");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const viewabilityConfig = {
    // To facilitate paging through the attachments, we want to consider an item "viewable" when it is
    // more than 95% visible. When that happens we update the page index in the state.
    itemVisiblePercentThreshold: 95,
};
const MIN_FLING_VELOCITY = 500;
function DeviceAwareGestureDetector({ canUseTouchScreen, gesture, children }) {
    // Don't render GestureDetector on non-touchable devices to prevent unexpected pointer event capture.
    // This issue is left out on touchable devices since finger touch works fine.
    // See: https://github.com/Expensify/App/issues/51246
    return canUseTouchScreen ? <react_native_gesture_handler_1.GestureDetector gesture={gesture}>{children}</react_native_gesture_handler_1.GestureDetector> : children;
}
function AttachmentCarouselView({ page, attachments, shouldShowArrows, source, report, autoHideArrows, cancelAutoHideArrow, setShouldShowArrows, onAttachmentError, onAttachmentLoaded, onNavigate, onClose, setPage, attachmentID, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    const { isFullScreenRef } = (0, FullScreenContext_1.useFullScreenContext)();
    const isPagerScrolling = (0, react_native_reanimated_1.useSharedValue)(false);
    const { handleTap, handleScaleChange, isScrollEnabled } = (0, useCarouselContextEvents_1.default)(setShouldShowArrows);
    const [activeAttachmentID, setActiveAttachmentID] = (0, react_1.useState)(attachmentID ?? source);
    const pagerRef = (0, react_1.useRef)(null);
    const scrollRef = (0, react_native_reanimated_1.useAnimatedRef)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const modalStyles = styles.centeredModalStyles(shouldUseNarrowLayout, true);
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const cellWidth = (0, react_1.useMemo)(() => react_native_1.PixelRatio.roundToNearestPixel(windowWidth - (modalStyles.marginHorizontal + modalStyles.borderWidth) * 2), [modalStyles.borderWidth, modalStyles.marginHorizontal, windowWidth]);
    /** Updates the page state when the user navigates between attachments */
    const updatePage = (0, react_1.useCallback)(({ viewableItems }) => {
        if (isFullScreenRef.current) {
            return;
        }
        react_native_1.Keyboard.dismiss();
        // Since we can have only one item in view at a time, we can use the first item in the array
        // to get the index of the current page
        const entry = viewableItems.at(0);
        if (!entry) {
            setActiveAttachmentID(null);
            return;
        }
        const item = entry.item;
        if (entry.index !== null) {
            setPage(entry.index);
            setActiveAttachmentID(item.attachmentID ?? item.source);
        }
        if (onNavigate) {
            onNavigate(item);
        }
    }, [isFullScreenRef, onNavigate, setPage, setActiveAttachmentID]);
    /** Increments or decrements the index to get another selected item */
    const cycleThroughAttachments = (0, react_1.useCallback)((deltaSlide) => {
        if (isFullScreenRef.current) {
            return;
        }
        const nextIndex = page + deltaSlide;
        const nextItem = attachments.at(nextIndex);
        if (!nextItem || nextIndex < 0 || !scrollRef.current) {
            return;
        }
        scrollRef.current.scrollToIndex({ index: nextIndex, animated: canUseTouchScreen });
    }, [attachments, canUseTouchScreen, isFullScreenRef, page, scrollRef]);
    const extractItemKey = (0, react_1.useCallback)((item) => !!item.attachmentID || (typeof item.source !== 'string' && typeof item.source !== 'number')
        ? `attachmentID-${item.attachmentID}`
        : `source-${item.source}|${item.attachmentLink}`, []);
    /** Calculate items layout information to optimize scrolling performance */
    const getItemLayout = (0, react_1.useCallback)((data, index) => ({
        length: cellWidth,
        offset: cellWidth * index,
        index,
    }), [cellWidth]);
    const context = (0, react_1.useMemo)(() => ({
        pagerItems: [{ source, index: 0, isActive: true }],
        activePage: 0,
        pagerRef,
        isPagerScrolling,
        isScrollEnabled,
        onTap: handleTap,
        onScaleChanged: handleScaleChange,
        onSwipeDown: onClose,
        onAttachmentError,
        onAttachmentLoaded,
    }), [onAttachmentError, onAttachmentLoaded, source, isPagerScrolling, isScrollEnabled, handleTap, handleScaleChange, onClose]);
    /** Defines how a single attachment should be rendered */
    const renderItem = (0, react_1.useCallback)(({ item }) => (<react_native_1.View style={[styles.h100, { width: cellWidth }]}>
                <CarouselItem_1.default item={item} isFocused={activeAttachmentID === (item.attachmentID ?? item.source)} onPress={canUseTouchScreen ? handleTap : undefined} isModalHovered={shouldShowArrows} reportID={report?.reportID}/>
            </react_native_1.View>), [activeAttachmentID, canUseTouchScreen, cellWidth, handleTap, report?.reportID, shouldShowArrows, styles.h100]);
    /** Pan gesture handing swiping through attachments on touch screen devices */
    const pan = (0, react_1.useMemo)(() => react_native_gesture_handler_1.Gesture.Pan()
        .enabled(canUseTouchScreen)
        .onUpdate(({ translationX }) => {
        if (!isScrollEnabled.get()) {
            return;
        }
        if (translationX !== 0) {
            isPagerScrolling.set(true);
        }
        (0, react_native_reanimated_1.scrollTo)(scrollRef, page * cellWidth - translationX, 0, false);
    })
        .onEnd(({ translationX, velocityX }) => {
        if (!isScrollEnabled.get()) {
            return;
        }
        let newIndex;
        if (velocityX > MIN_FLING_VELOCITY) {
            // User flung to the right
            newIndex = Math.max(0, page - 1);
        }
        else if (velocityX < -MIN_FLING_VELOCITY) {
            // User flung to the left
            newIndex = Math.min(attachments.length - 1, page + 1);
        }
        else {
            // snap scroll position to the nearest cell (making sure it's within the bounds of the list)
            const delta = Math.round(-translationX / cellWidth);
            newIndex = Math.min(attachments.length - 1, Math.max(0, page + delta));
        }
        isPagerScrolling.set(false);
        (0, react_native_reanimated_1.scrollTo)(scrollRef, newIndex * cellWidth, 0, true);
    })
        // eslint-disable-next-line react-compiler/react-compiler
        .withRef(pagerRef), [attachments.length, canUseTouchScreen, cellWidth, page, isScrollEnabled, scrollRef, isPagerScrolling]);
    // Scroll position is affected when window width is resized, so we readjust it on width changes
    (0, react_1.useEffect)(() => {
        if (attachments.length === 0 || scrollRef.current == null) {
            return;
        }
        scrollRef.current.scrollToIndex({ index: page, animated: false });
        // The hook is not supposed to run on page change, so we keep the page out of the dependencies
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [cellWidth]);
    return (<react_native_1.View style={[styles.flex1, styles.attachmentCarouselContainer]} onMouseEnter={() => !canUseTouchScreen && setShouldShowArrows(true)} onMouseLeave={() => !canUseTouchScreen && setShouldShowArrows(false)}>
            {page === -1 ? (<BlockingView_1.default icon={Illustrations.ToddBehindCloud} iconWidth={variables_1.default.modalTopIconWidth} iconHeight={variables_1.default.modalTopIconHeight} title={translate('notFound.notHere')}/>) : (<>
                    <CarouselButtons_1.default page={page} attachments={attachments} shouldShowArrows={shouldShowArrows} onBack={() => cycleThroughAttachments(-1)} onForward={() => cycleThroughAttachments(1)} autoHideArrow={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrow}/>
                    <AttachmentCarouselPagerContext_1.default.Provider value={context}>
                        <DeviceAwareGestureDetector canUseTouchScreen={canUseTouchScreen} gesture={pan}>
                            <react_native_reanimated_1.default.FlatList keyboardShouldPersistTaps="handled" horizontal showsHorizontalScrollIndicator={false} 
        // scrolling is controlled by the pan gesture
        scrollEnabled={false} ref={scrollRef} initialScrollIndex={page} initialNumToRender={3} windowSize={5} maxToRenderPerBatch={CONST_1.default.MAX_TO_RENDER_PER_BATCH.CAROUSEL} data={attachments} renderItem={renderItem} getItemLayout={getItemLayout} keyExtractor={extractItemKey} viewabilityConfig={viewabilityConfig} onViewableItemsChanged={updatePage}/>
                        </DeviceAwareGestureDetector>
                    </AttachmentCarouselPagerContext_1.default.Provider>
                    <CarouselActions_1.default onCycleThroughAttachments={cycleThroughAttachments}/>
                </>)}
        </react_native_1.View>);
}
AttachmentCarouselView.displayName = 'AttachmentCarouselView';
exports.default = AttachmentCarouselView;
