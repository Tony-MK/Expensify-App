"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withViewportOffsetTop;
const react_1 = require("react");
const getComponentDisplayName_1 = require("@libs/getComponentDisplayName");
const VisualViewport_1 = require("@libs/VisualViewport");
function withViewportOffsetTop(WrappedComponent) {
    function WithViewportOffsetTop(props, ref) {
        const [viewportOffsetTop, setViewportOffsetTop] = (0, react_1.useState)(0);
        (0, react_1.useEffect)(() => {
            const updateDimensions = (event) => {
                const targetOffsetTop = (event.target instanceof VisualViewport && event.target.offsetTop) || 0;
                setViewportOffsetTop(targetOffsetTop);
            };
            const removeViewportResizeListener = (0, VisualViewport_1.default)(updateDimensions);
            return () => {
                removeViewportResizeListener();
            };
        }, []);
        return (<WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} ref={ref} viewportOffsetTop={viewportOffsetTop}/>);
    }
    WithViewportOffsetTop.displayName = `WithViewportOffsetTop(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
    return (0, react_1.forwardRef)(WithViewportOffsetTop);
}
