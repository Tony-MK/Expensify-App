"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAddCardToWallet = handleAddCardToWallet;
exports.isCardInWallet = isCardInWallet;
exports.checkIfWalletIsAvailable = checkIfWalletIsAvailable;
const react_native_wallet_1 = require("@expensify/react-native-wallet");
const Wallet_1 = require("@libs/actions/Wallet");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
function checkIfWalletIsAvailable() {
    return (0, react_native_wallet_1.checkWalletAvailability)();
}
function handleAddCardToWallet(card, cardHolderName, cardDescription) {
    const data = {
        network: CONST_1.default.COMPANY_CARDS.CARD_TYPE.VISA,
        lastDigits: card.lastFourPAN,
        cardDescription,
        cardHolderName,
    };
    return (0, react_native_wallet_1.addCardToAppleWallet)(data, Wallet_1.issuerEncryptPayloadCallback);
}
function isCardInWallet(card) {
    const panReferenceID = card.nameValuePairs?.expensifyCard_panReferenceID;
    if (!panReferenceID) {
        return Promise.resolve(false);
    }
    let callback = null;
    if (card.token) {
        callback = (0, react_native_wallet_1.getCardStatusByIdentifier)(panReferenceID, CONST_1.default.COMPANY_CARDS.CARD_TYPE.VISA);
    }
    else if (card.lastFourPAN) {
        callback = (0, react_native_wallet_1.getCardStatusBySuffix)(card.lastFourPAN);
    }
    if (callback) {
        return callback
            .then((status) => {
            Log_1.default.info(`Card status: ${status}`);
            return status === 'active';
        })
            .catch((e) => {
            Log_1.default.warn(`isCardInWallet error: ${e}`);
            return Promise.resolve(false);
        });
    }
    return Promise.resolve(false);
}
