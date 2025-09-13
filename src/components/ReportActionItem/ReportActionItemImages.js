"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/no-array-index-key */
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const ImageBehaviorContextProvider_1 = require("@components/Image/ImageBehaviorContextProvider");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const ReportActionItemImage_1 = require("./ReportActionItemImage");
/**
 * This component displays a row of images in a report action item like a card, such
 * as report previews or expense previews which contain receipt images. The maximum of images
 * shown in this row is dictated by the size prop, which, if not passed, is just the number of images.
 * Otherwise, if size is passed and the number of images is over size, we show a small overlay on the
 * last image of how many additional images there are. If passed, total prop can be used to change how this
 * additional number when subtracted from size.
 */
function ReportActionItemImages({ images, size, total, isHovered = false, onPress, shouldUseAspectRatio = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    // Calculate the number of images to be shown, limited by the value of 'size' (if defined)
    // or the total number of images.
    const numberOfShownImages = Math.min(size ?? images.length, images.length);
    const shownImages = images.slice(0, numberOfShownImages);
    const remaining = (total ?? images.length) - numberOfShownImages;
    const MAX_REMAINING = 9;
    // The height varies depending on the number of images we are displaying.
    const layoutStyle = [];
    if (shouldUseAspectRatio) {
        layoutStyle.push(styles.receiptPreviewAspectRatio);
    }
    else if (numberOfShownImages === 1) {
        layoutStyle.push(StyleUtils.getMaximumHeight(variables_1.default.reportActionImagesSingleImageHeight), StyleUtils.getMinimumHeight(variables_1.default.reportActionImagesSingleImageHeight));
    }
    else if (numberOfShownImages === 2) {
        layoutStyle.push(StyleUtils.getMaximumHeight(variables_1.default.reportActionImagesDoubleImageHeight), StyleUtils.getMinimumHeight(variables_1.default.reportActionImagesDoubleImageHeight));
    }
    else if (numberOfShownImages > 2) {
        layoutStyle.push(StyleUtils.getMaximumHeight(variables_1.default.reportActionImagesMultipleImageHeight), StyleUtils.getMinimumHeight(variables_1.default.reportActionImagesMultipleImageHeight));
    }
    const hoverStyle = isHovered ? styles.reportPreviewBoxHoverBorder : undefined;
    const triangleWidth = variables_1.default.reportActionItemImagesMoreCornerTriangleWidth;
    return (<react_native_1.View style={styles.reportActionItemImagesContainer}>
            <react_native_1.View style={[styles.reportActionItemImages, hoverStyle, ...layoutStyle]}>
                {shownImages.map(({ thumbnail, isThumbnail, image, isEmptyReceipt, transaction, isLocalFile, fileExtension, filename }, index) => {
            // Show a border to separate multiple images. Shown to the right for each except the last.
            const shouldShowBorder = shownImages.length > 1 && index < shownImages.length - 1;
            const borderStyle = shouldShowBorder ? styles.reportActionItemImageBorder : {};
            return (<ImageBehaviorContextProvider_1.ImageBehaviorContextProvider key={`${index}-${image}`} shouldSetAspectRatioInStyle={numberOfShownImages === 1 ? true : expensify_common_1.Str.isPDF(filename ?? '')}>
                            <react_native_1.View style={[styles.reportActionItemImage, borderStyle, hoverStyle]}>
                                <ReportActionItemImage_1.default thumbnail={thumbnail} fileExtension={fileExtension} image={image} isLocalFile={isLocalFile} isEmptyReceipt={isEmptyReceipt} filename={filename} transaction={transaction} isThumbnail={isThumbnail} isSingleImage={numberOfShownImages === 1} shouldMapHaveBorderRadius={false} onPress={onPress} shouldUseFullHeight={shouldUseAspectRatio}/>
                            </react_native_1.View>
                        </ImageBehaviorContextProvider_1.ImageBehaviorContextProvider>);
        })}
            </react_native_1.View>
            {remaining > 0 && (<react_native_1.View style={[styles.reportActionItemImagesMoreContainer]}>
                    <react_native_1.View style={[styles.reportActionItemImagesMore, isHovered ? styles.reportActionItemImagesMoreHovered : {}]}/>
                    <react_native_svg_1.Svg height={triangleWidth} width={triangleWidth} style={styles.reportActionItemImagesMoreCornerTriangle}>
                        <react_native_svg_1.Polygon points={`${triangleWidth},0 ${triangleWidth},${triangleWidth} 0,${triangleWidth}`} fill={isHovered ? theme.border : theme.cardBG}/>
                    </react_native_svg_1.Svg>
                    <Text_1.default style={[styles.reportActionItemImagesMoreText, styles.textStrong]}>{remaining > MAX_REMAINING ? `${MAX_REMAINING}+` : `+${remaining}`}</Text_1.default>
                </react_native_1.View>)}
        </react_native_1.View>);
}
ReportActionItemImages.displayName = 'ReportActionItemImages';
exports.default = ReportActionItemImages;
