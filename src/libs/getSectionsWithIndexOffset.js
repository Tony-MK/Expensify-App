"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getSectionsWithIndexOffset;
/**
 * Returns a list of sections with indexOffset
 */
function getSectionsWithIndexOffset(sections) {
    return sections.map((section, index) => {
        const indexOffset = [...sections].splice(0, index).reduce((acc, curr) => acc + (curr.data?.length ?? 0), 0);
        return { ...section, indexOffset };
    });
}
