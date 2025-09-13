"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelistedReportKeys_1 = require("@src/types/utils/whitelistedReportKeys");
// This test is mainly to avoid that the testReportKeys is not removed or changed to false
describe('whitelistedReportKeys', () => {
    it('testReportKeys must be true', () => {
        expect(whitelistedReportKeys_1.default).toBe(true);
    });
});
