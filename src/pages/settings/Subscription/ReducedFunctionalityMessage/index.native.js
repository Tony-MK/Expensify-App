"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ReducedFunctionalityMessage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return <Text_1.default style={[styles.ph5, styles.pb5, styles.textSupporting]}>{translate('subscription.mobileReducedFunctionalityMessage')}</Text_1.default>;
}
ReducedFunctionalityMessage.displayName = 'ReducedFunctionalityMessage';
exports.default = ReducedFunctionalityMessage;
