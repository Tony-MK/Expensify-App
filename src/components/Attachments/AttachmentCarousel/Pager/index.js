"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_pager_view_1 = require("react-native-pager-view");
const react_native_reanimated_1 = require("react-native-reanimated");
const CarouselItem_1 = require("@components/Attachments/AttachmentCarousel/CarouselItem");
const useCarouselContextEvents_1 = require("@components/Attachments/AttachmentCarousel/useCarouselContextEvents");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const shouldUseNewPager_1 = require("@libs/shouldUseNewPager");
const AttachmentCarouselPagerContext_1 = require("./AttachmentCarouselPagerContext");
const usePageScrollHandler_1 = require("./usePageScrollHandler");
const AnimatedPagerView = react_native_reanimated_1.default.createAnimatedComponent(react_native_pager_view_1.default);
function AttachmentCarouselPager({ items, activeAttachmentID, initialPage, setShouldShowArrows, onPageSelected, onClose, reportID, onAttachmentError, onAttachmentLoaded }, ref) {
    const { handleTap, handleScaleChange, isScrollEnabled } = (0, useCarouselContextEvents_1.default)(setShouldShowArrows);
    const styles = (0, useThemeStyles_1.default)();
    const pagerRef = (0, react_1.useRef)(null);
    const isPagerScrolling = (0, react_native_reanimated_1.useSharedValue)(false);
    const activePage = (0, react_native_reanimated_1.useSharedValue)(initialPage);
    const [activePageIndex, setActivePageIndex] = (0, react_1.useState)(initialPage);
    const pageScrollHandler = (0, usePageScrollHandler_1.default)((e) => {
        'worklet';
        activePage.set(e.position);
        isPagerScrolling.set(e.offset !== 0);
    }, []);
    (0, react_1.useEffect)(() => {
        setActivePageIndex(initialPage);
        activePage.set(initialPage);
    }, [activePage, initialPage]);
    /** The `pagerItems` object that passed down to the context. Later used to detect current page, whether it's a single image gallery etc. */
    const pagerItems = (0, react_1.useMemo)(() => items.map((item, index) => ({ source: item.source, previewSource: item.previewSource, index, isActive: index === activePageIndex })), [activePageIndex, items]);
    const extractItemKey = (0, react_1.useCallback)((item, index) => `attachmentID-${item.attachmentID}-${index}`, []);
    const nativeGestureHandler = react_native_gesture_handler_1.Gesture.Native();
    const contextValue = (0, react_1.useMemo)(() => ({
        pagerItems,
        activePage: activePageIndex,
        isPagerScrolling,
        isScrollEnabled,
        pagerRef,
        onTap: handleTap,
        onSwipeDown: onClose,
        onScaleChanged: handleScaleChange,
        onAttachmentError,
        onAttachmentLoaded,
        externalGestureHandler: nativeGestureHandler,
    }), [pagerItems, activePageIndex, isPagerScrolling, isScrollEnabled, handleTap, onClose, handleScaleChange, nativeGestureHandler, onAttachmentError, onAttachmentLoaded]);
    const animatedProps = (0, react_native_reanimated_1.useAnimatedProps)(() => ({
        scrollEnabled: isScrollEnabled.get(),
    }));
    /**
     * This "useImperativeHandle" call is needed to expose certain imperative methods via the pager's ref.
     * setPage: can be used to programmatically change the page from a parent component
     */
    (0, react_1.useImperativeHandle)(ref, () => ({
        setPage: (selectedPage) => {
            pagerRef.current?.setPage(selectedPage);
        },
    }), []);
    const carouselItems = items.map((item, index) => (<react_native_1.View key={extractItemKey(item, index)} style={styles.flex1}>
            <CarouselItem_1.default item={item} isFocused={index === activePageIndex && activeAttachmentID === (item.attachmentID ?? item.source)} reportID={reportID}/>
        </react_native_1.View>));
    return (<AttachmentCarouselPagerContext_1.default.Provider value={contextValue}>
            <react_native_gesture_handler_1.GestureDetector gesture={nativeGestureHandler}>
                <AnimatedPagerView pageMargin={40} offscreenPageLimit={1} onPageScroll={pageScrollHandler} onPageSelected={onPageSelected} style={styles.flex1} initialPage={initialPage} useNext={(0, shouldUseNewPager_1.default)()} animatedProps={animatedProps} ref={pagerRef}>
                    {carouselItems}
                </AnimatedPagerView>
            </react_native_gesture_handler_1.GestureDetector>
        </AttachmentCarouselPagerContext_1.default.Provider>);
}
AttachmentCarouselPager.displayName = 'AttachmentCarouselPager';
exports.default = react_1.default.forwardRef(AttachmentCarouselPager);
