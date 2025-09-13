"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputError = exports.ServerError = exports.Loading = exports.Default = void 0;
exports.WithNativeEventHandler = WithNativeEventHandler;
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Picker_1 = require("@components/Picker");
const StateSelector_1 = require("@components/StateSelector");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const NetworkConnection_1 = require("@libs/NetworkConnection");
const ValidationUtils = require("@libs/ValidationUtils");
const FormActions = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const styles_1 = require("@src/styles");
const STORYBOOK_FORM_ID = 'TestForm';
const story = {
    title: 'Components/Form',
    component: FormProvider_1.default,
    subcomponents: {
        InputWrapper: InputWrapper_1.default,
        TextInput: TextInput_1.default,
        AddressSearch: AddressSearch_1.default,
        CheckboxWithLabel: CheckboxWithLabel_1.default,
        Picker: Picker_1.default,
        StateSelector: StateSelector_1.default,
        DatePicker: DatePicker_1.default,
    },
};
function Template(props) {
    // Form consumes data from Onyx, so we initialize Onyx with the necessary data here
    NetworkConnection_1.default.setOfflineStatus(false);
    FormActions.setIsLoading(props.formID, !!props.formState?.isLoading);
    FormActions.setDraftValues(props.formID, props.draftValues);
    if (props.formState?.error) {
        FormActions.setErrors(props.formID, { error: props.formState.error });
    }
    else {
        FormActions.clearErrors(props.formID);
    }
    return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider_1.default {...props}>
            <react_native_1.View>
                <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} accessibilityLabel="Routing number" label="Routing number" inputID="routingNumber" shouldSaveDraft/>
            </react_native_1.View>
            <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} label="Account number" accessibilityLabel="Account number" inputID="accountNumber" containerStyles={styles_1.defaultStyles.mt4}/>
            <InputWrapper_1.default InputComponent={AddressSearch_1.default} label="Street" inputID="street" containerStyles={styles_1.defaultStyles.mt4} hint="common.noPO"/>
            <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID="dob" label="Date of Birth" containerStyles={styles_1.defaultStyles.mt4}/>
            <react_native_1.View>
                <InputWrapper_1.default InputComponent={Picker_1.default} label="Fruit" inputID="pickFruit" onInputChange={() => { }} containerStyles={styles_1.defaultStyles.mt4} shouldSaveDraft items={[
            {
                label: 'Select a Fruit',
                value: '',
            },
            {
                label: 'Orange',
                value: 'orange',
            },
            {
                label: 'Apple',
                value: 'apple',
            },
        ]}/>
            </react_native_1.View>
            <InputWrapper_1.default InputComponent={Picker_1.default} label="Another Fruit" inputID="pickAnotherFruit" onInputChange={() => { }} containerStyles={styles_1.defaultStyles.mt4} items={[
            {
                label: 'Select a Fruit',
                value: '',
            },
            {
                label: 'Orange',
                value: 'orange',
            },
            {
                label: 'Apple',
                value: 'apple',
            },
        ]}/>
            <react_native_1.View style={styles_1.defaultStyles.mt4}>
                <InputWrapper_1.default InputComponent={StateSelector_1.default} inputID="state" shouldSaveDraft/>
            </react_native_1.View>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} inputID="checkbox" style={[styles_1.defaultStyles.mb4, styles_1.defaultStyles.mt5]} 
    // eslint-disable-next-line react/no-unstable-nested-components
    LabelComponent={() => <Text_1.default>I accept the Expensify Terms of Service</Text_1.default>}/>
        </FormProvider_1.default>);
}
/**
 * Story to exhibit the native event handlers for TextInput in the Form Component
 */
function WithNativeEventHandler(props) {
    const [log, setLog] = (0, react_1.useState)('');
    // Form consumes data from Onyx, so we initialize Onyx with the necessary data here
    NetworkConnection_1.default.setOfflineStatus(false);
    FormActions.setIsLoading(props.formID, !!props.formState?.isLoading);
    FormActions.setDraftValues(props.formID, props.draftValues);
    if (props.formState?.error) {
        FormActions.setErrors(props.formID, { error: props.formState.error });
    }
    else {
        FormActions.clearErrors(props.formID);
    }
    return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider_1.default {...props}>
            <InputWrapper_1.default InputComponent={TextInput_1.default} role={CONST_1.default.ROLE.PRESENTATION} accessibilityLabel="Routing number" label="Routing number" inputID="routingNumber" onChangeText={setLog} shouldSaveDraft/>
            <Text_1.default>{`Entered routing number: ${log}`}</Text_1.default>
        </FormProvider_1.default>);
}
// Arguments can be passed to the component by binding
// See: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Default = Template.bind({});
exports.Default = Default;
const Loading = Template.bind({});
exports.Loading = Loading;
const ServerError = Template.bind({});
exports.ServerError = ServerError;
const InputError = Template.bind({});
exports.InputError = InputError;
const defaultArgs = {
    formID: STORYBOOK_FORM_ID,
    submitButtonText: 'Submit',
    validate: (values) => {
        const errors = {};
        if (!ValidationUtils.isRequiredFulfilled(values.routingNumber)) {
            errors.routingNumber = 'Please enter a routing number';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.accountNumber)) {
            errors.accountNumber = 'Please enter an account number';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.street)) {
            errors.street = 'Please enter an address';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.dob)) {
            errors.dob = 'Please enter your date of birth';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.pickFruit)) {
            errors.pickFruit = 'Please select a fruit';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.pickAnotherFruit)) {
            errors.pickAnotherFruit = 'Please select a fruit';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.state)) {
            errors.state = 'Please select a state';
        }
        if (!ValidationUtils.isRequiredFulfilled(values.checkbox)) {
            errors.checkbox = 'You must accept the Terms of Service to continue';
        }
        return errors;
    },
    onSubmit: (values) => {
        setTimeout(() => {
            alert(`Form submitted!\n\nInput values: ${JSON.stringify(values, null, 4)}`);
            FormActions.setIsLoading(STORYBOOK_FORM_ID, false);
        }, 1000);
    },
    formState: {
        isLoading: false,
        error: '',
    },
    draftValues: {
        routingNumber: '00001',
        accountNumber: '1111222233331111',
        street: '123 Happy St, HappyLand HP 12345',
        dob: '1990-01-01',
        pickFruit: 'orange',
        pickAnotherFruit: 'apple',
        state: 'AL',
        checkbox: false,
    },
};
Default.args = defaultArgs;
Loading.args = { ...defaultArgs, formState: { isLoading: true } };
ServerError.args = { ...defaultArgs, formState: { isLoading: false, error: 'There was an unexpected error. Please try again later.' } };
InputError.args = {
    ...defaultArgs,
    draftValues: {
        routingNumber: '',
        accountNumber: '',
        street: '',
        pickFruit: '',
        dob: '',
        pickAnotherFruit: '',
        state: '',
        checkbox: false,
    },
};
WithNativeEventHandler.args = { ...defaultArgs, draftValues: { routingNumber: '', accountNumber: '' } };
exports.default = story;
