"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@dnd-kit/core");
const modifiers_1 = require("@dnd-kit/modifiers");
const sortable_1 = require("@dnd-kit/sortable");
const react_1 = require("react");
const ScrollView_1 = require("@components/ScrollView");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SortableItem_1 = require("./SortableItem");
const minimumActivationDistance = 5; // pointer must move at least this much before starting to drag
/**
 * Draggable (vertical) list using dnd-kit. Dragging is restricted to the vertical axis only
 *
 */
function DraggableList({ data = [], renderItem, keyExtractor, onDragEnd: onDragEndCallback, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ListFooterComponent, ref, }) {
    const styles = (0, useThemeStyles_1.default)();
    const items = data.map((item, index) => {
        return keyExtractor(item, index);
    });
    /**
     * Function to be called when the user finishes dragging an item
     * It will reorder the list and call the callback function
     * to notify the parent component about the change
     */
    const onDragEnd = (event) => {
        const { active, over } = event;
        if (over !== null && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id.toString());
            const newIndex = items.indexOf(over.id.toString());
            const reorderedItems = (0, sortable_1.arrayMove)(data, oldIndex, newIndex);
            onDragEndCallback?.({ data: reorderedItems });
        }
    };
    const sortableItems = data.map((item, index) => {
        const key = keyExtractor(item, index);
        return (<SortableItem_1.default id={key} key={key}>
                {renderItem({
                item,
                getIndex: () => index,
                isActive: false,
                drag: () => { },
            })}
            </SortableItem_1.default>);
    });
    const sensors = [
        (0, core_1.useSensor)(core_1.PointerSensor, {
            activationConstraint: {
                distance: minimumActivationDistance,
            },
        }),
    ];
    return (<ScrollView_1.default ref={ref} style={styles.flex1} contentContainerStyle={styles.flex1}>
            <div>
                <core_1.DndContext onDragEnd={onDragEnd} sensors={sensors} collisionDetection={core_1.closestCenter} modifiers={[modifiers_1.restrictToParentElement, modifiers_1.restrictToVerticalAxis]}>
                    <sortable_1.SortableContext items={items} strategy={sortable_1.verticalListSortingStrategy}>
                        {sortableItems}
                    </sortable_1.SortableContext>
                </core_1.DndContext>
            </div>
            {ListFooterComponent}
        </ScrollView_1.default>);
}
DraggableList.displayName = 'DraggableList';
exports.default = DraggableList;
