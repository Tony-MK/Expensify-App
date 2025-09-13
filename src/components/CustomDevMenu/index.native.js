"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const TestTool_1 = require("@userActions/TestTool");
const CustomDevMenu = Object.assign(() => {
    (0, react_1.useEffect)(() => {
        react_native_1.DevSettings.addMenuItem('Open Test Preferences', TestTool_1.default);
    }, []);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
}, {
    displayName: 'CustomDevMenu',
});
exports.default = CustomDevMenu;
