"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopoverContext = void 0;
const react_1 = require("react");
const PopoverContext = (0, react_1.createContext)({
    onOpen: () => { },
    popover: null,
    popoverAnchor: null,
    close: () => { },
    isOpen: false,
    setActivePopoverExtraAnchorRef: () => { },
});
exports.PopoverContext = PopoverContext;
function elementContains(ref, target) {
    if (ref?.current && 'contains' in ref.current && ref?.current?.contains(target)) {
        return true;
    }
    return false;
}
function PopoverContextProvider(props) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const activePopoverRef = (0, react_1.useRef)(null);
    const [activePopoverAnchor, setActivePopoverAnchor] = (0, react_1.useState)(null);
    const [activePopoverExtraAnchorRefs, setActivePopoverExtraAnchorRefs] = (0, react_1.useState)([]);
    const closePopover = (0, react_1.useCallback)((anchorRef) => {
        if (!activePopoverRef.current || (anchorRef && anchorRef !== activePopoverRef.current.anchorRef)) {
            return false;
        }
        activePopoverRef.current.close();
        activePopoverRef.current = null;
        setIsOpen(false);
        setActivePopoverAnchor(null);
        return true;
    }, []);
    (0, react_1.useEffect)(() => {
        const listener = (e) => {
            if (elementContains(activePopoverRef.current?.ref, e.target) || elementContains(activePopoverRef.current?.anchorRef, e.target)) {
                return;
            }
            // Incase there are any extra anchor refs where the popover should not close on click
            // for example, the case when the QAB tooltip is clicked it closes the popover this will prevent that
            if (activePopoverExtraAnchorRefs?.some((ref) => elementContains(ref, e.target))) {
                return;
            }
            const ref = activePopoverRef.current?.anchorRef;
            closePopover(ref);
        };
        document.addEventListener('click', listener, true);
        return () => {
            document.removeEventListener('click', listener, true);
        };
    }, [closePopover, activePopoverExtraAnchorRefs]);
    (0, react_1.useEffect)(() => {
        const listener = (e) => {
            if (elementContains(activePopoverRef.current?.ref, e.target)) {
                return;
            }
            closePopover();
        };
        document.addEventListener('contextmenu', listener);
        return () => {
            document.removeEventListener('contextmenu', listener);
        };
    }, [closePopover]);
    (0, react_1.useEffect)(() => {
        const listener = (e) => {
            if (e.key !== 'Escape') {
                return;
            }
            if (closePopover()) {
                e.stopImmediatePropagation();
            }
        };
        document.addEventListener('keyup', listener, true);
        return () => {
            document.removeEventListener('keyup', listener, true);
        };
    }, [closePopover]);
    (0, react_1.useEffect)(() => {
        const listener = () => {
            if (document.hasFocus()) {
                return;
            }
            closePopover();
        };
        document.addEventListener('visibilitychange', listener);
        return () => {
            document.removeEventListener('visibilitychange', listener);
        };
    }, [closePopover]);
    (0, react_1.useEffect)(() => {
        const listener = (e) => {
            if (elementContains(activePopoverRef.current?.ref, e.target)) {
                return;
            }
            closePopover();
        };
        document.addEventListener('wheel', listener, true);
        return () => {
            document.removeEventListener('wheel', listener, true);
        };
    }, [closePopover]);
    const onOpen = (0, react_1.useCallback)((popoverParams) => {
        if (activePopoverRef.current && activePopoverRef.current.ref !== popoverParams?.ref) {
            closePopover(activePopoverRef.current.anchorRef);
        }
        activePopoverRef.current = popoverParams;
        setActivePopoverAnchor(popoverParams.anchorRef.current);
        setIsOpen(true);
    }, [closePopover]);
    // To set the extra anchor refs for the popover when prop-drilling is not possible
    const setActivePopoverExtraAnchorRef = (0, react_1.useCallback)((extraAnchorRef) => {
        if (!extraAnchorRef) {
            return;
        }
        setActivePopoverExtraAnchorRefs((prev) => {
            if (!prev) {
                return [extraAnchorRef];
            }
            if (prev?.includes(extraAnchorRef)) {
                return prev;
            }
            return [...prev, extraAnchorRef];
        });
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        onOpen,
        setActivePopoverExtraAnchorRef,
        close: closePopover,
        // eslint-disable-next-line react-compiler/react-compiler
        popover: activePopoverRef.current,
        popoverAnchor: activePopoverAnchor,
        isOpen,
    }), [onOpen, closePopover, isOpen, activePopoverAnchor, setActivePopoverExtraAnchorRef]);
    return <PopoverContext.Provider value={contextValue}>{props.children}</PopoverContext.Provider>;
}
PopoverContextProvider.displayName = 'PopoverContextProvider';
exports.default = PopoverContextProvider;
