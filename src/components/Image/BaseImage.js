"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
function BaseImage({ onLoad, source, ...props }) {
    const imageLoadedSuccessfully = (0, react_1.useCallback)((event) => {
        if (!onLoad) {
            return;
        }
        // We override `onLoad`, so both web and native have the same signature
        const { width, height } = event.nativeEvent.source;
        onLoad({ nativeEvent: { width, height } });
    }, [onLoad]);
    return (<react_native_1.Image 
    // Only subscribe to onLoad when a handler is provided to avoid unnecessary event registrations, optimizing performance.
    onLoad={onLoad ? imageLoadedSuccessfully : undefined} source={source} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
BaseImage.displayName = 'BaseImage';
exports.default = BaseImage;
