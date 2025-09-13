"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortEmailObjects = sortEmailObjects;
const CONST_1 = require("@src/CONST");
const OptionsListUtils_1 = require("./OptionsListUtils");
const RandomAvatarUtils_1 = require("./RandomAvatarUtils");
function sortEmailObjects(emails, localeCompare) {
    if (!emails?.length) {
        return [];
    }
    const expensifyDomain = CONST_1.default.EMAIL.EXPENSIFY_EMAIL_DOMAIN.toLowerCase();
    const filteredEmails = [];
    for (const email of emails) {
        if (email?.value) {
            filteredEmails.push(email.value);
        }
    }
    return filteredEmails.sort((a, b) => {
        const isExpensifyA = a.toLowerCase().includes(expensifyDomain);
        const isExpensifyB = b.toLowerCase().includes(expensifyDomain);
        // Prioritize Expensify emails, then sort alphabetically
        return isExpensifyA !== isExpensifyB ? Number(isExpensifyB) - Number(isExpensifyA) : localeCompare(a, b);
    });
}
const getContacts = (deviceContacts, localeCompare) => {
    return deviceContacts
        .map((contact) => {
        const email = sortEmailObjects(contact?.emailAddresses ?? [], localeCompare)?.at(0) ?? '';
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const avatarSource = (contact?.imageData || RandomAvatarUtils_1.default.getAvatarForContact(`${contact?.firstName}${email}${contact?.lastName}`)) ?? '';
        const phoneNumber = contact.phoneNumbers?.[0]?.value ?? '';
        const firstName = contact?.firstName ?? '';
        const lastName = contact?.lastName ?? '';
        return (0, OptionsListUtils_1.getUserToInviteContactOption)({
            selectedOptions: [],
            optionsToExclude: [],
            searchValue: email || phoneNumber || firstName || '',
            firstName,
            lastName,
            email,
            phone: phoneNumber,
            avatar: avatarSource,
        });
    })
        .filter((contact) => contact !== null);
};
exports.default = getContacts;
