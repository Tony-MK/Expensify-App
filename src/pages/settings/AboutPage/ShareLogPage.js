"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ShareLogList_1 = require("./ShareLogList");
function ShareLogPage({ route }) {
    return <ShareLogList_1.default logSource={route.params.source}/>;
}
exports.default = ShareLogPage;
