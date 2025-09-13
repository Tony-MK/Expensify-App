"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchParamFromUrl = getSearchParamFromUrl;
exports.hasSameExpensifyOrigin = hasSameExpensifyOrigin;
exports.getPathFromURL = getPathFromURL;
exports.appendParam = appendParam;
exports.hasURL = hasURL;
exports.addLeadingForwardSlash = addLeadingForwardSlash;
exports.extractUrlDomain = extractUrlDomain;
require("react-native-url-polyfill/auto");
const CONST_1 = require("@src/CONST");
function addLeadingForwardSlash(url) {
    if (!url.startsWith('/')) {
        return `/${url}`;
    }
    return url;
}
/**
 * Get path from URL string
 */
function getPathFromURL(url) {
    try {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
        return path.substring(1); // Remove the leading '/'
    }
    catch (error) {
        console.error('Error parsing URL:', error);
        return ''; // Return empty string for invalid URLs
    }
}
/**
 * Determine if two urls have the same origin
 */
function hasSameExpensifyOrigin(url1, url2) {
    const removeW3 = (host) => host.replace(/^www\./i, '');
    try {
        const parsedUrl1 = new URL(url1);
        const parsedUrl2 = new URL(url2);
        return removeW3(parsedUrl1.host) === removeW3(parsedUrl2.host);
    }
    catch (error) {
        // Handle invalid URLs or other parsing errors
        console.error('Error parsing URLs:', error);
        return false;
    }
}
/**
 * Appends or updates a query parameter in a given URL.
 */
function appendParam(url, paramName, paramValue) {
    // If parameter exists, replace it
    if (url.includes(`${paramName}=`)) {
        const regex = new RegExp(`${paramName}=([^&]*)`);
        return url.replace(regex, `${paramName}=${paramValue}`);
    }
    // If parameter doesn't exist, append it
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${paramName}=${paramValue}`;
}
function hasURL(text) {
    const urlPattern = /((https|http)?:\/\/[^\s]+)/g;
    return urlPattern.test(text);
}
function extractUrlDomain(url) {
    const match = String(url).match(CONST_1.default.REGEX.DOMAIN_BASE);
    return match?.[1];
}
function getSearchParamFromUrl(currentUrl, param) {
    return currentUrl ? new URL(currentUrl).searchParams.get(param) : null;
}
