"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountExistsError extends Error {
    constructor(accountExists) {
        super();
        // If accountExists is undefined, it means we couldn't determine the account status due to an unstable internet connection.
        this.translationKey = accountExists === undefined ? 'common.unstableInternetConnection' : 'testDrive.modal.employee.error';
    }
}
exports.default = AccountExistsError;
