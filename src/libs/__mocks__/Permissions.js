"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This module is mocked in tests because all the permission methods call canUseAllBetas() and that will
 * always return true because Environment.isDevelopment() is always true when running tests. It's not possible
 * to mock canUseAllBetas() directly because it's not an exported method and we don't want to export it just
 * so it can be mocked.
 */
exports.default = {
    ...jest.requireActual('../Permissions'),
    isBetaEnabled: (beta, betas) => !!betas?.includes(beta),
};
