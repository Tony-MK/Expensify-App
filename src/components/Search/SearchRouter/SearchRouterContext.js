"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRouterContextProvider = SearchRouterContextProvider;
exports.useSearchRouterContext = useSearchRouterContext;
const react_1 = require("react");
const isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Modal_1 = require("@userActions/Modal");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const defaultSearchContext = {
    isSearchRouterDisplayed: false,
    openSearchRouter: () => { },
    closeSearchRouter: () => { },
    toggleSearch: () => { },
    registerSearchPageInput: () => { },
    unregisterSearchPageInput: () => { },
};
const Context = react_1.default.createContext(defaultSearchContext);
const isBrowserWithHistory = typeof window !== 'undefined' && typeof window.history !== 'undefined';
const canListenPopState = typeof window !== 'undefined' && typeof window.addEventListener === 'function';
function SearchRouterContextProvider({ children }) {
    const [isSearchRouterDisplayed, setIsSearchRouterDisplayed] = (0, react_1.useState)(false);
    const searchRouterDisplayedRef = (0, react_1.useRef)(false);
    const searchPageInputRef = (0, react_1.useRef)(undefined);
    (0, react_1.useEffect)(() => {
        if (!canListenPopState) {
            return;
        }
        /**
         * Handle browser back/forward navigation
         * When user clicks back/forward, we check the history state:
         * - If state has isSearchModalOpen=true, we show the modal
         * - If state has isSearchModalOpen=false or no state, we hide the modal
         * This creates a proper browser history integration where modal state
         * is part of the navigation history
         */
        const handlePopState = (event) => {
            const state = event.state;
            if (state?.isSearchModalOpen) {
                setIsSearchRouterDisplayed(true);
                searchRouterDisplayedRef.current = true;
            }
            else {
                setIsSearchRouterDisplayed(false);
                searchRouterDisplayedRef.current = false;
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    const routerContext = (0, react_1.useMemo)(() => {
        const openSearchRouter = () => {
            if (isBrowserWithHistory) {
                window.history.pushState({ isSearchModalOpen: true }, '');
            }
            (0, Modal_1.close)(() => {
                setIsSearchRouterDisplayed(true);
                searchRouterDisplayedRef.current = true;
            }, false, true);
        };
        const closeSearchRouter = () => {
            setIsSearchRouterDisplayed(false);
            searchRouterDisplayedRef.current = false;
            if (isBrowserWithHistory) {
                const state = window.history.state;
                if (state?.isSearchModalOpen) {
                    window.history.replaceState({ isSearchModalOpen: false }, '');
                }
            }
        };
        // There are callbacks that live outside of React render-loop and interact with SearchRouter
        // So we need a function that is based on ref to correctly open/close it
        // When user is on `/search` page we focus the Input instead of showing router
        const toggleSearch = () => {
            const searchFullScreenRoutes = Navigation_1.navigationRef.getRootState()?.routes.findLast((route) => route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR);
            const lastRoute = searchFullScreenRoutes?.state?.routes?.at(-1);
            const isUserOnSearchPage = (0, isSearchTopmostFullScreenRoute_1.default)() && lastRoute?.name === SCREENS_1.default.SEARCH.ROOT;
            if (isUserOnSearchPage && searchPageInputRef.current) {
                if (searchPageInputRef.current.isFocused()) {
                    searchPageInputRef.current.blur();
                }
                else {
                    searchPageInputRef.current.focus();
                }
            }
            else if (searchRouterDisplayedRef.current) {
                closeSearchRouter();
            }
            else {
                openSearchRouter();
            }
        };
        const registerSearchPageInput = (ref) => {
            searchPageInputRef.current = ref;
        };
        const unregisterSearchPageInput = () => {
            searchPageInputRef.current = undefined;
        };
        return {
            isSearchRouterDisplayed,
            openSearchRouter,
            closeSearchRouter,
            toggleSearch,
            registerSearchPageInput,
            unregisterSearchPageInput,
        };
    }, [isSearchRouterDisplayed, setIsSearchRouterDisplayed]);
    return <Context.Provider value={routerContext}>{children}</Context.Provider>;
}
function useSearchRouterContext() {
    return (0, react_1.useContext)(Context);
}
SearchRouterContextProvider.displayName = 'SearchRouterContextProvider';
