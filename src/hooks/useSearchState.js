"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const CONST_1 = require("@src/CONST");
const SCREENS_1 = require("@src/SCREENS");
/**
 * Hook to manage search state based on route parameters
 * Returns search status and hash for query tracking
 */
const useSearchState = () => {
    // We are using these contexts directly instead of useRoute, because those will throw an error if used outside a navigator.
    const route = (0, react_1.useContext)(native_1.NavigationRouteContext);
    const { q, type, hashKey: hashKeyFromRoute } = route?.params ?? {};
    return (0, react_1.useMemo)(() => {
        if (!route) {
            return { isOnSearch: false, hashKey: undefined };
        }
        const isSearchAttachmentModal = route?.name === SCREENS_1.default.ATTACHMENTS && type === CONST_1.default.ATTACHMENT_TYPE.SEARCH;
        const queryJSON = q ? (0, SearchQueryUtils_1.buildSearchQueryJSON)(q) : {};
        // for attachment modal the hashKey is passed through route params, fallback to it if not found in queryJSON
        const hashKey = queryJSON?.hash ? queryJSON.hash : (hashKeyFromRoute ?? undefined);
        const isOnSearch = (route?.name === SCREENS_1.default.SEARCH.ROOT && !!hashKey) || isSearchAttachmentModal;
        return { hashKey, isOnSearch };
    }, [q, type, route, hashKeyFromRoute]);
};
exports.default = useSearchState;
