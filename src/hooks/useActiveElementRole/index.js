"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ActiveElementRoleProvider_1 = require("@components/ActiveElementRoleProvider");
/**
 * Listens for the focusin and focusout events and sets the DOM activeElement to the state.
 * On native, we just return null.
 */
const useActiveElementRole = () => {
    const { role } = (0, react_1.useContext)(ActiveElementRoleProvider_1.ActiveElementRoleContext);
    return role;
};
exports.default = useActiveElementRole;
