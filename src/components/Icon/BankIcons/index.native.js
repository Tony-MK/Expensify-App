"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getBankIcon;
const generic_bank_account_svg_1 = require("@assets/images/bank-icons/generic-bank-account.svg");
const generic_bank_card_svg_1 = require("@assets/images/cardicons/generic-bank-card.svg");
const BankIconsUtils_1 = require("@components/Icon/BankIconsUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
/**
 * Returns Bank Icon Object that matches to existing bank icons or default icons
 */
function getBankIcon({ styles, bankName, isCard = false }) {
    const bankIcon = {
        icon: isCard ? generic_bank_card_svg_1.default : generic_bank_account_svg_1.default,
    };
    if (bankName) {
        const bankNameKey = (0, BankIconsUtils_1.getBankNameKey)(bankName.toLowerCase());
        if (bankNameKey && Object.keys(CONST_1.default.BANK_NAMES).includes(bankNameKey)) {
            bankIcon.icon = (0, BankIconsUtils_1.getBankIconAsset)(bankNameKey, isCard);
        }
    }
    // For default Credit Card icon the icon size should not be set.
    if (!isCard) {
        bankIcon.iconSize = variables_1.default.iconSizeExtraLarge;
        bankIcon.iconStyles = [styles.bankIconContainer];
    }
    else {
        bankIcon.iconHeight = variables_1.default.cardIconHeight;
        bankIcon.iconWidth = variables_1.default.cardIconWidth;
        bankIcon.iconStyles = [styles.cardIcon];
    }
    return bankIcon;
}
