"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function PronounsPage({ currentUserPersonalDetails }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [isLoadingApp = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const currentPronouns = currentUserPersonalDetails?.pronouns ?? '';
    const currentPronounsKey = currentPronouns.substring(CONST_1.default.PRONOUNS.PREFIX.length);
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const isOptionSelected = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (isLoadingApp && !currentUserPersonalDetails.pronouns) {
            return;
        }
        const currentPronounsText = CONST_1.default.PRONOUNS_LIST.find((value) => value === currentPronounsKey);
        setSearchValue(currentPronounsText ? translate(`pronouns.${currentPronounsText}`) : '');
        // Only need to update search value when the first time the data is loaded
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isLoadingApp]);
    const filteredPronounsList = (0, react_1.useMemo)(() => {
        const pronouns = CONST_1.default.PRONOUNS_LIST.map((value) => {
            const fullPronounKey = `${CONST_1.default.PRONOUNS.PREFIX}${value}`;
            const isCurrentPronouns = fullPronounKey === currentPronouns;
            return {
                text: translate(`pronouns.${value}`),
                value: fullPronounKey,
                keyForList: value,
                isSelected: isCurrentPronouns,
            };
        }).sort((a, b) => localeCompare(a.text.toLowerCase(), b.text.toLowerCase()));
        const trimmedSearch = searchValue.trim();
        if (trimmedSearch.length === 0) {
            return [];
        }
        return pronouns.filter((pronoun) => pronoun.text.toLowerCase().indexOf(trimmedSearch.toLowerCase()) >= 0);
    }, [searchValue, currentPronouns, translate, localeCompare]);
    const headerMessage = searchValue.trim() && filteredPronounsList?.length === 0 ? translate('common.noResultsFound') : '';
    const updatePronouns = (selectedPronouns) => {
        if (isOptionSelected.current) {
            return;
        }
        isOptionSelected.current = true;
        (0, PersonalDetails_1.updatePronouns)(selectedPronouns.keyForList === currentPronounsKey ? '' : (selectedPronouns?.value ?? ''));
        Navigation_1.default.goBack();
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={PronounsPage.displayName}>
            {isLoadingApp && !currentUserPersonalDetails.pronouns ? (<FullscreenLoadingIndicator_1.default />) : (<>
                    <HeaderWithBackButton_1.default title={translate('pronounsPage.pronouns')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                    <Text_1.default style={[styles.ph5, styles.mb3]}>{translate('pronounsPage.isShownOnProfile')}</Text_1.default>
                    <SelectionList_1.default headerMessage={headerMessage} textInputLabel={translate('pronounsPage.pronouns')} textInputPlaceholder={translate('pronounsPage.placeholderText')} textInputValue={searchValue} sections={[{ data: filteredPronounsList }]} ListItem={RadioListItem_1.default} onSelectRow={updatePronouns} shouldSingleExecuteRowSelect onChangeText={setSearchValue} initiallyFocusedOptionKey={currentPronounsKey}/>
                </>)}
        </ScreenWrapper_1.default>);
}
PronounsPage.displayName = 'PronounsPage';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(PronounsPage);
