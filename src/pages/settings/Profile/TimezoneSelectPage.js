"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useInitialValue_1 = require("@hooks/useInitialValue");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetails = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const TIMEZONES_1 = require("@src/TIMEZONES");
/**
 * We add the current time to the key to fix a bug where the list options don't update unless the key is updated.
 */
const getKey = (text) => `${text}-${new Date().getTime()}`;
const getUserTimezone = (currentUserPersonalDetails) => currentUserPersonalDetails?.timezone ?? CONST_1.default.DEFAULT_TIME_ZONE;
function TimezoneSelectPage({ currentUserPersonalDetails }) {
    const { translate } = (0, useLocalize_1.default)();
    const timezone = getUserTimezone(currentUserPersonalDetails);
    const allTimezones = (0, useInitialValue_1.default)(() => TIMEZONES_1.default.filter((tz) => !tz.startsWith('Etc/GMT')).map((text) => ({
        text,
        keyForList: getKey(text),
        isSelected: text === timezone.selected,
    })));
    const [timezoneInputText, setTimezoneInputText] = (0, react_1.useState)('');
    const [timezoneOptions, setTimezoneOptions] = (0, react_1.useState)(allTimezones);
    const saveSelectedTimezone = ({ text }) => {
        PersonalDetails.updateSelectedTimezone(text);
    };
    const filterShownTimezones = (searchText) => {
        setTimezoneInputText(searchText);
        const searchWords = searchText.toLowerCase().match(/[a-z0-9]+/g) ?? [];
        setTimezoneOptions(allTimezones.filter((tz) => searchWords.every((word) => tz.text
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ' ')
            .includes(word))));
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={TimezoneSelectPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('timezonePage.timezone')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_TIMEZONE)}/>
            <SelectionList_1.default headerMessage={timezoneInputText.trim() && !timezoneOptions.length ? translate('common.noResultsFound') : ''} textInputLabel={translate('timezonePage.timezone')} textInputValue={timezoneInputText} onChangeText={filterShownTimezones} onSelectRow={saveSelectedTimezone} shouldSingleExecuteRowSelect sections={[{ data: timezoneOptions, isDisabled: timezone.automatic }]} initiallyFocusedOptionKey={timezoneOptions.find((tz) => tz.text === timezone.selected)?.keyForList} showScrollIndicator shouldShowTooltips={false} ListItem={RadioListItem_1.default} shouldPreventActiveCellVirtualization/>
        </ScreenWrapper_1.default>);
}
TimezoneSelectPage.displayName = 'TimezoneSelectPage';
exports.default = (0, withCurrentUserPersonalDetails_1.default)(TimezoneSelectPage);
