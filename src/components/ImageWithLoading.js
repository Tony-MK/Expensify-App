"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("lodash/delay");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AttachmentOfflineIndicator_1 = require("./AttachmentOfflineIndicator");
const FullscreenLoadingIndicator_1 = require("./FullscreenLoadingIndicator");
const Image_1 = require("./Image");
function ImageWithSizeCalculation({ onError, containerStyles, shouldShowOfflineIndicator = true, loadingIconSize, waitForSession, loadingIndicatorStyles, resizeMode, onLoad, ...rest }) {
    const styles = (0, useThemeStyles_1.default)();
    const isLoadedRef = (0, react_1.useRef)(null);
    const [isImageCached, setIsImageCached] = (0, react_1.useState)(true);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const handleError = () => {
        onError?.();
        if (isLoadedRef.current) {
            isLoadedRef.current = false;
            setIsImageCached(false);
        }
        if (isOffline) {
            return;
        }
        setIsLoading(false);
    };
    const imageLoadedSuccessfully = (e) => {
        isLoadedRef.current = true;
        setIsLoading(false);
        setIsImageCached(true);
        onLoad?.(e);
    };
    /** Delay the loader to detect whether the image is being loaded from the cache or the internet. */
    (0, react_1.useEffect)(() => {
        if (isLoadedRef.current ?? !isLoading) {
            return;
        }
        const timeout = (0, delay_1.default)(() => {
            if (!isLoading || isLoadedRef.current) {
                return;
            }
            setIsImageCached(false);
        }, 200);
        return () => clearTimeout(timeout);
    }, [isLoading]);
    return (<react_native_1.View style={[styles.w100, styles.h100, containerStyles]}>
            <Image_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} style={[styles.w100, styles.h100]} onLoadStart={() => {
            if (isLoadedRef.current ?? isLoading) {
                return;
            }
            setIsLoading(true);
        }} onError={handleError} onLoad={(e) => {
            imageLoadedSuccessfully(e);
        }} waitForSession={() => {
            // Called when the image should wait for a valid session to reload
            // At the moment this function is called, the image is not in cache anymore
            isLoadedRef.current = false;
            setIsImageCached(false);
            setIsLoading(true);
            waitForSession?.();
        }} loadingIconSize={loadingIconSize} loadingIndicatorStyles={loadingIndicatorStyles}/>
            {isLoading && !isImageCached && !isOffline && (<FullscreenLoadingIndicator_1.default iconSize={loadingIconSize} style={[styles.opacity1, styles.bgTransparent, loadingIndicatorStyles]}/>)}
            {isLoading && shouldShowOfflineIndicator && !isImageCached && <AttachmentOfflineIndicator_1.default isPreview/>}
        </react_native_1.View>);
}
ImageWithSizeCalculation.displayName = 'ImageWithSizeCalculation';
exports.default = react_1.default.memo(ImageWithSizeCalculation);
