"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useThumbnailDimensions;
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const useResponsiveLayout_1 = require("./useResponsiveLayout");
function useThumbnailDimensions(width, height) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const fixedDimension = shouldUseNarrowLayout ? CONST_1.default.THUMBNAIL_IMAGE.SMALL_SCREEN.SIZE : CONST_1.default.THUMBNAIL_IMAGE.WIDE_SCREEN.SIZE;
    const thumbnailDimensionsStyles = (0, react_1.useMemo)(() => {
        if (!width || !height) {
            return { width: fixedDimension, aspectRatio: CONST_1.default.THUMBNAIL_IMAGE.NAN_ASPECT_RATIO };
        }
        const aspectRatio = (height && width / height) || 1;
        if (width > height) {
            return { width: fixedDimension, aspectRatio };
        }
        return { height: fixedDimension, aspectRatio };
    }, [width, height, fixedDimension]);
    return { thumbnailDimensionsStyles };
}
