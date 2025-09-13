"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddCardToWallet = handleAddCardToWallet;
exports.isCardInWallet = isCardInWallet;
exports.checkIfWalletIsAvailable = checkIfWalletIsAvailable;
const react_native_wallet_1 = require("@expensify/react-native-wallet");
const Wallet_1 = require("@libs/actions/Wallet");
const Log_1 = require("@libs/Log");
function checkIfWalletIsAvailable() {
    return (0, react_native_wallet_1.checkWalletAvailability)();
}
function handleAddCardToWallet(card, cardHolderName) {
    return (0, react_native_wallet_1.getSecureWalletInfo)().then((walletData) => (0, Wallet_1.createDigitalGoogleWallet)({ cardID: card.cardID, cardHolderName, ...walletData }).then((cardData) => (0, react_native_wallet_1.addCardToGoogleWallet)(cardData)));
}
function isCardInWallet(card) {
    if (!card.lastFourPAN) {
        return Promise.resolve(false);
    }
    return (0, react_native_wallet_1.getCardStatusBySuffix)(card.lastFourPAN)
        .then((status) => {
        Log_1.default.info(`Card status: ${status}`);
        return status === 'active';
    })
        .catch((error) => {
        Log_1.default.warn(`getCardTokenStatus error: ${error}`);
        return false;
    });
}
