"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragAndDropContext = void 0;
const react_1 = require("react");
const DragAndDropContext = react_1.default.createContext({});
exports.DragAndDropContext = DragAndDropContext;
function DragAndDropProvider({ children }) {
    return children;
}
DragAndDropProvider.displayName = 'DragAndDropProvider';
exports.default = DragAndDropProvider;
