"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Browser_1 = require("@libs/Browser");
// Changing the scroll position during a momentum scroll does not work on mobile Safari.
// We do a best effort to avoid content jumping by using some hacks on mobile Safari only.
const IS_MOBILE_SAFARI = (0, Browser_1.isMobileSafari)();
function mergeRefs(...args) {
    return function forwardRef(node) {
        args.forEach((ref) => {
            if (ref == null) {
                return;
            }
            if (typeof ref === 'function') {
                ref(node);
                return;
            }
            if (typeof ref === 'object') {
                // eslint-disable-next-line no-param-reassign
                ref.current = node;
                return;
            }
            console.error(`mergeRefs cannot handle Refs of type boolean, number or string, received ref ${String(ref)}`);
        });
    };
}
function useMergeRefs(...args) {
    return (0, react_1.useMemo)(() => mergeRefs(...args), 
    // eslint-disable-next-line
    [...args]);
}
function getScrollableNode(flatList) {
    return flatList?.getScrollableNode();
}
function MVCPFlatList({ maintainVisibleContentPosition, horizontal = false, onScroll, ...props }, ref) {
    const { minIndexForVisible: mvcpMinIndexForVisible, autoscrollToTopThreshold: mvcpAutoscrollToTopThreshold } = maintainVisibleContentPosition ?? {};
    const scrollRef = (0, react_1.useRef)(null);
    const prevFirstVisibleOffsetRef = (0, react_1.useRef)(0);
    const firstVisibleViewRef = (0, react_1.useRef)(null);
    const mutationObserverRef = (0, react_1.useRef)(null);
    const lastScrollOffsetRef = (0, react_1.useRef)(0);
    const isListRenderedRef = (0, react_1.useRef)(false);
    const mvcpAutoscrollToTopThresholdRef = (0, react_1.useRef)(mvcpAutoscrollToTopThreshold);
    // eslint-disable-next-line react-compiler/react-compiler
    mvcpAutoscrollToTopThresholdRef.current = mvcpAutoscrollToTopThreshold;
    const getScrollOffset = (0, react_1.useCallback)(() => {
        if (!scrollRef.current) {
            return 0;
        }
        return horizontal ? (getScrollableNode(scrollRef.current)?.scrollLeft ?? 0) : (getScrollableNode(scrollRef.current)?.scrollTop ?? 0);
    }, [horizontal]);
    const getContentView = (0, react_1.useCallback)(() => getScrollableNode(scrollRef.current)?.childNodes[0], []);
    const scrollToOffset = (0, react_1.useCallback)((offset, animated, interrupt) => {
        const behavior = animated ? 'smooth' : 'instant';
        const node = getScrollableNode(scrollRef.current);
        if (node == null) {
            return;
        }
        const overflowProp = horizontal ? 'overflowX' : 'overflowY';
        // Stop momentum scrolling on mobile Safari otherwise the scroll position update
        // will not work.
        if (IS_MOBILE_SAFARI && interrupt) {
            node.style[overflowProp] = 'hidden';
        }
        node.scroll(horizontal ? { left: offset, behavior } : { top: offset, behavior });
        if (IS_MOBILE_SAFARI && interrupt) {
            node.style[overflowProp] = 'scroll';
        }
    }, [horizontal]);
    const prepareForMaintainVisibleContentPosition = (0, react_1.useCallback)(() => {
        if (mvcpMinIndexForVisible == null) {
            return;
        }
        const contentView = getContentView();
        if (contentView == null) {
            return;
        }
        const scrollOffset = getScrollOffset();
        lastScrollOffsetRef.current = scrollOffset;
        const contentViewLength = contentView.childNodes.length;
        for (let i = mvcpMinIndexForVisible; i < contentViewLength; i++) {
            const subview = contentView.childNodes[i];
            const subviewOffset = horizontal ? subview.offsetLeft : subview.offsetTop;
            if (subviewOffset > scrollOffset) {
                prevFirstVisibleOffsetRef.current = subviewOffset;
                firstVisibleViewRef.current = subview;
                break;
            }
        }
    }, [getContentView, getScrollOffset, mvcpMinIndexForVisible, horizontal]);
    const adjustForMaintainVisibleContentPosition = (0, react_1.useCallback)((animated = true) => {
        if (mvcpMinIndexForVisible == null) {
            return;
        }
        const firstVisibleView = firstVisibleViewRef.current;
        const prevFirstVisibleOffset = prevFirstVisibleOffsetRef.current;
        if (firstVisibleView == null || !firstVisibleView.isConnected || prevFirstVisibleOffset == null) {
            return;
        }
        const firstVisibleViewOffset = horizontal ? firstVisibleView.offsetLeft : firstVisibleView.offsetTop;
        const delta = firstVisibleViewOffset - prevFirstVisibleOffset;
        if (Math.abs(delta) > (IS_MOBILE_SAFARI ? 100 : 0.5)) {
            const scrollOffset = lastScrollOffsetRef.current;
            prevFirstVisibleOffsetRef.current = firstVisibleViewOffset;
            scrollToOffset(scrollOffset + delta, false, true);
            if (mvcpAutoscrollToTopThresholdRef.current != null && scrollOffset <= mvcpAutoscrollToTopThresholdRef.current) {
                scrollToOffset(0, animated, false);
            }
        }
    }, [scrollToOffset, mvcpMinIndexForVisible, horizontal]);
    const setupMutationObserver = (0, react_1.useCallback)(() => {
        const contentView = getContentView();
        if (contentView == null) {
            return;
        }
        mutationObserverRef.current?.disconnect();
        const mutationObserver = new MutationObserver((mutations) => {
            let isEditComposerAdded = false;
            // Check if the first visible view is removed and re-calculate it
            // if needed.
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node !== firstVisibleViewRef.current) {
                        return;
                    }
                    firstVisibleViewRef.current = null;
                });
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE || !node.querySelector('#composer')) {
                        return;
                    }
                    isEditComposerAdded = true;
                });
            });
            if (firstVisibleViewRef.current == null) {
                prepareForMaintainVisibleContentPosition();
            }
            // When the list is hidden, the size will be 0.
            // Ignore the callback if the list is hidden because scrollOffset will always be 0.
            if (!getScrollableNode(scrollRef.current)?.clientHeight) {
                return;
            }
            adjustForMaintainVisibleContentPosition(!isEditComposerAdded);
            prepareForMaintainVisibleContentPosition();
        });
        mutationObserver.observe(contentView, {
            attributes: true,
            childList: true,
            subtree: true,
        });
        mutationObserverRef.current = mutationObserver;
    }, [adjustForMaintainVisibleContentPosition, prepareForMaintainVisibleContentPosition, getContentView]);
    (0, react_1.useEffect)(() => {
        if (!isListRenderedRef.current) {
            return;
        }
        const animationFrame = requestAnimationFrame(() => {
            prepareForMaintainVisibleContentPosition();
            setupMutationObserver();
        });
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [prepareForMaintainVisibleContentPosition, setupMutationObserver]);
    const setMergedRef = useMergeRefs(scrollRef, ref);
    const onRef = (0, react_1.useCallback)((newRef) => {
        // Make sure to only call refs and re-attach listeners if the node changed.
        if (newRef == null || newRef === scrollRef.current) {
            return;
        }
        setMergedRef(newRef);
        prepareForMaintainVisibleContentPosition();
        setupMutationObserver();
    }, [prepareForMaintainVisibleContentPosition, setMergedRef, setupMutationObserver]);
    (0, react_1.useEffect)(() => {
        const mutationObserver = mutationObserverRef.current;
        return () => {
            mutationObserver?.disconnect();
            mutationObserverRef.current = null;
        };
    }, []);
    const onScrollInternal = (0, react_1.useCallback)((event) => {
        prepareForMaintainVisibleContentPosition();
        onScroll?.(event);
    }, [prepareForMaintainVisibleContentPosition, onScroll]);
    return (<react_native_1.FlatList 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} maintainVisibleContentPosition={maintainVisibleContentPosition} horizontal={horizontal} onScroll={onScrollInternal} scrollEventThrottle={1} ref={onRef} onLayout={(e) => {
            isListRenderedRef.current = true;
            if (!mutationObserverRef.current) {
                prepareForMaintainVisibleContentPosition();
                setupMutationObserver();
            }
            props.onLayout?.(e);
        }}/>);
}
MVCPFlatList.displayName = 'MVCPFlatList';
exports.default = react_1.default.forwardRef(MVCPFlatList);
