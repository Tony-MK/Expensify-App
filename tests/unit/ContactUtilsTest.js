"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContactUtils_1 = require("@src/libs/ContactUtils");
const TestHelper_1 = require("../utils/TestHelper");
describe('ContactUtils', () => {
    describe('sortEmailObjects', () => {
        it('Should sort email objects with Expensify emails first', () => {
            const emails = [{ value: 'user2@gmail.com' }, { value: 'user2@expensify.com' }, { value: 'user1@gmail.com' }, { value: 'user1@expensify.com' }];
            const sortedEmails = (0, ContactUtils_1.sortEmailObjects)(emails, TestHelper_1.localeCompare);
            expect(sortedEmails).toEqual(['user1@expensify.com', 'user2@expensify.com', 'user1@gmail.com', 'user2@gmail.com']);
        });
    });
});
