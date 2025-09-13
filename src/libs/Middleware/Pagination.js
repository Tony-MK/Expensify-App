"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
exports.registerPaginationConfig = registerPaginationConfig;
const fastMerge_1 = require("expensify-common/dist/fastMerge");
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const PaginationUtils_1 = require("@libs/PaginationUtils");
const CONST_1 = require("@src/CONST");
// Map of API commands to their pagination configs
const paginationConfigs = new Map();
// Local cache of paginated Onyx resources
const resources = new Map();
// Local cache of Onyx pages objects
const pages = new Map();
function registerPaginationConfig({ initialCommand, previousCommand, nextCommand, ...config }) {
    paginationConfigs.set(initialCommand, { ...config, type: 'initial' });
    paginationConfigs.set(previousCommand, { ...config, type: 'previous' });
    paginationConfigs.set(nextCommand, { ...config, type: 'next' });
    react_native_onyx_1.default.connect({
        key: config.resourceCollectionKey,
        waitForCollectionCallback: true,
        callback: (data) => {
            resources.set(config.resourceCollectionKey, data);
        },
    });
    react_native_onyx_1.default.connect({
        key: config.pageCollectionKey,
        waitForCollectionCallback: true,
        callback: (data) => {
            pages.set(config.pageCollectionKey, data);
        },
    });
}
function isPaginatedRequest(request) {
    return 'isPaginated' in request && request.isPaginated;
}
/**
 * This middleware handles paginated requests marked with isPaginated: true. It works by:
 *
 * 1. Extracting the paginated resources from the response
 * 2. Sorting them
 * 3. Merging the new page of resources with any preexisting pages it overlaps with
 * 4. Updating the saved pages in Onyx for that resource.
 *
 * It does this to keep track of what it's fetched via pagination and what may have showed up from other sources,
 * so it can keep track of and fill any potential gaps in paginated lists.
 */
const Pagination = (requestResponse, request) => {
    const paginationConfig = paginationConfigs.get(request.command);
    if (!paginationConfig || !isPaginatedRequest(request)) {
        return requestResponse;
    }
    const { resourceCollectionKey, pageCollectionKey, sortItems, getItemID, type } = paginationConfig;
    const { resourceID, cursorID } = request;
    return requestResponse.then((response) => {
        if (!response?.onyxData) {
            return Promise.resolve(response);
        }
        const resourceKey = `${resourceCollectionKey}${resourceID}`;
        const pageKey = `${pageCollectionKey}${resourceID}`;
        // Create a new page based on the response
        const pageItems = (response.onyxData.find((data) => data.key === resourceKey)?.value ?? {});
        const sortedPageItems = sortItems(pageItems, resourceID);
        if (sortedPageItems.length === 0) {
            // Must have at least 1 action to create a page.
            Log_1.default.hmmm(`[Pagination] Did not receive any items in the response to ${request.command}`);
            return Promise.resolve(response);
        }
        const newPage = sortedPageItems.map((item) => getItemID(item));
        if (response.hasNewerActions === false || (type === 'initial' && !cursorID)) {
            newPage.unshift(CONST_1.default.PAGINATION_START_ID);
        }
        if (response.hasOlderActions === false || response.hasOlderActions === null) {
            newPage.push(CONST_1.default.PAGINATION_END_ID);
        }
        const resourceCollections = resources.get(resourceCollectionKey) ?? {};
        const existingItems = resourceCollections[resourceKey] ?? {};
        const allItems = (0, fastMerge_1.default)(existingItems, pageItems, true);
        const sortedAllItems = sortItems(allItems, resourceID);
        const pagesCollections = pages.get(pageCollectionKey) ?? {};
        const existingPages = pagesCollections[pageKey] ?? [];
        const mergedPages = PaginationUtils_1.default.mergeAndSortContinuousPages(sortedAllItems, [...existingPages, newPage], getItemID);
        response.onyxData.push({
            key: pageKey,
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            value: mergedPages,
        });
        return Promise.resolve(response);
    });
};
exports.Pagination = Pagination;
