"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const IMAGE_TYPES = ['jpg', 'jpeg', 'png'];
const MAX_IMAGE_HEIGHT = 180;
const MAX_IMAGE_WIDTH = 340;
function filterNonUniqueLinks(linkMetadata) {
    const linksMap = new Map();
    const result = [];
    linkMetadata.forEach((item) => {
        if (!item.url || linksMap.has(item.url)) {
            return;
        }
        linksMap.set(item.url, item.url);
        result.push(item);
    });
    return result;
}
function LinkPreviewer({ linkMetadata = [], maxAmountOfPreviews = -1 }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const uniqueLinks = filterNonUniqueLinks(linkMetadata);
    const maxAmountOfLinks = maxAmountOfPreviews >= 0 ? Math.min(maxAmountOfPreviews, linkMetadata.length) : linkMetadata.length;
    const linksToShow = uniqueLinks.slice(0, maxAmountOfLinks);
    return linksToShow.map((linkData) => {
        if (!linkData && Array.isArray(linkData)) {
            return;
        }
        const { description, image, title, logo, publisher, url } = linkData;
        return (<react_native_1.View style={styles.linkPreviewWrapper} key={url}>
                <react_native_1.View style={styles.flexRow}>
                    {!!logo && (<react_native_1.Image style={styles.linkPreviewLogoImage} source={{ uri: logo.url }}/>)}
                    {!!publisher && (<Text_1.default fontSize={variables_1.default.fontSizeLabel} style={styles.pl2}>
                            {publisher}
                        </Text_1.default>)}
                </react_native_1.View>
                {!!title && !!url && (<TextLink_1.default fontSize={variables_1.default.fontSizeNormal} style={[styles.mv2, StyleUtils.getTextColorStyle(theme.link), styles.alignSelfStart]} href={url}>
                        {title}
                    </TextLink_1.default>)}
                {!!description && <Text_1.default fontSize={variables_1.default.fontSizeNormal}>{description}</Text_1.default>}
                {!!image?.type && IMAGE_TYPES.includes(image.type) && !!image.width && !!image.height && (<react_native_1.Image style={[
                    styles.linkPreviewImage,
                    {
                        aspectRatio: image.width / image.height,
                        maxHeight: Math.min(image.height, MAX_IMAGE_HEIGHT),
                        // Calculate maximum width when image is too tall, so it doesn't move away from left
                        maxWidth: Math.min((Math.min(image.height, MAX_IMAGE_HEIGHT) / image.height) * image.width, MAX_IMAGE_WIDTH),
                    },
                ]} resizeMode="contain" source={{ uri: image.url }}/>)}
            </react_native_1.View>);
    });
}
LinkPreviewer.displayName = 'ReportLinkPreview';
exports.default = LinkPreviewer;
