"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const Provider_1 = require("@components/DragAndDrop/Provider");
function DragAndDropConsumer({ children, onDrop }) {
    const { isDraggingOver, setOnDropHandler, dropZoneID } = (0, react_1.useContext)(Provider_1.DragAndDropContext);
    (0, react_1.useEffect)(() => {
        if (!onDrop) {
            return;
        }
        setOnDropHandler?.(onDrop);
    }, [onDrop, setOnDropHandler]);
    if (!isDraggingOver) {
        return null;
    }
    return <portal_1.Portal hostName={dropZoneID}>{children}</portal_1.Portal>;
}
DragAndDropConsumer.displayName = 'DragAndDropConsumer';
exports.default = DragAndDropConsumer;
