"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We need to set paddingVertical = 0 on web to avoid displaying a normal pointer on some parts of compose box when not in focus
const containerComposeStyles = (styles) => [styles.textInputComposeSpacing, { paddingVertical: 0 }];
exports.default = containerComposeStyles;
