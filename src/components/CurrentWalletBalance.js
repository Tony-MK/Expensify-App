"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Balance_1 = require("./Balance");
function CurrentWalletBalance({ balanceStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET);
    return (<Balance_1.default textStyles={[styles.pv5, styles.alignSelfCenter, balanceStyles]} balance={userWallet?.currentBalance ?? 0}/>);
}
CurrentWalletBalance.displayName = 'CurrentWalletBalance';
exports.default = CurrentWalletBalance;
