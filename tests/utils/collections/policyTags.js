"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRandomPolicyTags;
const falso_1 = require("@ngneat/falso");
function createRandomPolicyTags(tagListName, numberOfTags = 0) {
    const tags = {};
    for (let i = 0; i < numberOfTags; i++) {
        const tagName = (0, falso_1.randWord)();
        tags[tagName] = {
            name: tagName,
            enabled: true,
        };
    }
    return {
        [tagListName]: {
            name: tagListName,
            orderWeight: 0,
            required: false,
            tags,
        },
    };
}
