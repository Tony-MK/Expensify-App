"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const DistanceEReceipt_1 = require("@components/DistanceEReceipt");
const EReceiptWithSizeCalculation_1 = require("@components/EReceiptWithSizeCalculation");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const Image_1 = require("@src/components/Image");
const CONST_1 = require("@src/CONST");
function ReceiptPreview({ source, hovered, isEReceipt = false, transactionItem }) {
    const isDistanceEReceipt = (0, TransactionUtils_1.isDistanceRequest)(transactionItem) && !(0, TransactionUtils_1.isManualDistanceRequest)(transactionItem);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const [eReceiptScaleFactor, setEReceiptScaleFactor] = (0, react_1.useState)(0);
    const [imageAspectRatio, setImageAspectRatio] = (0, react_1.useState)(undefined);
    const [distanceEReceiptAspectRatio, setDistanceEReceiptAspectRatio] = (0, react_1.useState)(undefined);
    const [shouldShow, debounceShouldShow, setShouldShow] = (0, useDebouncedState_1.default)(false, CONST_1.default.TIMING.SHOW_HOVER_PREVIEW_DELAY);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const hasMeasured = (0, react_1.useRef)(false);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const handleDistanceEReceiptLayout = (e) => {
        if (hasMeasured.current) {
            return;
        }
        hasMeasured.current = true;
        const { height, width } = e.nativeEvent.layout;
        if (height === 0) {
            // on the initial layout, measured height is 0, so we want to set everything on the second one
            hasMeasured.current = false;
            return;
        }
        if (height * eReceiptScaleFactor > windowHeight - CONST_1.default.RECEIPT_PREVIEW_TOP_BOTTOM_MARGIN) {
            setDistanceEReceiptAspectRatio(variables_1.default.eReceiptBGHWidth / (windowHeight - CONST_1.default.RECEIPT_PREVIEW_TOP_BOTTOM_MARGIN));
            return;
        }
        setDistanceEReceiptAspectRatio(variables_1.default.eReceiptBGHWidth / height);
        setEReceiptScaleFactor(width / variables_1.default.eReceiptBGHWidth);
    };
    const updateImageAspectRatio = (0, react_1.useCallback)((width, height) => {
        if (!source) {
            return;
        }
        setImageAspectRatio(height ? width / height : 'auto');
    }, [source]);
    const handleLoad = (0, react_1.useCallback)((e) => {
        const { width, height } = e.nativeEvent;
        updateImageAspectRatio(width, height);
        setIsLoading(false);
    }, [updateImageAspectRatio]);
    const handleError = () => {
        setIsLoading(false);
    };
    (0, react_1.useEffect)(() => {
        setShouldShow(hovered);
    }, [hovered, setShouldShow]);
    if (shouldUseNarrowLayout || !debounceShouldShow || !shouldShow || (!source && !isEReceipt && !isDistanceEReceipt)) {
        return null;
    }
    const shouldShowImage = source && !(isEReceipt || isDistanceEReceipt);
    const shouldShowDistanceEReceipt = isDistanceEReceipt && !isEReceipt;
    return react_dom_1.default.createPortal(<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeIn.duration(CONST_1.default.TIMING.SHOW_HOVER_PREVIEW_ANIMATION_DURATION)} exiting={react_native_reanimated_1.FadeOut.duration(CONST_1.default.TIMING.SHOW_HOVER_PREVIEW_ANIMATION_DURATION)} style={[styles.receiptPreview, styles.flexColumn, styles.alignItemsCenter, styles.justifyContentStart]}>
            {shouldShowImage ? (<react_native_1.View style={[styles.w100]}>
                    {isLoading && (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFillObject, styles.justifyContentCenter, styles.alignItemsCenter]}>
                            <react_native_1.ActivityIndicator color={theme.spinner} size="large"/>
                        </react_native_1.View>)}

                    <Image_1.default source={{ uri: source }} style={[
                styles.w100,
                { aspectRatio: imageAspectRatio ?? 1 },
                isLoading && { opacity: 0 }, // hide until loaded
            ]} onLoadStart={() => {
                if (isLoading) {
                    return;
                }
                setIsLoading(true);
            }} onError={handleError} onLoad={handleLoad} isAuthTokenRequired/>
                </react_native_1.View>) : (<react_native_1.View style={styles.receiptPreviewEReceiptsContainer}>
                    {shouldShowDistanceEReceipt ? (<react_native_1.View onLayout={handleDistanceEReceiptLayout} style={[
                    {
                        transformOrigin: 'center',
                        scale: eReceiptScaleFactor,
                        aspectRatio: distanceEReceiptAspectRatio,
                    },
                ]}>
                            <DistanceEReceipt_1.default transaction={transactionItem} hoverPreview/>
                        </react_native_1.View>) : (<EReceiptWithSizeCalculation_1.default transactionID={transactionItem.transactionID} transactionItem={transactionItem} shouldUseAspectRatio/>)}
                </react_native_1.View>)}
        </react_native_reanimated_1.default.View>, document.body);
}
ReceiptPreview.displayName = 'HoverReceiptPreview';
exports.default = ReceiptPreview;
