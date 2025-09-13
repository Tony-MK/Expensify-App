"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Android WebView is built on top of Chromium which is not supported by Xero causing the site to show warning.
 */
const getUAForWebView = () => 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.159 Mobile Safari/537.36';
exports.default = getUAForWebView;
