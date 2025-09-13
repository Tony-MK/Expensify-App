"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const withReportAndPrivateNotesOrNotFound_1 = require("@pages/home/report/withReportAndPrivateNotesOrNotFound");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const PrivateNotesForm_1 = require("@src/types/form/PrivateNotesForm");
function PrivateNotesEditPage({ route, report, accountID }) {
    const backTo = route.params.backTo;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [personalDetailsList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    // We need to edit the note in markdown format, but display it in HTML format
    const [privateNote, setPrivateNote] = (0, react_1.useState)(() => (0, Report_1.getDraftPrivateNote)(report.reportID).trim() || Parser_1.default.htmlToMarkdown(report?.privateNotes?.[Number(route.params.accountID)]?.note ?? '').trim());
    /**
     * Save the draft of the private note. This debounced so that we're not ceaselessly saving your edit. Saving the draft
     * allows one to navigate somewhere else and come back to the private note and still have it in edit mode.
     */
    const debouncedSavePrivateNote = (0, react_1.useMemo)(() => (0, debounce_1.default)((text) => {
        (0, Report_1.savePrivateNotesDraft)(report.reportID, text);
    }, 1000), [report.reportID]);
    // To focus on the input field when the page loads
    const privateNotesInput = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            if (privateNotesInput.current) {
                privateNotesInput.current.focus();
            }
            return () => {
                if (!focusTimeoutRef.current) {
                    return;
                }
                clearTimeout(focusTimeoutRef.current);
            };
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, []));
    const savePrivateNote = () => {
        const originalNote = report?.privateNotes?.[Number(route.params.accountID)]?.note ?? '';
        let editedNote = '';
        if (privateNote.trim() !== originalNote.trim()) {
            editedNote = (0, Report_1.handleUserDeletedLinksInHtml)(privateNote.trim(), Parser_1.default.htmlToMarkdown(originalNote).trim());
            (0, Report_1.updatePrivateNotes)(report.reportID, Number(route.params.accountID), editedNote);
        }
        // We want to delete saved private note draft after saving the note
        debouncedSavePrivateNote('');
        react_native_1.Keyboard.dismiss();
        const hasNewNoteBeenAdded = !originalNote && editedNote;
        if (!Object.values({ ...report.privateNotes, [route.params.accountID]: { note: editedNote } }).some((item) => item.note) || hasNewNoteBeenAdded) {
            (0, ReportUtils_1.goBackToDetailsPage)(report, backTo, true);
        }
        else {
            Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(ROUTES_1.default.PRIVATE_NOTES_LIST.getRoute(report.reportID, backTo)));
        }
    };
    const validate = (0, react_1.useCallback)(() => {
        const errors = {};
        const privateNoteLength = privateNote.trim().length;
        if (privateNoteLength > CONST_1.default.MAX_COMMENT_LENGTH) {
            errors.privateNotes = translate('common.error.characterLimitExceedCounter', {
                length: privateNoteLength,
                limit: CONST_1.default.MAX_COMMENT_LENGTH,
            });
        }
        return errors;
    }, [privateNote, translate]);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID={PrivateNotesEditPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('privateNotes.title')} onBackButtonPress={() => (0, ReportUtils_1.goBackFromPrivateNotes)(report, accountID, backTo)} shouldShowBackButton onCloseButtonPress={() => Navigation_1.default.dismissModal()}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.PRIVATE_NOTES_FORM} onSubmit={savePrivateNote} validate={validate} style={[styles.flexGrow1, styles.ph5]} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                <Text_1.default style={[styles.mb5]}>
                    {translate(expensify_common_1.Str.extractEmailDomain(personalDetailsList?.[route.params.accountID]?.login ?? '') === CONST_1.default.EMAIL.GUIDES_DOMAIN
            ? 'privateNotes.sharedNoteMessage'
            : 'privateNotes.personalNoteMessage')}
                </Text_1.default>
                <OfflineWithFeedback_1.default errors={{
            ...(report?.privateNotes?.[Number(route.params.accountID)]?.errors ?? ''),
        }} onClose={() => (0, Report_1.clearPrivateNotesError)(report.reportID, Number(route.params.accountID))} style={[styles.mb3]}>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} inputID={PrivateNotesForm_1.default.PRIVATE_NOTES} label={translate('privateNotes.composerLabel')} accessibilityLabel={translate('privateNotes.title')} autoCompleteType="off" autoCorrect={false} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} defaultValue={privateNote} value={privateNote} onChangeText={(text) => {
            debouncedSavePrivateNote(text);
            setPrivateNote(text);
        }} ref={(el) => {
            if (!el) {
                return;
            }
            if (!privateNotesInput.current) {
                (0, updateMultilineInputRange_1.default)(el);
            }
            privateNotesInput.current = el;
        }} type="markdown"/>
                </OfflineWithFeedback_1.default>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
PrivateNotesEditPage.displayName = 'PrivateNotesEditPage';
exports.default = (0, withReportAndPrivateNotesOrNotFound_1.default)('privateNotes.title')(PrivateNotesEditPage);
