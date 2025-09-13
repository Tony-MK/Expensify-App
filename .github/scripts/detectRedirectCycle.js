"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parse_1 = require("csv-parse");
const fs_1 = require("fs");
const parser = (0, csv_parse_1.parse)();
const adjacencyList = {};
const visited = new Map();
const backEdges = new Map();
function addEdge(source, target) {
    if (!adjacencyList[source]) {
        adjacencyList[source] = [];
    }
    adjacencyList[source].push(target);
}
function isCyclic(currentNode) {
    visited.set(currentNode, true);
    backEdges.set(currentNode, true);
    // Do a depth first search for all the neighbours. If a node is found in backedge, a cycle is detected.
    const neighbours = adjacencyList[currentNode];
    if (neighbours) {
        for (const node of neighbours) {
            if (!visited.has(node)) {
                if (isCyclic(node)) {
                    return true;
                }
            }
            else if (backEdges.has(node)) {
                return true;
            }
        }
    }
    backEdges.delete(currentNode);
    return false;
}
function detectCycle() {
    for (const [node] of Object.entries(adjacencyList)) {
        if (!visited.has(node)) {
            if (isCyclic(node)) {
                const cycle = Array.from(backEdges.keys());
                console.log(`Infinite redirect found in the cycle: ${cycle.join(' -> ')} -> ${node}`);
                return true;
            }
        }
    }
    return false;
}
fs_1.default.createReadStream(`${process.cwd()}/docs/redirects.csv`)
    .pipe(parser)
    .on('data', (row) => {
    // Create a directed graph of sourceURL -> targetURL
    addEdge(row[0], row[1]);
})
    .on('end', () => {
    if (detectCycle()) {
        process.exit(1);
    }
    process.exit(0);
});
