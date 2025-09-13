"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TrieNode {
    constructor() {
        this.children = {};
        this.metaData = {};
        this.isEndOfWord = false;
    }
}
exports.default = TrieNode;
