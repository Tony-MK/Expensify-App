"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmojiPickerButtonDropdown_1 = require("@components/EmojiPicker/EmojiPickerButtonDropdown");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderPageLayout_1 = require("@components/HeaderPageLayout");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const DateUtils_1 = require("@libs/DateUtils");
const focusAfterModalClose_1 = require("@libs/focusAfterModalClose");
const focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const User_1 = require("@userActions/User");
const VacationDelegate_1 = require("@userActions/VacationDelegate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const SettingsStatusSetForm_1 = require("@src/types/form/SettingsStatusSetForm");
const initialEmoji = '💬';
function StatusPage() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [draftStatus] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT, { canBeMissing: true });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const formRef = (0, react_1.useRef)(null);
    const [brickRoadIndicator, setBrickRoadIndicator] = (0, react_1.useState)();
    const [vacationDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, { canBeMissing: true });
    const hasVacationDelegate = !!vacationDelegate?.delegate;
    const vacationDelegatePersonalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(vacationDelegate?.delegate ?? '');
    const formattedDelegateLogin = (0, LocalePhoneNumber_1.formatPhoneNumber)(vacationDelegatePersonalDetails?.login ?? '');
    const currentUserEmojiCode = currentUserPersonalDetails?.status?.emojiCode ?? '';
    const currentUserStatusText = currentUserPersonalDetails?.status?.text ?? '';
    const currentUserClearAfter = currentUserPersonalDetails?.status?.clearAfter ?? '';
    const draftEmojiCode = draftStatus?.emojiCode;
    const draftText = draftStatus?.text;
    const draftClearAfter = draftStatus?.clearAfter;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const defaultEmoji = draftEmojiCode || currentUserEmojiCode;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const defaultText = draftText || currentUserStatusText;
    const customClearAfter = (0, react_1.useMemo)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const dataToShow = draftClearAfter || currentUserClearAfter;
        return DateUtils_1.default.getLocalizedTimePeriodDescription(dataToShow);
    }, [draftClearAfter, currentUserClearAfter]);
    const isValidClearAfterDate = (0, react_1.useCallback)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const clearAfterTime = draftClearAfter || currentUserClearAfter;
        if (clearAfterTime === CONST_1.default.CUSTOM_STATUS_TYPES.NEVER || clearAfterTime === '') {
            return true;
        }
        return DateUtils_1.default.isTimeAtLeastOneMinuteInFuture({ dateTimeString: clearAfterTime });
    }, [draftClearAfter, currentUserClearAfter]);
    const navigateBackToPreviousScreenTask = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => () => {
        if (!navigateBackToPreviousScreenTask.current) {
            return;
        }
        navigateBackToPreviousScreenTask.current.cancel();
    }, []);
    const navigateBackToPreviousScreen = (0, react_1.useCallback)(() => Navigation_1.default.goBack(), []);
    const updateStatus = (0, react_1.useCallback)(({ emojiCode, statusText }) => {
        if (navigateBackToPreviousScreenTask.current) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const clearAfterTime = draftClearAfter || currentUserClearAfter || CONST_1.default.CUSTOM_STATUS_TYPES.NEVER;
        const isValid = DateUtils_1.default.isTimeAtLeastOneMinuteInFuture({ dateTimeString: clearAfterTime });
        if (!isValid && clearAfterTime !== CONST_1.default.CUSTOM_STATUS_TYPES.NEVER) {
            setBrickRoadIndicator(isValidClearAfterDate() ? undefined : CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR);
            return;
        }
        (0, User_1.updateCustomStatus)({
            text: statusText,
            emojiCode: !emojiCode && statusText ? initialEmoji : emojiCode,
            clearAfter: clearAfterTime !== CONST_1.default.CUSTOM_STATUS_TYPES.NEVER ? clearAfterTime : '',
        });
        navigateBackToPreviousScreenTask.current = react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, User_1.clearDraftCustomStatus)();
            navigateBackToPreviousScreen();
        });
    }, [currentUserClearAfter, draftClearAfter, isValidClearAfterDate, navigateBackToPreviousScreen]);
    const clearStatus = () => {
        if (navigateBackToPreviousScreenTask.current) {
            return;
        }
        (0, User_1.clearCustomStatus)();
        (0, User_1.updateDraftCustomStatus)({
            text: '',
            emojiCode: '',
            clearAfter: DateUtils_1.default.getEndOfToday(),
        });
        formRef.current?.resetForm({ [SettingsStatusSetForm_1.default.EMOJI_CODE]: '' });
        navigateBackToPreviousScreenTask.current = react_native_1.InteractionManager.runAfterInteractions(() => {
            navigateBackToPreviousScreen();
        });
    };
    (0, react_1.useEffect)(() => setBrickRoadIndicator(isValidClearAfterDate() ? undefined : CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR), [isValidClearAfterDate]);
    (0, react_1.useEffect)(() => {
        if (!currentUserEmojiCode && !currentUserClearAfter && !draftClearAfter) {
            (0, User_1.updateDraftCustomStatus)({ clearAfter: DateUtils_1.default.getEndOfToday() });
        }
        else {
            (0, User_1.updateDraftCustomStatus)({ clearAfter: currentUserClearAfter });
        }
        return () => (0, User_1.clearDraftCustomStatus)();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const validateForm = (0, react_1.useCallback)(({ statusText }) => {
        if (brickRoadIndicator) {
            return { clearAfter: '' };
        }
        const errors = {};
        if (statusText.length > CONST_1.default.STATUS_TEXT_MAX_LENGTH) {
            errors[SettingsStatusSetForm_1.default.STATUS_TEXT] = translate('common.error.characterLimitExceedCounter', {
                length: statusText.length,
                limit: CONST_1.default.STATUS_TEXT_MAX_LENGTH,
            });
        }
        return errors;
    }, [brickRoadIndicator, translate]);
    const { inputCallbackRef, inputRef } = (0, useAutoFocusInput_1.default)();
    const fallbackVacationDelegateLogin = formattedDelegateLogin === '' ? vacationDelegate?.delegate : formattedDelegateLogin;
    return (<ScreenWrapper_1.default style={[StyleUtils.getBackgroundColorStyle(theme.PAGE_THEMES[SCREENS_1.default.SETTINGS.PROFILE.STATUS].backgroundColor)]} shouldEnablePickerAvoiding={false} includeSafeAreaPaddingBottom testID={HeaderPageLayout_1.default.displayName} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('statusPage.status')} onBackButtonPress={navigateBackToPreviousScreen}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.SETTINGS_STATUS_SET_FORM} style={[styles.flexGrow1, styles.flex1]} ref={formRef} submitButtonText={translate('statusPage.save')} submitButtonStyles={[styles.mh5, styles.flexGrow1]} onSubmit={updateStatus} validate={validateForm} enabledWhenOffline shouldScrollToEnd>
                <react_native_1.View style={[styles.mh5, styles.mv1]}>
                    <Text_1.default style={[styles.textNormal, styles.mt2]}>{translate('statusPage.statusExplanation')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mb2, styles.mt4]}>
                    <react_native_1.View style={[styles.mb4, styles.ph5]}>
                        <InputWrapper_1.default InputComponent={EmojiPickerButtonDropdown_1.default} inputID={SettingsStatusSetForm_1.default.EMOJI_CODE} accessibilityLabel={SettingsStatusSetForm_1.default.EMOJI_CODE} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultEmoji} style={styles.mb3} onModalHide={() => {
            // On mobile Chrome, the input will blur immediately upon focus if the focus function is called right after the modal closes, even though the modal has fully closed.
            // Therefore, use the `focusComposerWithDelay` helper as used in `ComposerWithSuggestions` for this case.
            if ((0, Browser_1.isMobileChrome)()) {
                (0, focusComposerWithDelay_1.default)(inputRef.current)(true);
            }
            else {
                (0, focusAfterModalClose_1.default)(inputRef.current);
            }
        }} 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onInputChange={(emoji) => { }}/>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={SettingsStatusSetForm_1.default.STATUS_TEXT} role={CONST_1.default.ROLE.PRESENTATION} label={translate('statusPage.message')} accessibilityLabel={SettingsStatusSetForm_1.default.STATUS_TEXT} defaultValue={defaultText}/>
                    </react_native_1.View>
                    <MenuItemWithTopDescription_1.default title={customClearAfter} description={translate('statusPage.clearAfter')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER)} containerStyle={styles.pr2} brickRoadIndicator={brickRoadIndicator}/>
                    {(!!currentUserEmojiCode || !!currentUserStatusText) && (<MenuItem_1.default title={translate('statusPage.clearStatus')} titleStyle={styles.ml0} icon={Expensicons.Trashcan} onPress={clearStatus} iconFill={theme.danger} wrapperStyle={[styles.pl2]}/>)}
                </react_native_1.View>
                <react_native_1.View style={[styles.mb2, styles.mt6]}>
                    <Text_1.default style={[styles.mh5]}>{translate('statusPage.setVacationDelegate')}</Text_1.default>
                    {hasVacationDelegate && <Text_1.default style={[styles.mh5, styles.mt6, styles.mutedTextLabel]}>{translate('statusPage.vacationDelegate')}</Text_1.default>}
                    {hasVacationDelegate ? (<OfflineWithFeedback_1.default pendingAction={vacationDelegate?.pendingAction} errors={vacationDelegate?.errors} errorRowStyles={styles.mh5} onClose={() => (0, VacationDelegate_1.clearVacationDelegateError)(vacationDelegate?.previousDelegate)}>
                            <MenuItem_1.default title={vacationDelegatePersonalDetails?.displayName ?? fallbackVacationDelegateLogin} description={fallbackVacationDelegateLogin} avatarID={vacationDelegatePersonalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID} icon={vacationDelegatePersonalDetails?.avatar ?? Expensicons.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} numberOfLinesDescription={1} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_VACATION_DELEGATE)} containerStyle={styles.pr2}/>
                        </OfflineWithFeedback_1.default>) : (<react_native_1.View style={[styles.mt1]}>
                            <MenuItem_1.default description={translate('statusPage.vacationDelegate')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_VACATION_DELEGATE)} containerStyle={styles.pr2}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
StatusPage.displayName = 'StatusPage';
exports.default = StatusPage;
