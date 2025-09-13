"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const goToSettings_1 = require("@libs/goToSettings");
function ImportContactButton({ showImportContacts, inputHelperText, isInSearch = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return showImportContacts && inputHelperText ? (<react_native_1.View style={[styles.ph5, styles.pb5, styles.flexRow]}>
            <Text_1.default style={[styles.textLabel, styles.colorMuted, styles.minHeight5]}>
                {isInSearch ? `${translate('common.noResultsFound')}. ` : null}
                <Text_1.default style={[styles.textLabel, styles.minHeight5, styles.link]} onPress={goToSettings_1.default}>
                    {translate('contact.importContactsTitle')}
                </Text_1.default>{' '}
                {translate('contact.importContactsExplanation')}
            </Text_1.default>
        </react_native_1.View>) : null;
}
ImportContactButton.displayName = 'ImportContactButton';
exports.default = ImportContactButton;
