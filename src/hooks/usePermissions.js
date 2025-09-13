"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePermissions;
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Permissions_1 = require("@libs/Permissions");
let permissionKey;
function usePermissions() {
    const betas = (0, react_1.useContext)(OnyxListItemProvider_1.BetasContext);
    const betaConfiguration = (0, react_1.useContext)(OnyxListItemProvider_1.BetaConfigurationContext);
    return (0, react_1.useMemo)(() => {
        const permissions = {
            isBetaEnabled: (beta) => Permissions_1.default.isBetaEnabled(beta, betas, betaConfiguration),
        };
        for (permissionKey in Permissions_1.default) {
            if (permissionKey !== 'isBetaEnabled') {
                const checkerFunction = Permissions_1.default[permissionKey];
                permissions[permissionKey] = checkerFunction();
            }
        }
        return permissions;
    }, [betas, betaConfiguration]);
}
