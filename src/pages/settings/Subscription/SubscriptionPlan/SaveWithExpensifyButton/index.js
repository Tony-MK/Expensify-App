"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const useLocalize_1 = require("@hooks/useLocalize");
const CONST_1 = require("@src/CONST");
function SaveWithExpensifyButton() {
    const { translate } = (0, useLocalize_1.default)();
    const onLinkPress = () => {
        react_native_1.Linking.openURL(CONST_1.default.SAVE_WITH_EXPENSIFY_URL);
    };
    return (<Button_1.default small text={translate('subscription.yourPlan.saveWithExpensifyButton')} onPress={onLinkPress}/>);
}
SaveWithExpensifyButton.displayName = 'SaveWithExpensifyButton';
exports.default = SaveWithExpensifyButton;
