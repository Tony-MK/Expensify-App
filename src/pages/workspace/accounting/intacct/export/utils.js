"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultVendorName = getDefaultVendorName;
function getDefaultVendorName(defaultVendor, vendors) {
    return (vendors ?? []).find((vendor) => vendor.id === defaultVendor)?.value ?? defaultVendor;
}
