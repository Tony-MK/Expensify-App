"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AUTOSCROLL_TO_TOP_THRESHOLD = 128;
function BaseInvertedFlatListE2e(props, ref) {
    const { shouldEnableAutoScrollToTopThreshold, ...rest } = props;
    const handleViewableItemsChanged = (0, react_1.useMemo)(() => ({ viewableItems }) => {
        react_native_1.DeviceEventEmitter.emit('onViewableItemsChanged', viewableItems);
    }, []);
    const maintainVisibleContentPosition = (0, react_1.useMemo)(() => {
        const config = {
            // This needs to be 1 to avoid using loading views as anchors.
            minIndexForVisible: rest.data?.length ? Math.min(1, rest.data.length - 1) : 0,
        };
        if (shouldEnableAutoScrollToTopThreshold) {
            config.autoscrollToTopThreshold = AUTOSCROLL_TO_TOP_THRESHOLD;
        }
        return config;
    }, [shouldEnableAutoScrollToTopThreshold, rest.data?.length]);
    return (<react_native_1.FlatList 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} ref={ref} maintainVisibleContentPosition={maintainVisibleContentPosition} inverted onViewableItemsChanged={handleViewableItemsChanged}/>);
}
BaseInvertedFlatListE2e.displayName = 'BaseInvertedFlatListE2e';
exports.default = (0, react_1.forwardRef)(BaseInvertedFlatListE2e);
