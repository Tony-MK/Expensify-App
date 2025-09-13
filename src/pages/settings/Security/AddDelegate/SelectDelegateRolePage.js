"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SelectDelegateRolePage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const login = route.params.login;
    const styles = (0, useThemeStyles_1.default)();
    const roleOptions = Object.values(CONST_1.default.DELEGATE_ROLE).map((role) => ({
        value: role,
        text: translate('delegate.role', { role }),
        alternateText: translate('delegate.roleDescription', { role }),
        isSelected: role === route.params.role,
        keyForList: role,
    }));
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={SelectDelegateRolePage.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('delegate.accessLevel')} onBackButtonPress={() => Navigation_1.default.goBack(route.params?.backTo ?? ROUTES_1.default.SETTINGS_ADD_DELEGATE)}/>
                <SelectionList_1.default isAlternateTextMultilineSupported alternateTextNumberOfLines={4} initiallyFocusedOptionKey={roleOptions.find((role) => role.isSelected)?.keyForList} shouldUpdateFocusedIndex headerContent={<Text_1.default style={[styles.ph5, styles.pb5, styles.pt3]}>
                            <>
                                {translate('delegate.accessLevelDescription')}{' '}
                                <TextLink_1.default style={[styles.link]} href={CONST_1.default.COPILOT_HELP_URL}>
                                    {translate('common.learnMore')}
                                </TextLink_1.default>
                                .
                            </>
                        </Text_1.default>} onSelectRow={(option) => {
            Navigation_1.default.setParams({
                role: option.value,
            });
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DELEGATE_CONFIRM.getRoute(login, option.value));
        }} sections={[{ data: roleOptions }]} ListItem={RadioListItem_1.default}/>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
SelectDelegateRolePage.displayName = 'SelectDelegateRolePage';
exports.default = SelectDelegateRolePage;
