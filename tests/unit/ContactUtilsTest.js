"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContactUtils_1 = require("@src/libs/ContactUtils");
var TestHelper_1 = require("../utils/TestHelper");
describe('ContactUtils', function () {
    describe('sortEmailObjects', function () {
        it('Should sort email objects with Expensify emails first', function () {
            var emails = [{ value: 'user2@gmail.com' }, { value: 'user2@expensify.com' }, { value: 'user1@gmail.com' }, { value: 'user1@expensify.com' }];
            var sortedEmails = (0, ContactUtils_1.sortEmailObjects)(emails, TestHelper_1.localeCompare);
            expect(sortedEmails).toEqual(['user1@expensify.com', 'user2@expensify.com', 'user1@gmail.com', 'user2@gmail.com']);
        });
    });
});
