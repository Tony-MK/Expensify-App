"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const ReportUtils_1 = require("@libs/ReportUtils");
const updateMultilineInputRange_1 = require("@libs/updateMultilineInputRange");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReportDescriptionForm_1 = require("@src/types/form/ReportDescriptionForm");
function RoomDescriptionPage({ report, policy }) {
    const route = (0, native_1.useRoute)();
    const backTo = route.params.backTo;
    const styles = (0, useThemeStyles_1.default)();
    const [description, setDescription] = (0, react_1.useState)(() => Parser_1.default.htmlToMarkdown((0, ReportUtils_1.getReportDescription)(report)));
    const reportDescriptionInputRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const { translate } = (0, useLocalize_1.default)();
    const reportIsArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const handleReportDescriptionChange = (0, react_1.useCallback)((value) => {
        setDescription(value);
    }, []);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => Navigation_1.default.goBack(backTo ?? ROUTES_1.default.REPORT_WITH_ID_DETAILS.getRoute(report.reportID)));
    }, [report.reportID, backTo]);
    const submitForm = (0, react_1.useCallback)(() => {
        const previousValue = report?.description ?? '';
        const newValue = description.trim();
        (0, Report_1.updateDescription)(report.reportID, previousValue, newValue);
        goBack();
    }, [report.reportID, report.description, description, goBack]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const descriptionLength = values[ReportDescriptionForm_1.default.REPORT_DESCRIPTION].trim().length;
        if (descriptionLength > CONST_1.default.REPORT_DESCRIPTION.MAX_LENGTH) {
            errors.reportDescription = translate('common.error.characterLimitExceedCounter', {
                length: descriptionLength,
                limit: CONST_1.default.REPORT_DESCRIPTION.MAX_LENGTH,
            });
        }
        return errors;
    }, [translate]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            reportDescriptionInputRef.current?.focus();
            return () => {
                if (!focusTimeoutRef.current) {
                    return;
                }
                clearTimeout(focusTimeoutRef.current);
            };
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, []));
    const canEdit = (0, ReportUtils_1.canEditReportDescription)(report, policy, reportIsArchived);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID={RoomDescriptionPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('reportDescriptionPage.roomDescription')} onBackButtonPress={goBack}/>
            {canEdit && (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.REPORT_DESCRIPTION_FORM} onSubmit={submitForm} validate={validate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
                    <Text_1.default style={[styles.mb5]}>{translate('reportDescriptionPage.explainerText')}</Text_1.default>
                    <react_native_1.View style={[styles.mb6]}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ReportDescriptionForm_1.default.REPORT_DESCRIPTION} label={translate('reportDescriptionPage.roomDescription')} accessibilityLabel={translate('reportDescriptionPage.roomDescription')} role={CONST_1.default.ROLE.PRESENTATION} autoGrowHeight maxAutoGrowHeight={variables_1.default.textInputAutoGrowMaxHeight} ref={(el) => {
                if (!el) {
                    return;
                }
                if (!reportDescriptionInputRef.current) {
                    (0, updateMultilineInputRange_1.default)(el, false);
                }
                reportDescriptionInputRef.current = el;
            }} value={description} onChangeText={handleReportDescriptionChange} autoCapitalize="none" type="markdown"/>
                    </react_native_1.View>
                </FormProvider_1.default>)}
            {!canEdit && (<ScrollView_1.default style={[styles.flexGrow1, styles.ph5, styles.mb5]}>
                    <RenderHTML_1.default html={Parser_1.default.replace(description)}/>
                </ScrollView_1.default>)}
        </ScreenWrapper_1.default>);
}
RoomDescriptionPage.displayName = 'RoomDescriptionPage';
exports.default = RoomDescriptionPage;
