"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
// Get the distance in meters from the transaction.
// This function is placed in a separate file to avoid circular dependencies.
function getDistanceInMeters(transaction, unit) {
    // If we are creating a new distance request, the distance is available in routes.route0.distance and it's already in meters.
    if (transaction?.routes?.route0?.distance) {
        return transaction.routes.route0.distance;
    }
    // If the request is completed, transaction.routes is cleared and comment.customUnit.quantity holds the new distance in the selected unit.
    // We need to convert it from the selected distance unit to meters.
    if (transaction?.comment?.customUnit?.quantity && unit) {
        return DistanceRequestUtils_1.default.convertToDistanceInMeters(transaction.comment.customUnit.quantity, unit);
    }
    return 0;
}
exports.default = getDistanceInMeters;
