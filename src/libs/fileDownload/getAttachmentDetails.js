"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const CONST_1 = require("@src/CONST");
/**
 * Extract the thumbnail URL, source URL and the original filename from the HTML.
 */
const getAttachmentDetails = (html) => {
    // Files can be rendered either as anchor tag or as an image so based on that we have to form regex.
    const IS_IMAGE_TAG = /<img([\w\W]+?)\/>/i.test(html);
    const PREVIEW_SOURCE_REGEX = new RegExp(`${CONST_1.default.ATTACHMENT_PREVIEW_ATTRIBUTE}*=*"(.+?)"`, 'i');
    const SOURCE_REGEX = new RegExp(`${CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE}*=*"(.+?)"`, 'i');
    const ORIGINAL_FILENAME_REGEX = IS_IMAGE_TAG ? new RegExp(`${CONST_1.default.ATTACHMENT_ORIGINAL_FILENAME_ATTRIBUTE}*=*"(.+?)"`, 'i') : new RegExp('<(?:a|video)[^>]*>([^<]+)</(?:a|video)>', 'i');
    if (!html) {
        return {
            previewSourceURL: null,
            sourceURL: null,
            originalFileName: null,
        };
    }
    // Files created/uploaded/hosted by App should resolve from API ROOT. Other URLs aren't modified
    const sourceURL = (0, tryResolveUrlFromApiRoot_1.default)(html.match(SOURCE_REGEX)?.[1] ?? '');
    const imageURL = IS_IMAGE_TAG ? (0, tryResolveUrlFromApiRoot_1.default)(html.match(PREVIEW_SOURCE_REGEX)?.[1] ?? '') : null;
    const previewSourceURL = IS_IMAGE_TAG ? imageURL : sourceURL;
    const originalFileName = html.match(ORIGINAL_FILENAME_REGEX)?.[1] ?? null;
    // Update the image URL so the images can be accessed depending on the config environment
    return {
        previewSourceURL,
        sourceURL,
        originalFileName,
    };
};
exports.default = getAttachmentDetails;
