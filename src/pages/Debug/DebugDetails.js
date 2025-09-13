"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DebugUtils_1 = require("@libs/DebugUtils");
const Debug_1 = require("@userActions/Debug");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DebugTransactionForm_1 = require("@src/types/form/DebugTransactionForm");
const const_1 = require("./const");
const ConstantSelector_1 = require("./ConstantSelector");
const DateTimeSelector_1 = require("./DateTimeSelector");
function DebugDetails({ formType, data, policyHasEnabledTags, policyID, children, onSave, onDelete, validate }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [formDraftData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.DEBUG_DETAILS_FORM_DRAFT, { canBeMissing: true });
    const booleanFields = (0, react_1.useMemo)(() => Object.entries(data ?? {})
        .filter(([, value]) => typeof value === 'boolean')
        .sort((a, b) => localeCompare(a[0], b[0])), [data, localeCompare]);
    const constantFields = (0, react_1.useMemo)(() => Object.entries(data ?? {})
        .filter((entry) => {
        // Tag picker needs to be hidden when the policy has no tags available to pick
        if (entry[0] === DebugTransactionForm_1.default.TAG && !policyHasEnabledTags) {
            return false;
        }
        return const_1.DETAILS_CONSTANT_FIELDS[formType].some(({ fieldName }) => fieldName === entry[0]);
    })
        .sort((a, b) => localeCompare(a[0], b[0])), [data, formType, policyHasEnabledTags, localeCompare]);
    const numberFields = (0, react_1.useMemo)(() => Object.entries(data ?? {})
        .filter((entry) => typeof entry[1] === 'number')
        .sort((a, b) => localeCompare(a[0], b[0])), [data, localeCompare]);
    const textFields = (0, react_1.useMemo)(() => Object.entries(data ?? {})
        .filter((entry) => (typeof entry[1] === 'string' || typeof entry[1] === 'object') &&
        !const_1.DETAILS_CONSTANT_FIELDS[formType].some(({ fieldName }) => fieldName === entry[0]) &&
        !const_1.DETAILS_DATETIME_FIELDS.includes(entry[0]))
        .map(([key, value]) => [key, DebugUtils_1.default.onyxDataToString(value)])
        .sort((a, b) => localeCompare(a.at(0) ?? '', b.at(0) ?? '')), [data, formType, localeCompare]);
    const dateTimeFields = (0, react_1.useMemo)(() => Object.entries(data ?? {}).filter((entry) => const_1.DETAILS_DATETIME_FIELDS.includes(entry[0])), [data]);
    const validator = (0, react_1.useCallback)((values) => {
        const newErrors = {};
        Object.entries(values).forEach(([key, value]) => {
            try {
                validate(key, DebugUtils_1.default.onyxDataToString(value));
            }
            catch (e) {
                const { cause, message } = e;
                newErrors[key] = cause || message === 'debug.missingValue' ? translate(message, cause) : message;
            }
        });
        return newErrors;
    }, [translate, validate]);
    (0, react_1.useEffect)(() => {
        Debug_1.default.resetDebugDetailsDraftForm();
    }, []);
    const handleSubmit = (0, react_1.useCallback)((values) => {
        const dataPreparedToSave = Object.entries(values).reduce((acc, [key, value]) => {
            if (typeof value === 'boolean') {
                acc[key] = value;
            }
            else {
                acc[key] = DebugUtils_1.default.stringToOnyxData(value, typeof data?.[key]);
            }
            return acc;
        }, {});
        onSave(dataPreparedToSave);
    }, [data, onSave]);
    const isSubmitDisabled = (0, react_1.useMemo)(() => !Object.entries(formDraftData ?? {}).some(([key, value]) => {
        const onyxData = data?.[key];
        if (typeof value === 'string') {
            return !DebugUtils_1.default.compareStringWithOnyxData(value, onyxData);
        }
        return onyxData !== value;
    }), [formDraftData, data]);
    return (<ScrollView_1.default style={styles.mv5}>
            {children}
            <FormProvider_1.default style={styles.flexGrow1} formID={ONYXKEYS_1.default.FORMS.DEBUG_DETAILS_FORM} validate={validator} shouldValidateOnChange onSubmit={handleSubmit} isSubmitDisabled={isSubmitDisabled} submitButtonText={translate('common.save')} submitButtonStyles={[styles.ph5, styles.mt0]} enabledWhenOffline allowHTML>
                <Text_1.default style={[styles.headerText, styles.ph5, styles.mb3]}>{translate('debug.textFields')}</Text_1.default>
                <react_native_1.View style={[styles.mb5, styles.ph5, styles.gap5]}>
                    {textFields.map(([key, value]) => {
            const numberOfLines = DebugUtils_1.default.getNumberOfLinesFromString(formDraftData?.[key] ?? value);
            return (<InputWrapper_1.default key={key} InputComponent={TextInput_1.default} inputID={key} accessibilityLabel={key} shouldSaveDraft forceActiveLabel label={key} numberOfLines={numberOfLines} multiline={numberOfLines > 1} defaultValue={value} disabled={const_1.DETAILS_DISABLED_KEYS.includes(key)} shouldInterceptSwipe/>);
        })}
                    {textFields.length === 0 && <Text_1.default style={[styles.textNormalThemeText, styles.ph5]}>{translate('debug.none')}</Text_1.default>}
                </react_native_1.View>
                <Text_1.default style={[styles.headerText, styles.ph5, styles.mb3]}>{translate('debug.numberFields')}</Text_1.default>
                <react_native_1.View style={[styles.mb5, styles.ph5, styles.gap5]}>
                    {numberFields.map(([key, value]) => (<InputWrapper_1.default key={key} InputComponent={TextInput_1.default} inputID={key} accessibilityLabel={key} shouldSaveDraft forceActiveLabel label={key} defaultValue={String(value)} disabled={const_1.DETAILS_DISABLED_KEYS.includes(key)} shouldInterceptSwipe/>))}
                    {numberFields.length === 0 && <Text_1.default style={styles.textNormalThemeText}>{translate('debug.none')}</Text_1.default>}
                </react_native_1.View>
                <Text_1.default style={[styles.headerText, styles.ph5, styles.mb3]}>{translate('debug.constantFields')}</Text_1.default>
                <react_native_1.View style={styles.mb5}>
                    {constantFields.map(([key, value]) => (<InputWrapper_1.default key={key} InputComponent={ConstantSelector_1.default} inputID={key} formType={formType} name={key} shouldSaveDraft defaultValue={String(value)} policyID={policyID}/>))}
                    {constantFields.length === 0 && <Text_1.default style={[styles.textNormalThemeText, styles.ph5]}>{translate('debug.none')}</Text_1.default>}
                </react_native_1.View>
                <Text_1.default style={[styles.headerText, styles.ph5, styles.mb3]}>{translate('debug.dateTimeFields')}</Text_1.default>
                <react_native_1.View style={styles.mb5}>
                    {dateTimeFields.map(([key, value]) => (<InputWrapper_1.default key={key} InputComponent={DateTimeSelector_1.default} inputID={key} name={key} shouldSaveDraft defaultValue={String(value)}/>))}
                    {dateTimeFields.length === 0 && <Text_1.default style={[styles.textNormalThemeText, styles.ph5]}>{translate('debug.none')}</Text_1.default>}
                </react_native_1.View>
                <Text_1.default style={[styles.headerText, styles.ph5, styles.mb3]}>{translate('debug.booleanFields')}</Text_1.default>
                <react_native_1.View style={[styles.mb5, styles.ph5, styles.gap5]}>
                    {booleanFields.map(([key, value]) => (<InputWrapper_1.default key={key} InputComponent={CheckboxWithLabel_1.default} label={key} inputID={key} shouldSaveDraft accessibilityLabel={key} defaultValue={value}/>))}
                    {booleanFields.length === 0 && <Text_1.default style={styles.textNormalThemeText}>{translate('debug.none')}</Text_1.default>}
                </react_native_1.View>
                <Text_1.default style={[styles.headerText, styles.textAlignCenter]}>{translate('debug.hint')}</Text_1.default>
                <react_native_1.View style={[styles.ph5, styles.mb3, styles.mt5]}>
                    <Button_1.default danger large text={translate('common.delete')} onPress={onDelete}/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScrollView_1.default>);
}
DebugDetails.displayName = 'DebugDetails';
exports.default = DebugDetails;
