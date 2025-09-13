"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CurrentUserPersonalDetailsProvider_1 = require("@components/CurrentUserPersonalDetailsProvider");
function useCurrentUserPersonalDetails() {
    return (0, react_1.useContext)(CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsContext);
}
exports.default = useCurrentUserPersonalDetails;
