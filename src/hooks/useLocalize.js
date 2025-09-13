"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useLocalize;
const react_1 = require("react");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
function useLocalize() {
    return (0, react_1.useContext)(LocaleContextProvider_1.LocaleContext);
}
