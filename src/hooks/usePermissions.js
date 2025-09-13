"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePermissions;
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var Permissions_1 = require("@libs/Permissions");
var permissionKey;
function usePermissions() {
    var betas = (0, react_1.useContext)(OnyxListItemProvider_1.BetasContext);
    var betaConfiguration = (0, react_1.useContext)(OnyxListItemProvider_1.BetaConfigurationContext);
    return (0, react_1.useMemo)(function () {
        var permissions = {
            isBetaEnabled: function (beta) { return Permissions_1.default.isBetaEnabled(beta, betas, betaConfiguration); },
        };
        for (permissionKey in Permissions_1.default) {
            if (permissionKey !== 'isBetaEnabled') {
                var checkerFunction = Permissions_1.default[permissionKey];
                permissions[permissionKey] = checkerFunction();
            }
        }
        return permissions;
    }, [betas, betaConfiguration]);
}
