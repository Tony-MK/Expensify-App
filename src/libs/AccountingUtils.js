"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionNameFromRouteParam = getConnectionNameFromRouteParam;
exports.getRouteParamForConnection = getRouteParamForConnection;
const CONST_1 = require("@src/CONST");
const ROUTE_NAME_MAPPING = {
    [CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBO]: CONST_1.default.POLICY.CONNECTIONS.NAME.QBO,
    [CONST_1.default.POLICY.CONNECTIONS.ROUTE.XERO]: CONST_1.default.POLICY.CONNECTIONS.NAME.XERO,
    [CONST_1.default.POLICY.CONNECTIONS.ROUTE.SAGE_INTACCT]: CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT,
    [CONST_1.default.POLICY.CONNECTIONS.ROUTE.NETSUITE]: CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE,
    [CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBD]: CONST_1.default.POLICY.CONNECTIONS.NAME.QBD,
};
const NAME_ROUTE_MAPPING = {
    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBO,
    [CONST_1.default.POLICY.CONNECTIONS.NAME.XERO]: CONST_1.default.POLICY.CONNECTIONS.ROUTE.XERO,
    [CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT]: CONST_1.default.POLICY.CONNECTIONS.ROUTE.SAGE_INTACCT,
    [CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE]: CONST_1.default.POLICY.CONNECTIONS.ROUTE.NETSUITE,
    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBD,
};
function getConnectionNameFromRouteParam(routeParam) {
    return ROUTE_NAME_MAPPING[routeParam];
}
function getRouteParamForConnection(connectionName) {
    return NAME_ROUTE_MAPPING[connectionName];
}
