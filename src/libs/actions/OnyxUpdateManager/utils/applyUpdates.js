"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyUpdates = void 0;
const OnyxUpdates = require("@userActions/OnyxUpdates");
// This function applies a list of updates to Onyx in order and resolves when all updates have been applied
const applyUpdates = (updates) => Promise.all(Object.values(updates).map((update) => OnyxUpdates.apply(update)));
exports.applyUpdates = applyUpdates;
