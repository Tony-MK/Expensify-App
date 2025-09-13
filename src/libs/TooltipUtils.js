"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isProductTrainingElementDismissed(elementName, dismissedProductTraining) {
    return typeof dismissedProductTraining?.[elementName] === 'string' ? !!dismissedProductTraining?.[elementName] : !!dismissedProductTraining?.[elementName]?.timestamp;
}
exports.default = isProductTrainingElementDismissed;
