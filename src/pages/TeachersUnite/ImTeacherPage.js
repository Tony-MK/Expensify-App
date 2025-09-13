"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var LoginUtils_1 = require("@libs/LoginUtils");
var ImTeacherUpdateEmailPage_1 = require("./ImTeacherUpdateEmailPage");
var IntroSchoolPrincipalPage_1 = require("./IntroSchoolPrincipalPage");
function ImTeacherPage() {
    var _a;
    var session = (0, OnyxListItemProvider_1.useSession)();
    var isLoggedInEmailPublicDomain = (0, LoginUtils_1.isEmailPublicDomain)((_a = session === null || session === void 0 ? void 0 : session.email) !== null && _a !== void 0 ? _a : '');
    return isLoggedInEmailPublicDomain ? <ImTeacherUpdateEmailPage_1.default /> : <IntroSchoolPrincipalPage_1.default />;
}
ImTeacherPage.displayName = 'ImTeacherPage';
exports.default = ImTeacherPage;
