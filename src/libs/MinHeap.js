"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinHeap = void 0;
const Heap_1 = require("./Heap");
/**
 * Comparison function for a min-heap based on the provided `getCompareValue` function.
 * @param getCompareValue
 */
function getMinCompare(getCompareValue) {
    return (a, b) => {
        const aVal = typeof getCompareValue === 'function' ? getCompareValue(a) : a;
        const bVal = typeof getCompareValue === 'function' ? getCompareValue(b) : b;
        return aVal <= bVal ? -1 : 1;
    };
}
/**
 * MinHeap is a priority queue that always keeps the smallest element at the top.
 * Internally, it uses a binary heap structure to ensure that insertion (`push`)
 * and removal of the minimum element (`pop`) are efficient, both operating in O(log n) time.
 *
 * The heap is constructed using a comparator derived from an optional `getCompareValue` function,
 * which allows comparing complex objects based on a specific property.
 * If no comparison function is provided, direct value comparison is used.
 *
 * Typical use cases include:
 * - Finding the smallest element in a dynamic dataset
 * - Implementing efficient top-k queries (e.g., 10 smallest items from a large list)
 * - Scheduling or prioritizing tasks based on weight or priority value
 *
 * Elements can be added via `push`, removed with `pop`, and inspected with `peek`.
 * The heap also supports iteration, which destructively yields elements in ascending order.
 *
 * Example:
 * ```ts
 * const heap = new MinHeap<number>();
 * heap.push(4).push(1).push(3);
 * console.log(heap.pop()); // 1
 * ```
 */
class MinHeap {
    constructor(getCompareValue) {
        this.heap = new Heap_1.Heap(getMinCompare(getCompareValue));
    }
    push(value) {
        this.heap.push(value);
        return this;
    }
    pop() {
        return this.heap.pop();
    }
    peek() {
        return this.heap.peek();
    }
    size() {
        return this.heap.size();
    }
    isEmpty() {
        return this.heap.isEmpty();
    }
    clear() {
        this.heap.clear();
    }
    *[Symbol.iterator]() {
        let size = this.size();
        while (size-- > 0) {
            const poppedValue = this.pop();
            if (poppedValue === null) {
                break;
            }
            yield poppedValue;
        }
    }
}
exports.MinHeap = MinHeap;
