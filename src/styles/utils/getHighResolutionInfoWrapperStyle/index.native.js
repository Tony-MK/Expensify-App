"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports
const spacing_1 = require("@styles/utils/spacing");
const getHighResolutionInfoWrapperStyle = (isUploaded) => ({
    ...spacing_1.default.ph8,
    ...spacing_1.default.pt5,
    ...(isUploaded ? spacing_1.default.pb5 : spacing_1.default.mbn1),
});
exports.default = getHighResolutionInfoWrapperStyle;
