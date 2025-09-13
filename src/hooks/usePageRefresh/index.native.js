"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_error_boundary_1 = require("react-error-boundary");
const usePageRefresh = () => {
    const { resetBoundary } = (0, react_error_boundary_1.useErrorBoundary)();
    return resetBoundary;
};
exports.default = usePageRefresh;
