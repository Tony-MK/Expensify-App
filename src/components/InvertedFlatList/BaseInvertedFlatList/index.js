"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTOSCROLL_TO_TOP_THRESHOLD = void 0;
const react_1 = require("react");
const FlatList_1 = require("@components/FlatList");
const usePrevious_1 = require("@hooks/usePrevious");
const getInitialPaginationSize_1 = require("./getInitialPaginationSize");
const RenderTaskQueue_1 = require("./RenderTaskQueue");
// Adapted from https://github.com/facebook/react-native/blob/29a0d7c3b201318a873db0d1b62923f4ce720049/packages/virtualized-lists/Lists/VirtualizeUtils.js#L237
function defaultKeyExtractor(item, index) {
    if (item != null) {
        if (typeof item === 'object' && 'key' in item) {
            return item.key;
        }
        if (typeof item === 'object' && 'id' in item) {
            return item.id;
        }
    }
    return String(index);
}
const AUTOSCROLL_TO_TOP_THRESHOLD = 250;
exports.AUTOSCROLL_TO_TOP_THRESHOLD = AUTOSCROLL_TO_TOP_THRESHOLD;
function BaseInvertedFlatList(props, ref) {
    const { shouldEnableAutoScrollToTopThreshold, initialScrollKey, data, onStartReached, renderItem, keyExtractor = defaultKeyExtractor, ...rest } = props;
    // `initialScrollIndex` doesn't work properly with FlatList, this uses an alternative approach to achieve the same effect.
    // What we do is start rendering the list from `initialScrollKey` and then whenever we reach the start we render more
    // previous items, until everything is rendered. We also progressively render new data that is added at the start of the
    // list to make sure `maintainVisibleContentPosition` works as expected.
    const [currentDataId, setCurrentDataId] = (0, react_1.useState)(() => {
        if (initialScrollKey) {
            return initialScrollKey;
        }
        return null;
    });
    const [isInitialData, setIsInitialData] = (0, react_1.useState)(true);
    const currentDataIndex = (0, react_1.useMemo)(() => (currentDataId === null ? 0 : data.findIndex((item, index) => keyExtractor(item, index) === currentDataId)), [currentDataId, data, keyExtractor]);
    const displayedData = (0, react_1.useMemo)(() => {
        if (currentDataIndex <= 0) {
            return data;
        }
        return data.slice(Math.max(0, currentDataIndex - (isInitialData ? 0 : getInitialPaginationSize_1.default)));
    }, [currentDataIndex, data, isInitialData]);
    const isLoadingData = data.length > displayedData.length;
    const wasLoadingData = (0, usePrevious_1.default)(isLoadingData);
    const dataIndexDifference = data.length - displayedData.length;
    // Queue up updates to the displayed data to avoid adding too many at once and cause jumps in the list.
    const renderQueue = (0, react_1.useMemo)(() => new RenderTaskQueue_1.default(), []);
    (0, react_1.useEffect)(() => {
        return () => {
            renderQueue.cancel();
        };
    }, [renderQueue]);
    renderQueue.setHandler((info) => {
        if (!isLoadingData) {
            onStartReached?.(info);
        }
        setIsInitialData(false);
        const firstDisplayedItem = displayedData.at(0);
        setCurrentDataId(firstDisplayedItem ? keyExtractor(firstDisplayedItem, currentDataIndex) : '');
    });
    const handleStartReached = (0, react_1.useCallback)((info) => {
        renderQueue.add(info);
    }, [renderQueue]);
    const handleRenderItem = (0, react_1.useCallback)(({ item, index, separators }) => {
        // Adjust the index passed here so it matches the original data.
        return renderItem({ item, index: index + dataIndexDifference, separators });
    }, [renderItem, dataIndexDifference]);
    const maintainVisibleContentPosition = (0, react_1.useMemo)(() => {
        const config = {
            // This needs to be 1 to avoid using loading views as anchors.
            minIndexForVisible: data.length ? Math.min(1, data.length - 1) : 0,
        };
        if (shouldEnableAutoScrollToTopThreshold && !isLoadingData && !wasLoadingData) {
            config.autoscrollToTopThreshold = AUTOSCROLL_TO_TOP_THRESHOLD;
        }
        return config;
    }, [data.length, shouldEnableAutoScrollToTopThreshold, isLoadingData, wasLoadingData]);
    const listRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => {
        // If we're trying to scroll at the start of the list we need to make sure to
        // render all items.
        const scrollToOffsetFn = (params) => {
            if (params.offset === 0) {
                setCurrentDataId(null);
            }
            requestAnimationFrame(() => {
                listRef.current?.scrollToOffset(params);
            });
        };
        return new Proxy({}, {
            get: (_target, prop) => {
                if (prop === 'scrollToOffset') {
                    return scrollToOffsetFn;
                }
                return listRef.current?.[prop];
            },
        });
    });
    return (<FlatList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} ref={listRef} maintainVisibleContentPosition={maintainVisibleContentPosition} inverted data={displayedData} onStartReached={handleStartReached} renderItem={handleRenderItem} keyExtractor={keyExtractor}/>);
}
BaseInvertedFlatList.displayName = 'BaseInvertedFlatList';
exports.default = (0, react_1.forwardRef)(BaseInvertedFlatList);
