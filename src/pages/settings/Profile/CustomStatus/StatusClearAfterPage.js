"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
/**
 * @param data - either a value from CONST.CUSTOM_STATUS_TYPES or a dateTime string in the format YYYY-MM-DD HH:mm
 */
function getSelectedStatusType(data) {
    switch (data) {
        case DateUtils_1.default.getEndOfToday():
            return CONST_1.default.CUSTOM_STATUS_TYPES.AFTER_TODAY;
        case CONST_1.default.CUSTOM_STATUS_TYPES.NEVER:
        case '':
            return CONST_1.default.CUSTOM_STATUS_TYPES.NEVER;
        default:
            return CONST_1.default.CUSTOM_STATUS_TYPES.CUSTOM;
    }
}
const useValidateCustomDate = (data) => {
    const [customDateError, setCustomDateError] = (0, react_1.useState)('');
    const [customTimeError, setCustomTimeError] = (0, react_1.useState)('');
    const validate = () => {
        const { dateValidationErrorKey, timeValidationErrorKey } = (0, ValidationUtils_1.validateDateTimeIsAtLeastOneMinuteInFuture)(data);
        setCustomDateError(dateValidationErrorKey);
        setCustomTimeError(timeValidationErrorKey);
        return {
            dateError: dateValidationErrorKey,
            timeError: timeValidationErrorKey,
        };
    };
    (0, react_1.useEffect)(() => {
        if (!data) {
            return;
        }
        validate();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [data]);
    const validateCustomDate = () => validate();
    return { customDateError, customTimeError, validateCustomDate };
};
function StatusClearAfterPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const clearAfter = currentUserPersonalDetails.status?.clearAfter ?? '';
    const [customStatus] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT, { canBeMissing: true });
    const draftClearAfter = customStatus?.clearAfter ?? '';
    const [draftPeriod, setDraftPeriod] = (0, react_1.useState)(() => getSelectedStatusType(draftClearAfter || clearAfter));
    const statusType = (0, react_1.useMemo)(() => Object.entries(CONST_1.default.CUSTOM_STATUS_TYPES).map(([key, value]) => ({
        value,
        text: translate(`statusPage.timePeriods.${value}`),
        keyForList: key,
        isSelected: draftPeriod === value,
    })), [draftPeriod, translate]);
    const { customDateError, customTimeError } = useValidateCustomDate(draftClearAfter);
    const { redBrickDateIndicator, redBrickTimeIndicator } = (0, react_1.useMemo)(() => ({
        redBrickDateIndicator: customDateError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
        redBrickTimeIndicator: customTimeError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
    }), [customTimeError, customDateError]);
    const updateMode = (0, react_1.useCallback)((mode) => {
        if (mode.value === draftPeriod) {
            return;
        }
        setDraftPeriod(mode.value);
        if (mode.value === CONST_1.default.CUSTOM_STATUS_TYPES.CUSTOM) {
            (0, User_1.updateDraftCustomStatus)({ clearAfter: DateUtils_1.default.getOneHourFromNow() });
        }
        else {
            const selectedRange = statusType.find((item) => item.value === mode.value);
            const calculatedDraftDate = DateUtils_1.default.getDateFromStatusType(selectedRange?.value ?? CONST_1.default.CUSTOM_STATUS_TYPES.NEVER);
            (0, User_1.updateDraftCustomStatus)({ clearAfter: calculatedDraftDate });
            Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS);
        }
    }, [draftPeriod, statusType]);
    (0, react_1.useEffect)(() => {
        (0, User_1.updateDraftCustomStatus)({
            clearAfter: draftClearAfter || clearAfter,
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const customStatusDate = DateUtils_1.default.extractDate(draftClearAfter);
    const customStatusTime = DateUtils_1.default.extractTime12Hour(draftClearAfter);
    const listFooterContent = (0, react_1.useMemo)(() => {
        if (draftPeriod !== CONST_1.default.CUSTOM_STATUS_TYPES.CUSTOM) {
            return;
        }
        return (<>
                <MenuItemWithTopDescription_1.default title={customStatusDate} description={translate('statusPage.date')} shouldShowRightIcon containerStyle={styles.pr2} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER_DATE)} errorText={customDateError} titleStyle={styles.flex1} brickRoadIndicator={redBrickDateIndicator}/>
                <MenuItemWithTopDescription_1.default title={customStatusTime} description={translate('statusPage.time')} shouldShowRightIcon containerStyle={styles.pr2} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER_TIME)} errorText={customTimeError} titleStyle={styles.flex1} brickRoadIndicator={redBrickTimeIndicator}/>
            </>);
    }, [translate, styles.pr2, styles.flex1, customStatusDate, customStatusTime, draftPeriod, redBrickDateIndicator, redBrickTimeIndicator, customDateError, customTimeError]);
    const timePeriodOptions = (0, react_1.useCallback)(() => (<SelectionList_1.default sections={[{ data: statusType }]} ListItem={RadioListItem_1.default} onSelectRow={updateMode} initiallyFocusedOptionKey={statusType.find((status) => status.isSelected)?.keyForList} listFooterContent={listFooterContent}/>), [statusType, updateMode, listFooterContent]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom shouldEnableMaxHeight testID={StatusClearAfterPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('statusPage.clearAfter')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS)}/>
            <Text_1.default style={[styles.textNormal, styles.mh5, styles.mv4]}>{translate('statusPage.whenClearStatus')}</Text_1.default>
            {timePeriodOptions()}
        </ScreenWrapper_1.default>);
}
StatusClearAfterPage.displayName = 'StatusClearAfterPage';
exports.default = StatusClearAfterPage;
