"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var EmojiPickerButtonDropdown_1 = require("@components/EmojiPicker/EmojiPickerButtonDropdown");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var HeaderPageLayout_1 = require("@components/HeaderPageLayout");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var MenuItem_1 = require("@components/MenuItem");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var Text_1 = require("@components/Text");
var TextInput_1 = require("@components/TextInput");
var useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Browser_1 = require("@libs/Browser");
var DateUtils_1 = require("@libs/DateUtils");
var focusAfterModalClose_1 = require("@libs/focusAfterModalClose");
var focusComposerWithDelay_1 = require("@libs/focusComposerWithDelay");
var LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var User_1 = require("@userActions/User");
var VacationDelegate_1 = require("@userActions/VacationDelegate");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SCREENS_1 = require("@src/SCREENS");
var SettingsStatusSetForm_1 = require("@src/types/form/SettingsStatusSetForm");
var initialEmoji = '💬';
function StatusPage() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var draftStatus = (0, useOnyx_1.default)(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT, { canBeMissing: true })[0];
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var formRef = (0, react_1.useRef)(null);
    var _m = (0, react_1.useState)(), brickRoadIndicator = _m[0], setBrickRoadIndicator = _m[1];
    var vacationDelegate = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, { canBeMissing: true })[0];
    var hasVacationDelegate = !!(vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate);
    var vacationDelegatePersonalDetails = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)((_a = vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate) !== null && _a !== void 0 ? _a : '');
    var formattedDelegateLogin = (0, LocalePhoneNumber_1.formatPhoneNumber)((_b = vacationDelegatePersonalDetails === null || vacationDelegatePersonalDetails === void 0 ? void 0 : vacationDelegatePersonalDetails.login) !== null && _b !== void 0 ? _b : '');
    var currentUserEmojiCode = (_d = (_c = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.status) === null || _c === void 0 ? void 0 : _c.emojiCode) !== null && _d !== void 0 ? _d : '';
    var currentUserStatusText = (_f = (_e = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.status) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : '';
    var currentUserClearAfter = (_h = (_g = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.status) === null || _g === void 0 ? void 0 : _g.clearAfter) !== null && _h !== void 0 ? _h : '';
    var draftEmojiCode = draftStatus === null || draftStatus === void 0 ? void 0 : draftStatus.emojiCode;
    var draftText = draftStatus === null || draftStatus === void 0 ? void 0 : draftStatus.text;
    var draftClearAfter = draftStatus === null || draftStatus === void 0 ? void 0 : draftStatus.clearAfter;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var defaultEmoji = draftEmojiCode || currentUserEmojiCode;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var defaultText = draftText || currentUserStatusText;
    var customClearAfter = (0, react_1.useMemo)(function () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        var dataToShow = draftClearAfter || currentUserClearAfter;
        return DateUtils_1.default.getLocalizedTimePeriodDescription(dataToShow);
    }, [draftClearAfter, currentUserClearAfter]);
    var isValidClearAfterDate = (0, react_1.useCallback)(function () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        var clearAfterTime = draftClearAfter || currentUserClearAfter;
        if (clearAfterTime === CONST_1.default.CUSTOM_STATUS_TYPES.NEVER || clearAfterTime === '') {
            return true;
        }
        return DateUtils_1.default.isTimeAtLeastOneMinuteInFuture({ dateTimeString: clearAfterTime });
    }, [draftClearAfter, currentUserClearAfter]);
    var navigateBackToPreviousScreenTask = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () { return function () {
        if (!navigateBackToPreviousScreenTask.current) {
            return;
        }
        navigateBackToPreviousScreenTask.current.cancel();
    }; }, []);
    var navigateBackToPreviousScreen = (0, react_1.useCallback)(function () { return Navigation_1.default.goBack(); }, []);
    var updateStatus = (0, react_1.useCallback)(function (_a) {
        var emojiCode = _a.emojiCode, statusText = _a.statusText;
        if (navigateBackToPreviousScreenTask.current) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        var clearAfterTime = draftClearAfter || currentUserClearAfter || CONST_1.default.CUSTOM_STATUS_TYPES.NEVER;
        var isValid = DateUtils_1.default.isTimeAtLeastOneMinuteInFuture({ dateTimeString: clearAfterTime });
        if (!isValid && clearAfterTime !== CONST_1.default.CUSTOM_STATUS_TYPES.NEVER) {
            setBrickRoadIndicator(isValidClearAfterDate() ? undefined : CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR);
            return;
        }
        (0, User_1.updateCustomStatus)({
            text: statusText,
            emojiCode: !emojiCode && statusText ? initialEmoji : emojiCode,
            clearAfter: clearAfterTime !== CONST_1.default.CUSTOM_STATUS_TYPES.NEVER ? clearAfterTime : '',
        });
        navigateBackToPreviousScreenTask.current = react_native_1.InteractionManager.runAfterInteractions(function () {
            (0, User_1.clearDraftCustomStatus)();
            navigateBackToPreviousScreen();
        });
    }, [currentUserClearAfter, draftClearAfter, isValidClearAfterDate, navigateBackToPreviousScreen]);
    var clearStatus = function () {
        var _a;
        var _b;
        if (navigateBackToPreviousScreenTask.current) {
            return;
        }
        (0, User_1.clearCustomStatus)();
        (0, User_1.updateDraftCustomStatus)({
            text: '',
            emojiCode: '',
            clearAfter: DateUtils_1.default.getEndOfToday(),
        });
        (_b = formRef.current) === null || _b === void 0 ? void 0 : _b.resetForm((_a = {}, _a[SettingsStatusSetForm_1.default.EMOJI_CODE] = '', _a));
        navigateBackToPreviousScreenTask.current = react_native_1.InteractionManager.runAfterInteractions(function () {
            navigateBackToPreviousScreen();
        });
    };
    (0, react_1.useEffect)(function () { return setBrickRoadIndicator(isValidClearAfterDate() ? undefined : CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR); }, [isValidClearAfterDate]);
    (0, react_1.useEffect)(function () {
        if (!currentUserEmojiCode && !currentUserClearAfter && !draftClearAfter) {
            (0, User_1.updateDraftCustomStatus)({ clearAfter: DateUtils_1.default.getEndOfToday() });
        }
        else {
            (0, User_1.updateDraftCustomStatus)({ clearAfter: currentUserClearAfter });
        }
        return function () { return (0, User_1.clearDraftCustomStatus)(); };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    var validateForm = (0, react_1.useCallback)(function (_a) {
        var statusText = _a.statusText;
        if (brickRoadIndicator) {
            return { clearAfter: '' };
        }
        var errors = {};
        if (statusText.length > CONST_1.default.STATUS_TEXT_MAX_LENGTH) {
            errors[SettingsStatusSetForm_1.default.STATUS_TEXT] = translate('common.error.characterLimitExceedCounter', {
                length: statusText.length,
                limit: CONST_1.default.STATUS_TEXT_MAX_LENGTH,
            });
        }
        return errors;
    }, [brickRoadIndicator, translate]);
    var _o = (0, useAutoFocusInput_1.default)(), inputCallbackRef = _o.inputCallbackRef, inputRef = _o.inputRef;
    var fallbackVacationDelegateLogin = formattedDelegateLogin === '' ? vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.delegate : formattedDelegateLogin;
    return (<ScreenWrapper_1.default style={[StyleUtils.getBackgroundColorStyle(theme.PAGE_THEMES[SCREENS_1.default.SETTINGS.PROFILE.STATUS].backgroundColor)]} shouldEnablePickerAvoiding={false} includeSafeAreaPaddingBottom testID={HeaderPageLayout_1.default.displayName} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('statusPage.status')} onBackButtonPress={navigateBackToPreviousScreen}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.SETTINGS_STATUS_SET_FORM} style={[styles.flexGrow1, styles.flex1]} ref={formRef} submitButtonText={translate('statusPage.save')} submitButtonStyles={[styles.mh5, styles.flexGrow1]} onSubmit={updateStatus} validate={validateForm} enabledWhenOffline shouldScrollToEnd>
                <react_native_1.View style={[styles.mh5, styles.mv1]}>
                    <Text_1.default style={[styles.textNormal, styles.mt2]}>{translate('statusPage.statusExplanation')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mb2, styles.mt4]}>
                    <react_native_1.View style={[styles.mb4, styles.ph5]}>
                        <InputWrapper_1.default InputComponent={EmojiPickerButtonDropdown_1.default} inputID={SettingsStatusSetForm_1.default.EMOJI_CODE} accessibilityLabel={SettingsStatusSetForm_1.default.EMOJI_CODE} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultEmoji} style={styles.mb3} onModalHide={function () {
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
    onInputChange={function (emoji) { }}/>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={SettingsStatusSetForm_1.default.STATUS_TEXT} role={CONST_1.default.ROLE.PRESENTATION} label={translate('statusPage.message')} accessibilityLabel={SettingsStatusSetForm_1.default.STATUS_TEXT} defaultValue={defaultText}/>
                    </react_native_1.View>
                    <MenuItemWithTopDescription_1.default title={customClearAfter} description={translate('statusPage.clearAfter')} shouldShowRightIcon onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER); }} containerStyle={styles.pr2} brickRoadIndicator={brickRoadIndicator}/>
                    {(!!currentUserEmojiCode || !!currentUserStatusText) && (<MenuItem_1.default title={translate('statusPage.clearStatus')} titleStyle={styles.ml0} icon={Expensicons.Trashcan} onPress={clearStatus} iconFill={theme.danger} wrapperStyle={[styles.pl2]}/>)}
                </react_native_1.View>
                <react_native_1.View style={[styles.mb2, styles.mt6]}>
                    <Text_1.default style={[styles.mh5]}>{translate('statusPage.setVacationDelegate')}</Text_1.default>
                    {hasVacationDelegate && <Text_1.default style={[styles.mh5, styles.mt6, styles.mutedTextLabel]}>{translate('statusPage.vacationDelegate')}</Text_1.default>}
                    {hasVacationDelegate ? (<OfflineWithFeedback_1.default pendingAction={vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.pendingAction} errors={vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.errors} errorRowStyles={styles.mh5} onClose={function () { return (0, VacationDelegate_1.clearVacationDelegateError)(vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.previousDelegate); }}>
                            <MenuItem_1.default title={(_j = vacationDelegatePersonalDetails === null || vacationDelegatePersonalDetails === void 0 ? void 0 : vacationDelegatePersonalDetails.displayName) !== null && _j !== void 0 ? _j : fallbackVacationDelegateLogin} description={fallbackVacationDelegateLogin} avatarID={(_k = vacationDelegatePersonalDetails === null || vacationDelegatePersonalDetails === void 0 ? void 0 : vacationDelegatePersonalDetails.accountID) !== null && _k !== void 0 ? _k : CONST_1.default.DEFAULT_NUMBER_ID} icon={(_l = vacationDelegatePersonalDetails === null || vacationDelegatePersonalDetails === void 0 ? void 0 : vacationDelegatePersonalDetails.avatar) !== null && _l !== void 0 ? _l : Expensicons.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} numberOfLinesDescription={1} shouldShowRightIcon onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_VACATION_DELEGATE); }} containerStyle={styles.pr2}/>
                        </OfflineWithFeedback_1.default>) : (<react_native_1.View style={[styles.mt1]}>
                            <MenuItem_1.default description={translate('statusPage.vacationDelegate')} shouldShowRightIcon onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_VACATION_DELEGATE); }} containerStyle={styles.pr2}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
StatusPage.displayName = 'StatusPage';
exports.default = StatusPage;
