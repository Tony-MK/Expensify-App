"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortable_1 = require("@dnd-kit/sortable");
const utilities_1 = require("@dnd-kit/utilities");
const react_1 = require("react");
function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = (0, sortable_1.useSortable)({ id });
    const style = {
        touchAction: 'none',
        transform: utilities_1.CSS.Transform.toString(transform),
        transition,
    };
    return (<div ref={setNodeRef} style={style} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...attributes} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...listeners}>
            {children}
        </div>);
}
exports.default = SortableItem;
