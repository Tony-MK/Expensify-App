"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_wallet_1 = require("@expensify/react-native-wallet");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const index_1 = require("@libs/Wallet/index");
const CONST_1 = require("@src/CONST");
function AddToWalletButton({ card, cardHolderName, cardDescription, buttonStyle }) {
    const [isWalletAvailable, setIsWalletAvailable] = react_1.default.useState(false);
    const [isInWallet, setIsInWallet] = react_1.default.useState(null);
    const { translate } = (0, useLocalize_1.default)();
    const isCardAvailable = card.state === CONST_1.default.EXPENSIFY_CARD.STATE.OPEN;
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const theme = (0, useTheme_1.default)();
    const platform = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS ? 'Apple' : 'Google';
    const styles = (0, useThemeStyles_1.default)();
    const checkIfCardIsInWallet = (0, react_1.useCallback)(() => {
        (0, index_1.isCardInWallet)(card)
            .then((result) => {
            setIsInWallet(result);
        })
            .catch(() => {
            setIsInWallet(false);
        })
            .finally(() => {
            setIsLoading(false);
        });
    }, [card]);
    const handleOnPress = (0, react_1.useCallback)(() => {
        setIsLoading(true);
        (0, index_1.handleAddCardToWallet)(card, cardHolderName, cardDescription, () => setIsLoading(false))
            .then((status) => {
            if (status === 'success') {
                Log_1.default.info('Card added to wallet');
                (0, PaymentMethods_1.openWalletPage)();
            }
            else {
                setIsLoading(false);
            }
        })
            .catch((error) => {
            setIsLoading(false);
            Log_1.default.warn(`Error while adding card to wallet: ${error}`);
            react_native_1.Alert.alert('Failed to add card to wallet', 'Please try again later.');
        });
    }, [card, cardDescription, cardHolderName]);
    (0, react_1.useEffect)(() => {
        if (!isCardAvailable) {
            return;
        }
        checkIfCardIsInWallet();
    }, [checkIfCardIsInWallet, isCardAvailable, card]);
    (0, react_1.useEffect)(() => {
        if (!isCardAvailable) {
            return;
        }
        (0, index_1.checkIfWalletIsAvailable)()
            .then((result) => {
            setIsWalletAvailable(result);
        })
            .catch(() => {
            setIsWalletAvailable(false);
        });
    }, [isCardAvailable]);
    if (!isWalletAvailable || isInWallet == null || !isCardAvailable) {
        return null;
    }
    if (isLoading) {
        return (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} color={theme.spinner}/>);
    }
    if (isInWallet) {
        return (<react_native_1.View style={buttonStyle}>
                <Text_1.default style={[styles.textLabelSupporting, styles.mt6]}>{translate('cardPage.cardAddedToWallet', { platform })}</Text_1.default>
            </react_native_1.View>);
    }
    return (<react_native_wallet_1.AddToWalletButton buttonStyle={buttonStyle} locale="en" onPress={handleOnPress}/>);
}
AddToWalletButton.displayName = 'AddToWalletButton';
exports.default = AddToWalletButton;
