"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heap = void 0;
/**
 * Heap is a generic binary heap implementation that supports both min-heap and max-heap behavior,
 * depending on the comparison function provided at instantiation.
 *
 * It maintains the heap property using an array-based binary tree structure, enabling efficient
 * `push` (insert), `pop` (remove top), and `peek` (inspect top) operations, each with O(log n) time complexity.
 *
 * The comparison function defines the ordering logic:
 * - For a min-heap, the function should return a negative value when `a < b`.
 * - For a max-heap, the function should return a negative value when `a > b`.
 *
 * This class serves as the underlying engine for more specialized heaps (like `MinHeap` or `MaxHeap`),
 * and can be used directly for custom ordering logic (e.g. sorting by multiple fields).
 *
 * @template T - The type of elements in the heap, defaults to number.
 */
class Heap {
    constructor(compare, _values) {
        if (typeof compare !== 'function') {
            throw new Error('Heap constructor expects a compare function');
        }
        this.compare = compare;
        this.nodes = Array.isArray(_values) ? [..._values] : [];
        this.leaf = null;
    }
    hasLeftChild(parentIndex) {
        const leftChildIndex = parentIndex * 2 + 1;
        return leftChildIndex < this.size();
    }
    hasRightChild(parentIndex) {
        const rightChildIndex = parentIndex * 2 + 2;
        return rightChildIndex < this.size();
    }
    compareAt(i, j) {
        const a = this.nodes.at(i);
        const b = this.nodes.at(j);
        if (a === undefined || b === undefined) {
            throw new Error(`Index out of bounds: ${i}, ${j}`);
        }
        return this.compare(a, b);
    }
    swap(i, j) {
        const tempA = this.nodes.at(i);
        const tempB = this.nodes.at(j);
        if (tempA === undefined || tempB === undefined) {
            throw new Error(`Index out of bounds: ${i}, ${j}`);
        }
        this.nodes[i] = tempB;
        this.nodes[j] = tempA;
    }
    shouldSwap(parentIndex, childIndex) {
        if (parentIndex < 0 || parentIndex >= this.size()) {
            return false;
        }
        if (childIndex < 0 || childIndex >= this.size()) {
            return false;
        }
        return this.compareAt(parentIndex, childIndex) > 0;
    }
    compareChildrenOf(parentIndex) {
        if (!this.hasLeftChild(parentIndex) && !this.hasRightChild(parentIndex)) {
            return -1;
        }
        const leftChildIndex = parentIndex * 2 + 1;
        const rightChildIndex = parentIndex * 2 + 2;
        if (!this.hasLeftChild(parentIndex)) {
            return rightChildIndex;
        }
        if (!this.hasRightChild(parentIndex)) {
            return leftChildIndex;
        }
        const compare = this.compareAt(leftChildIndex, rightChildIndex);
        return compare > 0 ? rightChildIndex : leftChildIndex;
    }
    bubbleUp(startIndex) {
        let childIndex = startIndex;
        let parentIndex = Math.floor((childIndex - 1) / 2);
        while (this.shouldSwap(parentIndex, childIndex)) {
            this.swap(parentIndex, childIndex);
            childIndex = parentIndex;
            parentIndex = Math.floor((childIndex - 1) / 2);
        }
    }
    bubbleDown(startIndex) {
        let parentIndex = startIndex;
        let childIndex = this.compareChildrenOf(parentIndex);
        while (this.shouldSwap(parentIndex, childIndex)) {
            this.swap(parentIndex, childIndex);
            parentIndex = childIndex;
            childIndex = this.compareChildrenOf(parentIndex);
        }
    }
    push(value) {
        this.nodes.push(value);
        this.bubbleUp(this.size() - 1);
        if (this.leaf === null || this.compare(value, this.leaf) > 0) {
            this.leaf = value;
        }
        return this;
    }
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        const root = this.peek();
        this.nodes[0] = this.nodes[this.size() - 1];
        this.nodes.pop();
        this.bubbleDown(0);
        if (root === this.leaf) {
            this.leaf = null;
        }
        return root;
    }
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.nodes.at(0) ?? null;
    }
    size() {
        return this.nodes.length;
    }
    isEmpty() {
        return this.size() === 0;
    }
    clear() {
        this.nodes = [];
        this.leaf = null;
    }
    *[Symbol.iterator]() {
        let size = this.size();
        while (size-- > 0) {
            yield this.pop();
        }
    }
}
exports.Heap = Heap;
