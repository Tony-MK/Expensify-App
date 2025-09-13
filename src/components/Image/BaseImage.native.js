"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_1 = require("expo-image");
const react_1 = require("react");
function BaseImage({ onLoad, ...props }) {
    const isLoadedRef = (0, react_1.useRef)(false);
    const imageLoadedSuccessfully = (0, react_1.useCallback)((event) => {
        if (!onLoad) {
            return;
        }
        if (isLoadedRef.current === true) {
            return;
        }
        // We override `onLoad`, so both web and native have the same signature
        const { width, height } = event.source;
        isLoadedRef.current = true;
        onLoad({ nativeEvent: { width, height } });
    }, [onLoad]);
    return (<expo_image_1.Image 
    // Only subscribe to onLoad when a handler is provided to avoid unnecessary event registrations, optimizing performance.
    onLoad={onLoad ? imageLoadedSuccessfully : undefined} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
BaseImage.displayName = 'BaseImage';
exports.default = BaseImage;
