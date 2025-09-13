"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ThirdPartySignInPage_1 = require("@pages/signin/ThirdPartySignInPage");
const CONST_1 = require("@src/CONST");
function GoogleSignInDesktopPage() {
    return <ThirdPartySignInPage_1.default signInProvider={CONST_1.default.SIGN_IN_METHOD.GOOGLE}/>;
}
exports.default = GoogleSignInDesktopPage;
