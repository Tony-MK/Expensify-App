"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openOnfidoFlow = openOnfidoFlow;
exports.openInitialSettingsPage = openInitialSettingsPage;
exports.openEnablePaymentsPage = openEnablePaymentsPage;
exports.setAdditionalDetailsQuestions = setAdditionalDetailsQuestions;
exports.updateCurrentStep = updateCurrentStep;
exports.answerQuestionsForWallet = answerQuestionsForWallet;
exports.updatePersonalDetails = updatePersonalDetails;
exports.verifyIdentity = verifyIdentity;
exports.acceptWalletTerms = acceptWalletTerms;
exports.setKYCWallSource = setKYCWallSource;
exports.resetWalletAdditionalDetailsDraft = resetWalletAdditionalDetailsDraft;
exports.issuerEncryptPayloadCallback = issuerEncryptPayloadCallback;
exports.createDigitalGoogleWallet = createDigitalGoogleWallet;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const package_json_1 = require("../../../package.json");
/**
 * Fetch and save locally the Onfido SDK token and applicantID
 * - The sdkToken is used to initialize the Onfido SDK client
 * - The applicantID is combined with the data returned from the Onfido SDK as we need both to create an
 *   identity check. Note: This happens in Web-Secure when we call Activate_Wallet during the OnfidoStep.
 */
function openOnfidoFlow() {
    const optimisticData = [
        {
            // Use Onyx.set() since we are resetting the Onfido flow completely.
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.WALLET_ONFIDO,
            value: {
                isLoading: true,
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_ONFIDO,
            value: {
                isLoading: false,
            },
        },
    ];
    API.read(types_1.READ_COMMANDS.OPEN_ONFIDO_FLOW, null, { optimisticData, finallyData });
}
function setAdditionalDetailsQuestions(questions, idNumber) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS, { questions, idNumber });
}
/**
 * Save the source that triggered the KYC wall and optionally the chat report ID associated with the IOU
 */
function setKYCWallSource(source, chatReportID = '') {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_TERMS, { source, chatReportID });
}
/**
 * Validates a user's provided details against a series of checks
 */
function updatePersonalDetails(personalDetails) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS,
            value: {
                isLoading: true,
                errors: null,
                errorFields: null,
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS,
            value: {
                isLoading: false,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.UPDATE_PERSONAL_DETAILS_FOR_WALLET, personalDetails, {
        optimisticData,
        finallyData,
    });
}
/**
 * Creates an identity check by calling Onfido's API with data returned from the SDK
 *
 * The API will always return the updated userWallet in the response as a convenience so we can avoid an additional
 * API request to fetch the userWallet after we call VerifyIdentity
 */
function verifyIdentity(parameters) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_ONFIDO,
            value: {
                isLoading: true,
                errors: null,
                fixableErrors: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.USER_WALLET,
            value: {
                shouldShowFailedKYC: false,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_ONFIDO,
            value: {
                isLoading: false,
                errors: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_ONFIDO,
            value: {
                isLoading: false,
                hasAcceptedPrivacyPolicy: false,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.VERIFY_IDENTITY, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Complete the "Accept Terms" step of the wallet activation flow.
 *
 * @param parameters.chatReportID When accepting the terms of wallet to pay an IOU, indicates the parent chat ID of the IOU
 */
function acceptWalletTerms(parameters) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_TERMS,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_TERMS,
            value: {
                errors: null,
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.USER_WALLET,
            value: {
                isPendingOnfidoResult: null,
                shouldShowFailedKYC: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.WALLET_TERMS,
            value: {
                isLoading: false,
            },
        },
    ];
    const requestParams = { hasAcceptedTerms: parameters.hasAcceptedTerms, reportID: parameters.reportID };
    API.write(types_1.WRITE_COMMANDS.ACCEPT_WALLET_TERMS, requestParams, { optimisticData, successData, failureData });
}
/**
 * Fetches data when the user opens the InitialSettingsPage
 */
function openInitialSettingsPage() {
    API.read(types_1.READ_COMMANDS.OPEN_INITIAL_SETTINGS_PAGE, null);
}
/**
 * Fetches data when the user opens the EnablePaymentsPage
 */
function openEnablePaymentsPage() {
    API.read(types_1.READ_COMMANDS.OPEN_ENABLE_PAYMENTS_PAGE, null);
}
function updateCurrentStep(currentStep) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.USER_WALLET, { currentStep });
}
function answerQuestionsForWallet(answers, idNumber) {
    const idologyAnswers = JSON.stringify(answers);
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS,
            value: {
                isLoading: true,
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS,
            value: {
                isLoading: false,
            },
        },
    ];
    const requestParams = {
        idologyAnswers,
        idNumber,
    };
    API.write(types_1.WRITE_COMMANDS.ANSWER_QUESTIONS_FOR_WALLET, requestParams, {
        optimisticData,
        finallyData,
    });
}
function resetWalletAdditionalDetailsDraft() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS_DRAFT, null);
}
function issuerEncryptPayloadCallback(nonce, nonceSignature, certificates) {
    // eslint-disable-next-line rulesdir/no-api-side-effects-method, rulesdir/no-api-in-views
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.CREATE_DIGITAL_WALLET, {
        platform: 'ios',
        appVersion: package_json_1.default.version,
        certificates: JSON.stringify({ certificates }),
        nonce,
        nonceSignature,
    })
        .then((response) => {
        const data = response;
        return {
            encryptedPassData: data.encryptedPassData,
            activationData: data.activationData,
            ephemeralPublicKey: data.ephemeralPublicKey,
        };
    })
        .catch((error) => {
        Log_1.default.warn(`issuerEncryptPayloadCallback error: ${error}`);
        return {};
    });
}
/**
 * Add card to digital wallet
 *
 * @param walletAccountID ID of the wallet on user's phone
 * @param deviceID ID of user's phone
 */
function createDigitalGoogleWallet({ walletAccountID, deviceID, cardID, cardHolderName, }) {
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.CREATE_DIGITAL_WALLET, {
        platform: 'android',
        appVersion: package_json_1.default.version,
        walletAccountID,
        deviceID,
        cardID,
    })
        .then((response) => {
        const data = response;
        return {
            network: data.network,
            opaquePaymentCard: data.opaquePaymentCard,
            cardHolderName,
            lastDigits: data.lastDigits,
            userAddress: {
                name: data.userAddress.name,
                addressOne: data.userAddress.address1,
                addressTwo: data.userAddress.address2,
                administrativeArea: data.userAddress.state,
                locality: data.userAddress.city,
                countryCode: data.userAddress.country,
                postalCode: data.userAddress.postal_code,
                phoneNumber: data.userAddress.phone,
            },
        };
    })
        .catch((error) => {
        Log_1.default.warn(`createDigitalGoogleWallet error: ${error}`);
        return {};
    });
}
