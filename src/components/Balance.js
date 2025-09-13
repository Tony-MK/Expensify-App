"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils = require("@libs/CurrencyUtils");
const Text_1 = require("./Text");
function Balance({ textStyles, balance }) {
    const styles = (0, useThemeStyles_1.default)();
    const formattedBalance = CurrencyUtils.convertToDisplayString(balance);
    return <Text_1.default style={[styles.textHeadline, styles.textXXXLarge, textStyles]}>{formattedBalance}</Text_1.default>;
}
Balance.displayName = 'Balance';
exports.default = Balance;
