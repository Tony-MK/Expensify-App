"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PersonalInfo_1 = require("./PersonalInfo/PersonalInfo");
const VerifyIdentity_1 = require("./VerifyIdentity/VerifyIdentity");
function RequestorStep({ shouldShowOnfido, onBackButtonPress }, ref) {
    if (shouldShowOnfido) {
        return <VerifyIdentity_1.default onBackButtonPress={onBackButtonPress}/>;
    }
    return (<PersonalInfo_1.default ref={ref} onBackButtonPress={onBackButtonPress}/>);
}
RequestorStep.displayName = 'RequestorStep';
exports.default = (0, react_1.forwardRef)(RequestorStep);
