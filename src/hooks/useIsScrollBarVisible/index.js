"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useIsScrollBarVisible = (ref, value) => {
    const [isScrollBarVisible, setIsScrollBarVisible] = (0, react_1.useState)(false);
    const handleResize = (0, react_1.useCallback)(() => {
        if (!ref.current) {
            return;
        }
        const { scrollHeight, clientHeight } = ref.current;
        setIsScrollBarVisible(scrollHeight > clientHeight);
    }, [ref]);
    (0, react_1.useEffect)(() => {
        if (!ref.current || !('ResizeObserver' in (window || {}))) {
            return;
        }
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(ref.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, [handleResize, ref, value]);
    return isScrollBarVisible;
};
exports.default = useIsScrollBarVisible;
