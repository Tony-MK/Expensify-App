"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRandomPolicyCategories;
const falso_1 = require("@ngneat/falso");
function createRandomPolicyCategories(numberOfCategories = 0) {
    const categories = {};
    for (let i = 0; i < numberOfCategories; i++) {
        const categoryName = (0, falso_1.randWord)();
        categories[categoryName] = {
            name: categoryName,
            enabled: false,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'GL Code': '',
            unencodedName: categoryName,
            externalID: '',
            areCommentsRequired: false,
            origin: '',
        };
    }
    return categories;
}
