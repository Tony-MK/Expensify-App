"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const LoginUtils_1 = require("@libs/LoginUtils");
const ImTeacherUpdateEmailPage_1 = require("./ImTeacherUpdateEmailPage");
const IntroSchoolPrincipalPage_1 = require("./IntroSchoolPrincipalPage");
function ImTeacherPage() {
    const session = (0, OnyxListItemProvider_1.useSession)();
    const isLoggedInEmailPublicDomain = (0, LoginUtils_1.isEmailPublicDomain)(session?.email ?? '');
    return isLoggedInEmailPublicDomain ? <ImTeacherUpdateEmailPage_1.default /> : <IntroSchoolPrincipalPage_1.default />;
}
ImTeacherPage.displayName = 'ImTeacherPage';
exports.default = ImTeacherPage;
