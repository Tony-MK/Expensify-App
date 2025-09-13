"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Navigation_1 = require("@libs/Navigation/Navigation");
function useActiveRoute() {
    const currentReportRHPActiveRoute = (0, react_1.useRef)('');
    const getReportRHPActiveRoute = (0, react_1.useCallback)(() => {
        if (!currentReportRHPActiveRoute.current) {
            currentReportRHPActiveRoute.current = Navigation_1.default.getReportRHPActiveRoute();
        }
        return currentReportRHPActiveRoute.current;
    }, []);
    return { getReportRHPActiveRoute };
}
exports.default = useActiveRoute;
