"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CurrentUserPersonalDetailsProvider_1 = require("@components/CurrentUserPersonalDetailsProvider");
function useCurrentUserPersonalDetails() {
    return (0, react_1.useContext)(CurrentUserPersonalDetailsProvider_1.CurrentUserPersonalDetailsContext);
}
exports.default = useCurrentUserPersonalDetails;
