"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFY_ACCOUNT = exports.SHARED_ROUTE_PARAMS = exports.PUBLIC_SCREENS_ROUTES = void 0;
const Log_1 = require("./libs/Log");
const SCREENS_1 = require("./SCREENS");
// This is a file containing constants for all the routes we want to be able to go to
/**
 * Builds a URL with an encoded URI component for the `backTo` param which can be added to the end of URLs
 */
function getUrlWithBackToParam(url, backTo, shouldEncodeURIComponent = true) {
    const backToParam = backTo ? `${url.includes('?') ? '&' : '?'}backTo=${shouldEncodeURIComponent ? encodeURIComponent(backTo) : backTo}` : '';
    return `${url}${backToParam}`;
}
const PUBLIC_SCREENS_ROUTES = {
    // If the user opens this route, we'll redirect them to the path saved in the last visited path or to the home page if the last visited path is empty.
    ROOT: '',
    TRANSITION_BETWEEN_APPS: 'transition',
    CONNECTION_COMPLETE: 'connection-complete',
    BANK_CONNECTION_COMPLETE: 'bank-connection-complete',
    VALIDATE_LOGIN: 'v/:accountID/:validateCode',
    UNLINK_LOGIN: 'u/:accountID/:validateCode',
    APPLE_SIGN_IN: 'sign-in-with-apple',
    GOOGLE_SIGN_IN: 'sign-in-with-google',
    SAML_SIGN_IN: 'sign-in-with-saml',
};
exports.PUBLIC_SCREENS_ROUTES = PUBLIC_SCREENS_ROUTES;
// Exported for identifying a url as a verify-account route, associated with a page extending the VerifyAccountPageBase component
const VERIFY_ACCOUNT = 'verify-account';
exports.VERIFY_ACCOUNT = VERIFY_ACCOUNT;
const ROUTES = {
    ...PUBLIC_SCREENS_ROUTES,
    // This route renders the list of reports.
    HOME: 'home',
    // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
    WORKSPACES_LIST: { route: 'workspaces', getRoute: (backTo) => getUrlWithBackToParam('workspaces', backTo) },
    SEARCH_ROOT: {
        route: 'search',
        getRoute: ({ query, name }) => {
            return `search?q=${encodeURIComponent(query)}${name ? `&name=${name}` : ''}`;
        },
    },
    SEARCH_SAVED_SEARCH_RENAME: {
        route: 'search/saved-search/rename',
        getRoute: ({ name, jsonQuery }) => `search/saved-search/rename?name=${name}&q=${jsonQuery}`,
    },
    SEARCH_ADVANCED_FILTERS: {
        route: 'search/filters/:filterKey?',
        getRoute: (filterKey) => {
            return `search/filters/${filterKey ?? ''}`;
        },
    },
    SEARCH_REPORT: {
        route: 'search/view/:reportID/:reportActionID?',
        getRoute: ({ reportID, reportActionID, backTo }) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the SEARCH_REPORT route');
            }
            const baseRoute = reportActionID ? `search/view/${reportID}/${reportActionID}` : `search/view/${reportID}`;
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(baseRoute, backTo);
        },
    },
    SEARCH_MONEY_REQUEST_REPORT: {
        route: 'search/r/:reportID',
        getRoute: ({ reportID, backTo }) => {
            const baseRoute = `search/r/${reportID}`;
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(baseRoute, backTo);
        },
    },
    SEARCH_MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS: {
        route: 'search/r/:reportID/hold',
        getRoute: ({ reportID, backTo }) => {
            const baseRoute = `search/r/${reportID}/hold`;
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(baseRoute, backTo);
        },
    },
    TRANSACTION_HOLD_REASON_RHP: 'search/hold',
    MOVE_TRANSACTIONS_SEARCH_RHP: 'search/move-transactions',
    // This is a utility route used to go to the user's concierge chat, or the sign-in page if the user's not authenticated
    CONCIERGE: 'concierge',
    TRACK_EXPENSE: 'track-expense',
    SUBMIT_EXPENSE: 'submit-expense',
    FLAG_COMMENT: {
        route: 'flag/:reportID/:reportActionID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, reportActionID, backTo) => getUrlWithBackToParam(`flag/${reportID}/${reportActionID}`, backTo),
    },
    PROFILE: {
        route: 'a/:accountID',
        getRoute: (accountID, backTo, login) => {
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            const baseRoute = getUrlWithBackToParam(`a/${accountID}`, backTo);
            const loginParam = login ? `?login=${encodeURIComponent(login)}` : '';
            return `${baseRoute}${loginParam}`;
        },
    },
    PROFILE_AVATAR: {
        route: 'a/:accountID/avatar',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (accountID, backTo) => getUrlWithBackToParam(`a/${accountID}/avatar`, backTo),
    },
    DESKTOP_SIGN_IN_REDIRECT: 'desktop-signin-redirect',
    // This is a special validation URL that will take the user to /workspace/new after validation. This is used
    // when linking users from e.com in order to share a session in this app.
    ENABLE_PAYMENTS: 'enable-payments',
    WALLET_STATEMENT_WITH_DATE: 'statements/:yearMonth',
    SIGN_IN_MODAL: 'sign-in-modal',
    REQUIRE_TWO_FACTOR_AUTH: '2fa-required',
    BANK_ACCOUNT: 'bank-account',
    BANK_ACCOUNT_NEW: 'bank-account/new',
    BANK_ACCOUNT_PERSONAL: 'bank-account/personal',
    BANK_ACCOUNT_WITH_STEP_TO_OPEN: {
        route: 'bank-account/:stepToOpen?',
        getRoute: (policyID, stepToOpen = '', backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the BANK_ACCOUNT_WITH_STEP_TO_OPEN route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`bank-account/${stepToOpen}?policyID=${policyID}`, backTo);
        },
    },
    BANK_ACCOUNT_ENTER_SIGNER_INFO: {
        route: 'bank-account/enter-signer-info',
        getRoute: (policyID, bankAccountID, isCompleted) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the BANK_ACCOUNT_ENTER_SIGNER_INFO route');
            }
            return `bank-account/enter-signer-info?policyID=${policyID}&bankAccountID=${bankAccountID}&isCompleted=${isCompleted}`;
        },
    },
    PUBLIC_CONSOLE_DEBUG: {
        route: 'troubleshoot/console',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`troubleshoot/console`, backTo),
    },
    SETTINGS: 'settings',
    SETTINGS_PROFILE: {
        route: 'settings/profile',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/profile', backTo),
    },
    SETTINGS_CHANGE_CURRENCY: 'settings/add-payment-card/change-currency',
    SETTINGS_SHARE_CODE: 'settings/shareCode',
    SETTINGS_DISPLAY_NAME: 'settings/profile/display-name',
    SETTINGS_TIMEZONE: 'settings/profile/timezone',
    SETTINGS_TIMEZONE_SELECT: 'settings/profile/timezone/select',
    SETTINGS_PRONOUNS: 'settings/profile/pronouns',
    SETTINGS_PREFERENCES: 'settings/preferences',
    SETTINGS_SUBSCRIPTION: {
        route: 'settings/subscription',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/subscription', backTo),
    },
    SETTINGS_SUBSCRIPTION_SIZE: {
        route: 'settings/subscription/subscription-size',
        getRoute: (canChangeSize) => `settings/subscription/subscription-size?canChangeSize=${canChangeSize}`,
    },
    SETTINGS_SUBSCRIPTION_SETTINGS_DETAILS: 'settings/subscription/details',
    SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD: 'settings/subscription/add-payment-card',
    SETTINGS_SUBSCRIPTION_CHANGE_BILLING_CURRENCY: 'settings/subscription/change-billing-currency',
    SETTINGS_SUBSCRIPTION_CHANGE_PAYMENT_CURRENCY: 'settings/subscription/add-payment-card/change-payment-currency',
    SETTINGS_SUBSCRIPTION_DISABLE_AUTO_RENEW_SURVEY: 'settings/subscription/disable-auto-renew-survey',
    SETTINGS_SUBSCRIPTION_REQUEST_EARLY_CANCELLATION: 'settings/subscription/request-early-cancellation-survey',
    SETTINGS_SUBSCRIPTION_DOWNGRADE_BLOCKED: {
        route: 'settings/subscription/downgrade-blocked',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/subscription/downgrade-blocked', backTo),
    },
    SETTINGS_PRIORITY_MODE: 'settings/preferences/priority-mode',
    SETTINGS_LANGUAGE: 'settings/preferences/language',
    SETTINGS_PAYMENT_CURRENCY: 'setting/preferences/payment-currency',
    SETTINGS_THEME: 'settings/preferences/theme',
    SETTINGS_SECURITY: 'settings/security',
    SETTINGS_CLOSE: 'settings/security/closeAccount',
    SETTINGS_MERGE_ACCOUNTS: {
        route: 'settings/security/merge-accounts',
        getRoute: (email) => `settings/security/merge-accounts${email ? `?email=${encodeURIComponent(email)}` : ''}`,
    },
    SETTINGS_MERGE_ACCOUNTS_MAGIC_CODE: {
        route: 'settings/security/merge-accounts/:login/magic-code',
        getRoute: (login) => `settings/security/merge-accounts/${encodeURIComponent(login)}/magic-code`,
    },
    SETTINGS_MERGE_ACCOUNTS_RESULT: {
        route: 'settings/security/merge-accounts/:login/result/:result',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (login, result, backTo) => getUrlWithBackToParam(`settings/security/merge-accounts/${encodeURIComponent(login)}/result/${result}`, backTo),
    },
    SETTINGS_LOCK_ACCOUNT: 'settings/security/lock-account',
    SETTINGS_UNLOCK_ACCOUNT: 'settings/security/unlock-account',
    SETTINGS_FAILED_TO_LOCK_ACCOUNT: 'settings/security/failed-to-lock-account',
    SETTINGS_DELEGATE_VERIFY_ACCOUNT: `settings/security/delegate/${VERIFY_ACCOUNT}`,
    SETTINGS_ADD_DELEGATE: 'settings/security/delegate',
    SETTINGS_DELEGATE_ROLE: {
        route: 'settings/security/delegate/:login/role/:role',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (login, role, backTo) => getUrlWithBackToParam(`settings/security/delegate/${encodeURIComponent(login)}/role/${role}`, backTo),
    },
    SETTINGS_UPDATE_DELEGATE_ROLE: {
        route: 'settings/security/delegate/:login/update-role/:currentRole',
        getRoute: (login, currentRole) => `settings/security/delegate/${encodeURIComponent(login)}/update-role/${currentRole}`,
    },
    SETTINGS_DELEGATE_CONFIRM: {
        route: 'settings/security/delegate/:login/role/:role/confirm',
        getRoute: (login, role, showValidateActionModal) => {
            const validateActionModalParam = showValidateActionModal ? `?showValidateActionModal=true` : '';
            return `settings/security/delegate/${encodeURIComponent(login)}/role/${role}/confirm${validateActionModalParam}`;
        },
    },
    SETTINGS_ABOUT: 'settings/about',
    SETTINGS_APP_DOWNLOAD_LINKS: 'settings/about/app-download-links',
    SETTINGS_WALLET: 'settings/wallet',
    SETTINGS_WALLET_DOMAIN_CARD: {
        route: 'settings/wallet/card/:cardID?',
        getRoute: (cardID) => `settings/wallet/card/${cardID}`,
    },
    SETTINGS_DOMAIN_CARD_DETAIL: {
        route: 'settings/card/:cardID?',
        getRoute: (cardID) => `settings/card/${cardID}`,
    },
    SETTINGS_REPORT_FRAUD: {
        route: 'settings/wallet/card/:cardID/report-virtual-fraud',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (cardID, backTo) => getUrlWithBackToParam(`settings/wallet/card/${cardID}/report-virtual-fraud`, backTo),
    },
    SETTINGS_REPORT_FRAUD_CONFIRMATION: {
        route: 'settings/wallet/card/:cardID/report-virtual-fraud-confirm',
        getRoute: (cardID) => `settings/wallet/card/${cardID}/report-virtual-fraud-confirm`,
    },
    SETTINGS_DOMAIN_CARD_REPORT_FRAUD: {
        route: 'settings/card/:cardID/report-virtual-fraud',
        getRoute: (cardID) => `settings/card/${cardID}/report-virtual-fraud`,
    },
    SETTINGS_ADD_DEBIT_CARD: 'settings/wallet/add-debit-card',
    SETTINGS_ADD_BANK_ACCOUNT: {
        route: 'settings/wallet/add-bank-account',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/wallet/add-bank-account', backTo),
    },
    SETTINGS_ADD_US_BANK_ACCOUNT: 'settings/wallet/add-us-bank-account',
    SETTINGS_ENABLE_PAYMENTS: 'settings/wallet/enable-payments',
    SETTINGS_WALLET_ENABLE_GLOBAL_REIMBURSEMENTS: {
        route: 'settings/wallet/:bankAccountID/enable-global-reimbursements',
        getRoute: (bankAccountID) => `settings/wallet/${bankAccountID}/enable-global-reimbursements`,
    },
    SETTINGS_WALLET_CARD_DIGITAL_DETAILS_UPDATE_ADDRESS: {
        route: 'settings/wallet/card/:domain/digital-details/update-address',
        getRoute: (domain) => `settings/wallet/card/${domain}/digital-details/update-address`,
    },
    SETTINGS_WALLET_TRANSFER_BALANCE: 'settings/wallet/transfer-balance',
    SETTINGS_WALLET_CHOOSE_TRANSFER_ACCOUNT: 'settings/wallet/choose-transfer-account',
    SETTINGS_WALLET_REPORT_CARD_LOST_OR_DAMAGED: {
        route: 'settings/wallet/card/:cardID/report-card-lost-or-damaged',
        getRoute: (cardID) => `settings/wallet/card/${cardID}/report-card-lost-or-damaged`,
    },
    SETTINGS_WALLET_CARD_ACTIVATE: {
        route: 'settings/wallet/card/:cardID/activate',
        getRoute: (cardID) => `settings/wallet/card/${cardID}/activate`,
    },
    SETTINGS_LEGAL_NAME: 'settings/profile/legal-name',
    SETTINGS_DATE_OF_BIRTH: 'settings/profile/date-of-birth',
    SETTINGS_PHONE_NUMBER: 'settings/profile/phone',
    SETTINGS_ADDRESS: 'settings/profile/address',
    SETTINGS_ADDRESS_COUNTRY: {
        route: 'settings/profile/address/country',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (country, backTo) => getUrlWithBackToParam(`settings/profile/address/country?country=${country}`, backTo),
    },
    SETTINGS_ADDRESS_STATE: {
        route: 'settings/profile/address/state',
        getRoute: (state, backTo, label) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        `${getUrlWithBackToParam(`settings/profile/address/state${state ? `?state=${encodeURIComponent(state)}` : ''}`, backTo)}${
        // the label param can be an empty string so we cannot use a nullish ?? operator
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        label ? `${backTo || state ? '&' : '?'}label=${encodeURIComponent(label)}` : ''}`,
    },
    SETTINGS_CONTACT_METHODS: {
        route: 'settings/profile/contact-methods',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/profile/contact-methods', backTo),
    },
    SETTINGS_CONTACT_METHOD_DETAILS: {
        route: 'settings/profile/contact-methods/:contactMethod/details',
        getRoute: (contactMethod, backTo, shouldSkipInitialValidation) => {
            const encodedMethod = encodeURIComponent(contactMethod);
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`settings/profile/contact-methods/${encodedMethod}/details${shouldSkipInitialValidation ? `?shouldSkipInitialValidation=true` : ``}`, backTo);
        },
    },
    SETTINGS_NEW_CONTACT_METHOD: {
        route: 'settings/profile/contact-methods/new',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/profile/contact-methods/new', backTo),
    },
    SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT: {
        route: 'settings/profile/contact-methods/verify',
        getRoute: (backTo, forwardTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(forwardTo ? `settings/profile/contact-methods/verify?forwardTo=${encodeURIComponent(forwardTo)}` : 'settings/profile/contact-methods/verify', backTo),
    },
    SETTINGS_2FA_ROOT: {
        route: 'settings/security/two-factor-auth',
        getRoute: (backTo, forwardTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(forwardTo ? `settings/security/two-factor-auth?forwardTo=${encodeURIComponent(forwardTo)}` : 'settings/security/two-factor-auth', backTo),
    },
    SETTINGS_2FA_VERIFY: {
        route: 'settings/security/two-factor-auth/verify',
        getRoute: (backTo, forwardTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(forwardTo ? `settings/security/two-factor-auth/verify?forwardTo=${encodeURIComponent(forwardTo)}` : 'settings/security/two-factor-auth/verify', backTo),
    },
    SETTINGS_2FA_SUCCESS: {
        route: 'settings/security/two-factor-auth/success',
        getRoute: (backTo, forwardTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(forwardTo ? `settings/security/two-factor-auth/success?forwardTo=${encodeURIComponent(forwardTo)}` : 'settings/security/two-factor-auth/success', backTo),
    },
    SETTINGS_2FA_DISABLED: 'settings/security/two-factor-auth/disabled',
    SETTINGS_2FA_DISABLE: 'settings/security/two-factor-auth/disable',
    SETTINGS_STATUS: 'settings/profile/status',
    SETTINGS_STATUS_CLEAR_AFTER: 'settings/profile/status/clear-after',
    SETTINGS_STATUS_CLEAR_AFTER_DATE: 'settings/profile/status/clear-after/date',
    SETTINGS_STATUS_CLEAR_AFTER_TIME: 'settings/profile/status/clear-after/time',
    SETTINGS_VACATION_DELEGATE: 'settings/profile/status/vacation-delegate',
    SETTINGS_TROUBLESHOOT: 'settings/troubleshoot',
    SETTINGS_CONSOLE: {
        route: 'settings/troubleshoot/console',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`settings/troubleshoot/console`, backTo),
    },
    SETTINGS_SHARE_LOG: {
        route: 'settings/troubleshoot/console/share-log',
        getRoute: (source) => `settings/troubleshoot/console/share-log?source=${encodeURI(source)}`,
    },
    SETTINGS_EXIT_SURVEY_REASON: {
        route: 'settings/exit-survey/reason',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/exit-survey/reason', backTo),
    },
    SETTINGS_EXIT_SURVEY_RESPONSE: {
        route: 'settings/exit-survey/response',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reason, backTo) => getUrlWithBackToParam(`settings/exit-survey/response${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`, backTo),
    },
    SETTINGS_EXIT_SURVEY_CONFIRM: {
        route: 'settings/exit-survey/confirm',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('settings/exit-survey/confirm', backTo),
    },
    SETTINGS_SAVE_THE_WORLD: 'settings/teachersunite',
    KEYBOARD_SHORTCUTS: {
        route: 'keyboard-shortcuts',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('keyboard-shortcuts', backTo),
    },
    NEW: 'new',
    NEW_CHAT: 'new/chat',
    NEW_CHAT_CONFIRM: 'new/chat/confirm',
    NEW_CHAT_EDIT_NAME: 'new/chat/confirm/name/edit',
    NEW_ROOM: 'new/room',
    NEW_REPORT_WORKSPACE_SELECTION: 'new-report-workspace-selection',
    REPORT: 'r',
    REPORT_WITH_ID: {
        route: 'r/:reportID?/:reportActionID?',
        getRoute: (reportID, reportActionID, referrer, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the REPORT_WITH_ID route');
            }
            const baseRoute = reportActionID ? `r/${reportID}/${reportActionID}` : `r/${reportID}`;
            const queryParams = [];
            if (referrer) {
                queryParams.push(`referrer=${encodeURIComponent(referrer)}`);
            }
            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${baseRoute}${queryString}`, backTo);
        },
    },
    REPORT_AVATAR: {
        route: 'r/:reportID/avatar',
        getRoute: (reportID, policyID) => {
            if (policyID) {
                return `r/${reportID}/avatar?policyID=${policyID}`;
            }
            return `r/${reportID}/avatar`;
        },
    },
    ATTACHMENTS: {
        route: 'attachment',
        getRoute: (params) => getAttachmentModalScreenRoute('attachment', params),
    },
    EDIT_CURRENCY_REQUEST: {
        route: 'r/:threadReportID/edit/currency',
        getRoute: (threadReportID, currency, backTo) => `r/${threadReportID}/edit/currency?currency=${currency}&backTo=${backTo}`,
    },
    EDIT_REPORT_FIELD_REQUEST: {
        route: 'r/:reportID/edit/policyField/:policyID/:fieldID',
        getRoute: (reportID, policyID, fieldID, backTo) => {
            if (!policyID || !reportID) {
                Log_1.default.warn('Invalid policyID or reportID is used to build the EDIT_REPORT_FIELD_REQUEST route', {
                    policyID,
                    reportID,
                });
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/edit/policyField/${policyID}/${encodeURIComponent(fieldID)}`, backTo);
        },
    },
    REPORT_WITH_ID_DETAILS_SHARE_CODE: {
        route: 'r/:reportID/details/shareCode',
        getRoute: (reportID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the REPORT_WITH_ID_DETAILS_SHARE_CODE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/details/shareCode`, backTo);
        },
    },
    REPORT_PARTICIPANTS: {
        route: 'r/:reportID/participants',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/participants`, backTo),
    },
    REPORT_PARTICIPANTS_INVITE: {
        route: 'r/:reportID/participants/invite',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/participants/invite`, backTo),
    },
    REPORT_PARTICIPANTS_DETAILS: {
        route: 'r/:reportID/participants/:accountID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, accountID, backTo) => getUrlWithBackToParam(`r/${reportID}/participants/${accountID}`, backTo),
    },
    REPORT_PARTICIPANTS_ROLE_SELECTION: {
        route: 'r/:reportID/participants/:accountID/role',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, accountID, backTo) => getUrlWithBackToParam(`r/${reportID}/participants/${accountID}/role`, backTo),
    },
    REPORT_WITH_ID_DETAILS: {
        route: 'r/:reportID/details',
        getRoute: (reportID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the REPORT_WITH_ID_DETAILS route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/details`, backTo);
        },
    },
    REPORT_WITH_ID_DETAILS_EXPORT: {
        route: 'r/:reportID/details/export/:connectionName',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, connectionName, backTo) => getUrlWithBackToParam(`r/${reportID}/details/export/${connectionName}`, backTo),
    },
    REPORT_WITH_ID_CHANGE_WORKSPACE: {
        route: 'r/:reportID/change-workspace',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/change-workspace`, backTo),
    },
    REPORT_SETTINGS: {
        route: 'r/:reportID/settings',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/settings`, backTo),
    },
    REPORT_SETTINGS_NAME: {
        route: 'r/:reportID/settings/name',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/settings/name`, backTo),
    },
    REPORT_SETTINGS_NOTIFICATION_PREFERENCES: {
        route: 'r/:reportID/settings/notification-preferences',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/settings/notification-preferences`, backTo),
    },
    REPORT_SETTINGS_WRITE_CAPABILITY: {
        route: 'r/:reportID/settings/who-can-post',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/settings/who-can-post`, backTo),
    },
    REPORT_SETTINGS_VISIBILITY: {
        route: 'r/:reportID/settings/visibility',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/settings/visibility`, backTo),
    },
    REPORT_CHANGE_APPROVER: {
        route: 'r/:reportID/change-approver',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/change-approver`, backTo),
    },
    REPORT_CHANGE_APPROVER_ADD_APPROVER: {
        route: 'r/:reportID/change-approver/add',
        getRoute: (reportID) => `r/${reportID}/change-approver/add`,
    },
    SPLIT_BILL_DETAILS: {
        route: 'r/:reportID/split/:reportActionID',
        getRoute: (reportID, reportActionID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the SPLIT_BILL_DETAILS route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/split/${reportActionID}`, backTo);
        },
    },
    TASK_TITLE: {
        route: 'r/:reportID/title',
        getRoute: (reportID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the TASK_TITLE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/title`, backTo);
        },
    },
    REPORT_DESCRIPTION: {
        route: 'r/:reportID/description',
        getRoute: (reportID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the REPORT_DESCRIPTION route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/description`, backTo);
        },
    },
    TASK_ASSIGNEE: {
        route: 'r/:reportID/assignee',
        getRoute: (reportID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the TASK_ASSIGNEE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/assignee`, backTo);
        },
    },
    PRIVATE_NOTES_LIST: {
        route: 'r/:reportID/notes',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/notes`, backTo),
    },
    PRIVATE_NOTES_EDIT: {
        route: 'r/:reportID/notes/:accountID/edit',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, accountID, backTo) => getUrlWithBackToParam(`r/${reportID}/notes/${accountID}/edit`, backTo),
    },
    ROOM_MEMBERS: {
        route: 'r/:reportID/members',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, backTo) => getUrlWithBackToParam(`r/${reportID}/members`, backTo),
    },
    ROOM_MEMBER_DETAILS: {
        route: 'r/:reportID/members/:accountID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (reportID, accountID, backTo) => getUrlWithBackToParam(`r/${reportID}/members/${accountID}`, backTo),
    },
    ROOM_INVITE: {
        route: 'r/:reportID/invite',
        getRoute: (reportID, backTo) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the ROOM_INVITE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/invite`, backTo);
        },
    },
    SPLIT_EXPENSE: {
        route: 'create/split-expense/overview/:reportID/:transactionID/:splitExpenseTransactionID?',
        getRoute: (reportID, originalTransactionID, splitExpenseTransactionID, backTo) => {
            if (!reportID || !originalTransactionID) {
                Log_1.default.warn(`Invalid ${reportID}(reportID) or ${originalTransactionID}(transactionID) is used to build the SPLIT_EXPENSE route`);
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`create/split-expense/overview/${reportID}/${originalTransactionID}${splitExpenseTransactionID ? `/${splitExpenseTransactionID}` : ''}`, backTo);
        },
    },
    SPLIT_EXPENSE_EDIT: {
        route: 'edit/split-expense/overview/:reportID/:transactionID/:splitExpenseTransactionID?',
        getRoute: (reportID, originalTransactionID, splitExpenseTransactionID, backTo) => {
            if (!reportID || !originalTransactionID) {
                Log_1.default.warn(`Invalid ${reportID}(reportID) or ${originalTransactionID}(transactionID) is used to build the SPLIT_EXPENSE_EDIT route`);
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`edit/split-expense/overview/${reportID}/${originalTransactionID}${splitExpenseTransactionID ? `/${splitExpenseTransactionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_HOLD_REASON: {
        route: ':type/edit/reason/:transactionID?/:searchHash?',
        getRoute: (type, transactionID, reportID, backTo, searchHash) => {
            const searchPart = searchHash ? `/${searchHash}` : '';
            const reportPart = reportID ? `&reportID=${reportID}` : '';
            return `${type}/edit/reason/${transactionID}${searchPart}/?backTo=${backTo}${reportPart}`;
        },
    },
    MONEY_REQUEST_CREATE: {
        route: ':action/:iouType/start/:transactionID/:reportID/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `${action}/${iouType}/start/${transactionID}/${reportID}/${backToReport ?? ''}`,
    },
    MONEY_REQUEST_STEP_SEND_FROM: {
        route: 'create/:iouType/from/:transactionID/:reportID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (iouType, transactionID, reportID, backTo = '') => getUrlWithBackToParam(`create/${iouType}/from/${transactionID}/${reportID}`, backTo),
    },
    MONEY_REQUEST_STEP_COMPANY_INFO: {
        route: 'create/:iouType/company-info/:transactionID/:reportID',
        getRoute: (iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`create/${iouType}/company-info/${transactionID}/${reportID}`, backTo),
    },
    MONEY_REQUEST_STEP_CONFIRMATION: {
        route: ':action/:iouType/confirmation/:transactionID/:reportID/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport, participantsAutoAssigned, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/confirmation/${transactionID}/${reportID}/${backToReport ?? ''}${participantsAutoAssigned ? '?participantsAutoAssigned=true' : ''}`, backTo),
    },
    MONEY_REQUEST_STEP_AMOUNT: {
        route: ':action/:iouType/amount/:transactionID/:reportID/:reportActionID?/:pageIndex?/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, reportActionID, pageIndex, backTo = '') => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_AMOUNT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/amount/${transactionID}/${reportID}/${reportActionID ? `${reportActionID}/` : ''}${pageIndex}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_TAX_RATE: {
        route: ':action/:iouType/taxRate/:transactionID/:reportID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_TAX_RATE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/taxRate/${transactionID}/${reportID}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_TAX_AMOUNT: {
        route: ':action/:iouType/taxAmount/:transactionID/:reportID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_TAX_AMOUNT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/taxAmount/${transactionID}/${reportID}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_CATEGORY: {
        route: ':action/:iouType/category/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_CATEGORY route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/category/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_ATTENDEE: {
        route: ':action/:iouType/attendees/:transactionID/:reportID',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_ATTENDEE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/attendees/${transactionID}/${reportID}`, backTo);
        },
    },
    MONEY_REQUEST_ACCOUNTANT: {
        route: ':action/:iouType/accountant/:transactionID/:reportID',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_ACCOUNTANT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/accountant/${transactionID}/${reportID}`, backTo);
        },
    },
    MONEY_REQUEST_UPGRADE: {
        route: ':action/:iouType/upgrade/:transactionID/:reportID',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/upgrade/${transactionID}/${reportID}`, backTo),
    },
    MONEY_REQUEST_STEP_DESTINATION: {
        route: ':action/:iouType/destination/:transactionID/:reportID',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/destination/${transactionID}/${reportID}`, backTo),
    },
    MONEY_REQUEST_STEP_TIME: {
        route: ':action/:iouType/time/:transactionID/:reportID',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/time/${transactionID}/${reportID}`, backTo),
    },
    MONEY_REQUEST_STEP_SUBRATE: {
        route: ':action/:iouType/subrate/:transactionID/:reportID/:pageIndex',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/subrate/${transactionID}/${reportID}/0`, backTo),
    },
    MONEY_REQUEST_STEP_DESTINATION_EDIT: {
        route: ':action/:iouType/destination/:transactionID/:reportID/edit',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/destination/${transactionID}/${reportID}/edit`, backTo),
    },
    MONEY_REQUEST_STEP_TIME_EDIT: {
        route: ':action/:iouType/time/:transactionID/:reportID/edit',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/time/${transactionID}/${reportID}/edit`, backTo),
    },
    MONEY_REQUEST_STEP_SUBRATE_EDIT: {
        route: ':action/:iouType/subrate/:transactionID/:reportID/edit/:pageIndex',
        getRoute: (action, iouType, transactionID, reportID, pageIndex = 0, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/subrate/${transactionID}/${reportID}/edit/${pageIndex}`, backTo),
    },
    MONEY_REQUEST_STEP_REPORT: {
        route: ':action/:iouType/report/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/report/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo),
    },
    MONEY_REQUEST_RECEIPT_PREVIEW: {
        route: ':action/:iouType/receipt/:transactionID/:reportID',
        getRoute: (reportID, transactionID, action, iouType) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the MONEY_REQUEST_RECEIPT_PREVIEW route');
            }
            if (!transactionID) {
                Log_1.default.warn('Invalid transactionID is used to build the MONEY_REQUEST_RECEIPT_PREVIEW route');
            }
            return `${action}/${iouType}/receipt/${transactionID}/${reportID}?readonly=false`;
        },
    },
    MONEY_REQUEST_EDIT_REPORT: {
        route: ':action/:iouType/report/:reportID/edit',
        getRoute: (action, iouType, reportID, shouldTurnOffSelectionMode, backTo = '') => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID while building route MONEY_REQUEST_EDIT_REPORT');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/report/${reportID}/edit${shouldTurnOffSelectionMode ? '?shouldTurnOffSelectionMode=true' : ''}`, backTo);
        },
    },
    SETTINGS_TAGS_ROOT: {
        route: 'settings/:policyID/tags',
        getRoute: (policyID, backTo = '') => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID while building route SETTINGS_TAGS_ROOT');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`settings/${policyID}/tags`, backTo);
        },
    },
    SETTINGS_TAGS_SETTINGS: {
        route: 'settings/:policyID/tags/settings',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/tags/settings`, backTo),
    },
    SETTINGS_TAGS_EDIT: {
        route: 'settings/:policyID/tags/:orderWeight/edit',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, orderWeight, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/tags/${orderWeight}/edit`, backTo),
    },
    SETTINGS_TAG_CREATE: {
        route: 'settings/:policyID/tags/new',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/tags/new`, backTo),
    },
    SETTINGS_TAG_EDIT: {
        route: 'settings/:policyID/tag/:orderWeight/:tagName/edit',
        getRoute: (policyID, orderWeight, tagName, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`settings/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}/edit`, backTo),
    },
    SETTINGS_TAG_SETTINGS: {
        route: 'settings/:policyID/tag/:orderWeight/:tagName',
        getRoute: (policyID, orderWeight, tagName, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`settings/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}`, backTo),
    },
    SETTINGS_TAG_APPROVER: {
        route: 'settings/:policyID/tag/:orderWeight/:tagName/approver',
        getRoute: (policyID, orderWeight, tagName, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`settings/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}/approver`, backTo),
    },
    SETTINGS_TAG_LIST_VIEW: {
        route: 'settings/:policyID/tag-list/:orderWeight',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, orderWeight, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/tag-list/${orderWeight}`, backTo),
    },
    SETTINGS_TAG_GL_CODE: {
        route: 'settings/:policyID/tag/:orderWeight/:tagName/gl-code',
        getRoute: (policyID, orderWeight, tagName, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`settings/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}/gl-code`, backTo),
    },
    SETTINGS_TAGS_IMPORT: {
        route: 'settings/:policyID/tags/import',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/tags/import`, backTo),
    },
    SETTINGS_TAGS_IMPORTED: {
        route: 'settings/:policyID/tags/imported',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/tags/imported`, backTo),
    },
    SETTINGS_CATEGORIES_ROOT: {
        route: 'settings/:policyID/categories',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/categories`, backTo),
    },
    SETTINGS_CATEGORY_SETTINGS: {
        route: 'settings/:policyID/category/:categoryName',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, categoryName, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/category/${encodeURIComponent(categoryName)}`, backTo),
    },
    SETTINGS_CATEGORIES_SETTINGS: {
        route: 'settings/:policyID/categories/settings',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/categories/settings`, backTo),
    },
    SETTINGS_CATEGORY_CREATE: {
        route: 'settings/:policyID/categories/new',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/categories/new`, backTo),
    },
    SETTINGS_CATEGORY_EDIT: {
        route: 'settings/:policyID/category/:categoryName/edit',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, categoryName, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/category/${encodeURIComponent(categoryName)}/edit`, backTo),
    },
    SETTINGS_CATEGORIES_IMPORT: {
        route: 'settings/:policyID/categories/import',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/categories/import`, backTo),
    },
    SETTINGS_CATEGORIES_IMPORTED: {
        route: 'settings/:policyID/categories/imported',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo = '') => getUrlWithBackToParam(`settings/${policyID}/categories/imported`, backTo),
    },
    SETTINGS_CATEGORY_PAYROLL_CODE: {
        route: 'settings/:policyID/category/:categoryName/payroll-code',
        getRoute: (policyID, categoryName, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`settings/${policyID}/category/${encodeURIComponent(categoryName)}/payroll-code`, backTo),
    },
    SETTINGS_CATEGORY_GL_CODE: {
        route: 'settings/:policyID/category/:categoryName/gl-code',
        getRoute: (policyID, categoryName, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`settings/${policyID}/category/${encodeURIComponent(categoryName)}/gl-code`, backTo),
    },
    MONEY_REQUEST_STEP_CURRENCY: {
        route: ':action/:iouType/currency/:transactionID/:reportID/:pageIndex?',
        getRoute: (action, iouType, transactionID, reportID, pageIndex = '', currency = '', backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/currency/${transactionID}/${reportID}/${pageIndex}?currency=${currency}`, backTo),
    },
    MONEY_REQUEST_STEP_DATE: {
        route: ':action/:iouType/date/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_DATE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/date/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_DESCRIPTION: {
        route: ':action/:iouType/description/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_DESCRIPTION route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/description/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_DISTANCE: {
        route: ':action/:iouType/distance/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_DISTANCE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/distance/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_DISTANCE_RATE: {
        route: ':action/:iouType/distanceRate/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_DISTANCE_RATE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/distanceRate/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_MERCHANT: {
        route: ':action/:iouType/merchant/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, transactionID, reportID, backTo = '', reportActionID) => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_MERCHANT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/merchant/${transactionID}/${reportID}${reportActionID ? `/${reportActionID}` : ''}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_PARTICIPANTS: {
        route: ':action/:iouType/participants/:transactionID/:reportID',
        getRoute: (iouType, transactionID, reportID, backTo = '', action = 'create') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/participants/${transactionID}/${reportID}`, backTo),
    },
    MONEY_REQUEST_STEP_SPLIT_PAYER: {
        route: ':action/:iouType/confirmation/:transactionID/:reportID/payer',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/confirmation/${transactionID}/${reportID}/payer`, backTo),
    },
    MONEY_REQUEST_STEP_SCAN: {
        route: ':action/:iouType/scan/:transactionID/:reportID',
        getRoute: (action, iouType, transactionID, reportID, backTo = '') => {
            if (!transactionID || !reportID) {
                Log_1.default.warn('Invalid transactionID or reportID is used to build the MONEY_REQUEST_STEP_SCAN route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`${action}/${iouType}/scan/${transactionID}/${reportID}`, backTo);
        },
    },
    MONEY_REQUEST_STEP_TAG: {
        route: ':action/:iouType/tag/:orderWeight/:transactionID/:reportID/:reportActionID?',
        getRoute: (action, iouType, orderWeight, transactionID, reportID, backTo = '', reportActionID) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/tag/${orderWeight}/${transactionID}${reportID ? `/${reportID}` : ''}${reportActionID ? `/${reportActionID}` : ''}`, backTo),
    },
    MONEY_REQUEST_STEP_WAYPOINT: {
        route: ':action/:iouType/waypoint/:transactionID/:reportID/:pageIndex',
        getRoute: (action, iouType, transactionID, reportID, pageIndex = '', backTo = '') => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`${action}/${iouType}/waypoint/${transactionID}/${reportID}/${pageIndex}`, backTo),
    },
    // This URL is used as a redirect to one of the create tabs below. This is so that we can message users with a link
    // straight to those flows without needing to have optimistic transaction and report IDs.
    MONEY_REQUEST_START: {
        route: 'start/:iouType/:iouRequestType',
        getRoute: (iouType, iouRequestType) => `start/${iouType}/${iouRequestType}`,
    },
    MONEY_REQUEST_CREATE_TAB_DISTANCE: {
        route: 'distance/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `create/${iouType}/start/${transactionID}/${reportID}/distance/${backToReport ?? ''}`,
    },
    MONEY_REQUEST_CREATE_TAB_MANUAL: {
        route: 'manual/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `${action}/${iouType}/start/${transactionID}/${reportID}/manual/${backToReport ?? ''}`,
    },
    MONEY_REQUEST_CREATE_TAB_SCAN: {
        route: 'scan/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `create/${iouType}/start/${transactionID}/${reportID}/scan/${backToReport ?? ''}`,
    },
    MONEY_REQUEST_CREATE_TAB_PER_DIEM: {
        route: 'per-diem/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `create/${iouType}/start/${transactionID}/${reportID}/per-diem/${backToReport ?? ''}`,
    },
    MONEY_REQUEST_RECEIPT_VIEW: {
        route: 'receipt-view/:transactionID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (transactionID, backTo) => getUrlWithBackToParam(`receipt-view/${transactionID}`, backTo),
    },
    MONEY_REQUEST_STATE_SELECTOR: {
        route: 'submit/state',
        getRoute: (state, backTo, label) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        `${getUrlWithBackToParam(`submit/state${state ? `?state=${encodeURIComponent(state)}` : ''}`, backTo)}${
        // the label param can be an empty string so we cannot use a nullish ?? operator
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        label ? `${backTo || state ? '&' : '?'}label=${encodeURIComponent(label)}` : ''}`,
    },
    DISTANCE_REQUEST_CREATE: {
        route: ':action/:iouType/start/:transactionID/:reportID/distance-new/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `${action}/${iouType}/start/${transactionID}/${reportID}/distance-new/${backToReport ?? ''}`,
    },
    DISTANCE_REQUEST_CREATE_TAB_MAP: {
        route: 'distance-map/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `${action}/${iouType}/start/${transactionID}/${reportID}/distance-new/distance-map/${backToReport ?? ''}`,
    },
    DISTANCE_REQUEST_CREATE_TAB_MANUAL: {
        route: 'distance-manual/:backToReport?',
        getRoute: (action, iouType, transactionID, reportID, backToReport) => `${action}/${iouType}/start/${transactionID}/${reportID}/distance-new/distance-manual/${backToReport ?? ''}`,
    },
    IOU_SEND_ADD_BANK_ACCOUNT: 'pay/new/add-bank-account',
    IOU_SEND_ADD_DEBIT_CARD: 'pay/new/add-debit-card',
    IOU_SEND_ENABLE_PAYMENTS: 'pay/new/enable-payments',
    NEW_TASK: {
        route: 'new/task',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('new/task', backTo),
    },
    NEW_TASK_ASSIGNEE: {
        route: 'new/task/assignee',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('new/task/assignee', backTo),
    },
    NEW_TASK_SHARE_DESTINATION: 'new/task/share-destination',
    NEW_TASK_DETAILS: {
        route: 'new/task/details',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('new/task/details', backTo),
    },
    NEW_TASK_TITLE: {
        route: 'new/task/title',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('new/task/title', backTo),
    },
    NEW_TASK_DESCRIPTION: {
        route: 'new/task/description',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('new/task/description', backTo),
    },
    TEACHERS_UNITE: 'settings/teachersunite',
    I_KNOW_A_TEACHER: 'settings/teachersunite/i-know-a-teacher',
    I_AM_A_TEACHER: 'settings/teachersunite/i-am-a-teacher',
    INTRO_SCHOOL_PRINCIPAL: 'settings/teachersunite/intro-school-principal',
    ERECEIPT: {
        route: 'eReceipt/:transactionID',
        getRoute: (transactionID) => `eReceipt/${transactionID}`,
    },
    WORKSPACE_NEW: 'workspace/new',
    WORKSPACE_NEW_ROOM: 'workspace/new-room',
    WORKSPACE_INITIAL: {
        route: 'workspaces/:policyID',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_INITIAL route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return `${getUrlWithBackToParam(`workspaces/${policyID}`, backTo)}`;
        },
    },
    WORKSPACE_INVITE: {
        route: 'workspaces/:policyID/invite',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => `${getUrlWithBackToParam(`workspaces/${policyID}/invite`, backTo)}`,
    },
    WORKSPACE_INVITE_MESSAGE: {
        route: 'workspaces/:policyID/invite-message',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => `${getUrlWithBackToParam(`workspaces/${policyID}/invite-message`, backTo)}`,
    },
    WORKSPACE_INVITE_MESSAGE_ROLE: {
        route: 'workspaces/:policyID/invite-message/role',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => `${getUrlWithBackToParam(`workspaces/${policyID}/invite-message/role`, backTo)}`,
    },
    WORKSPACE_OVERVIEW: {
        route: 'workspaces/:policyID/overview',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_OVERVIEW route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/overview`, backTo);
        },
    },
    WORKSPACE_OVERVIEW_ADDRESS: {
        route: 'workspaces/:policyID/overview/address',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_OVERVIEW_ADDRESS route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/overview/address`, backTo);
        },
    },
    WORKSPACE_OVERVIEW_PLAN: {
        route: 'workspaces/:policyID/overview/plan',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/overview/plan`, backTo),
    },
    WORKSPACE_ACCOUNTING: {
        route: 'workspaces/:policyID/accounting',
        getRoute: (policyID) => `workspaces/${policyID}/accounting`,
    },
    WORKSPACE_OVERVIEW_CURRENCY: {
        route: 'workspaces/:policyID/overview/currency',
        getRoute: (policyID) => `workspaces/${policyID}/overview/currency`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export`, backTo, false);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/company-card-expense-account',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/company-card-expense-account`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/company-card-expense-account/account-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/company-card-expense-account/account-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/company-card-expense-account/default-vendor-select',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT route');
            }
            return `workspaces/${policyID}/accounting/quickbooks-online/export/company-card-expense-account/default-vendor-select`;
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/company-card-expense-account/card-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/company-card-expense-account/card-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/invoice-account-select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/invoice-account-select`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_PREFERRED_EXPORTER: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/preferred-exporter',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/preferred-exporter`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/out-of-pocket-expense',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/out-of-pocket-expense`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/out-of-pocket-expense/account-select',
        getRoute: (policyID, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/out-of-pocket-expense/account-select`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/out-of-pocket-expense/entity-select',
        getRoute: (policyID, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/out-of-pocket-expense/entity-select`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_DATE_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/export/date-select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-online/export/date-select`, backTo),
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/company-card-expense-account/account-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/company-card-expense-account/account-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/company-card-expense-account/card-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/company-card-expense-account/card-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/company-card-expense-account/default-vendor-select',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT route');
            }
            return `workspaces/${policyID}/accounting/quickbooks-desktop/export/company-card-expense-account/default-vendor-select`;
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/company-card-expense-account',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/company-card-expense-account`, backTo);
        },
    },
    WORKSPACE_ACCOUNTING_QUICKBOOKS_DESKTOP_ADVANCED: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/advanced',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_ACCOUNTING_QUICKBOOKS_DESKTOP_ADVANCED route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/advanced`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/date-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/date-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_PREFERRED_EXPORTER: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/preferred-exporter',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_PREFERRED_EXPORTER route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/preferred-exporter`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/out-of-pocket-expense',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/out-of-pocket-expense`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/out-of-pocket-expense/account-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/out-of-pocket-expense/account-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export/out-of-pocket-expense/entity-select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export/out-of-pocket-expense/entity-select`, backTo);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/export',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/quickbooks-desktop/export`, backTo, false);
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_MODAL: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/setup-modal',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/setup-modal`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/setup-required-device',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/setup-required-device`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_TRIGGER_FIRST_SYNC: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/trigger-first-sync',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/trigger-first-sync`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_IMPORT: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CHART_OF_ACCOUNTS: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import/accounts',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import/accounts`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import/classes',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import/classes`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES_DISPLAYED_AS: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import/classes/displayed_as',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import/classes/displayed_as`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CUSTOMERS: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import/customers',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import/customers`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CUSTOMERS_DISPLAYED_AS: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import/customers/displayed_as',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import/customers/displayed_as`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_ITEMS: {
        route: 'workspaces/:policyID/accounting/quickbooks-desktop/import/items',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-desktop/import/items`,
    },
    WORKSPACE_OVERVIEW_NAME: {
        route: 'workspaces/:policyID/overview/name',
        getRoute: (policyID) => `workspaces/${policyID}/overview/name`,
    },
    WORKSPACE_OVERVIEW_DESCRIPTION: {
        route: 'workspaces/:policyID/overview/description',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_OVERVIEW_DESCRIPTION route');
            }
            return `workspaces/${policyID}/overview/description`;
        },
    },
    WORKSPACE_OVERVIEW_SHARE: {
        route: 'workspaces/:policyID/overview/share',
        getRoute: (policyID) => `workspaces/${policyID}/overview/share`,
    },
    WORKSPACE_AVATAR: {
        route: 'workspaces/:policyID/avatar',
        getRoute: (policyID, fallbackLetter) => `workspaces/${policyID}/avatar${fallbackLetter ? `?letter=${fallbackLetter}` : ''}`,
    },
    WORKSPACE_JOIN_USER: {
        route: 'workspaces/:policyID/join',
        getRoute: (policyID, inviterEmail) => `workspaces/${policyID}/join?email=${inviterEmail}`,
    },
    WORKSPACE_SETTINGS_CURRENCY: {
        route: 'workspaces/:policyID/settings/currency',
        getRoute: (policyID) => `workspaces/${policyID}/settings/currency`,
    },
    WORKSPACE_WORKFLOWS: {
        route: 'workspaces/:policyID/workflows',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_WORKFLOWS route');
            }
            return `workspaces/${policyID}/workflows`;
        },
    },
    WORKSPACE_WORKFLOWS_APPROVALS_NEW: {
        route: 'workspaces/:policyID/workflows/approvals/new',
        getRoute: (policyID) => `workspaces/${policyID}/workflows/approvals/new`,
    },
    WORKSPACE_WORKFLOWS_APPROVALS_EDIT: {
        route: 'workspaces/:policyID/workflows/approvals/:firstApproverEmail/edit',
        getRoute: (policyID, firstApproverEmail) => `workspaces/${policyID}/workflows/approvals/${encodeURIComponent(firstApproverEmail)}/edit`,
    },
    WORKSPACE_WORKFLOWS_APPROVALS_EXPENSES_FROM: {
        route: 'workspaces/:policyID/workflows/approvals/expenses-from',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/workflows/approvals/expenses-from`, backTo),
    },
    WORKSPACE_WORKFLOWS_APPROVALS_APPROVER: {
        route: 'workspaces/:policyID/workflows/approvals/approver',
        getRoute: (policyID, approverIndex, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/workflows/approvals/approver?approverIndex=${approverIndex}`, backTo),
    },
    WORKSPACE_WORKFLOWS_PAYER: {
        route: 'workspaces/:policyID/workflows/payer',
        getRoute: (policyId) => `workspaces/${policyId}/workflows/payer`,
    },
    WORKSPACE_WORKFLOWS_AUTOREPORTING_FREQUENCY: {
        route: 'workspaces/:policyID/workflows/auto-reporting-frequency',
        getRoute: (policyID) => `workspaces/${policyID}/workflows/auto-reporting-frequency`,
    },
    WORKSPACE_WORKFLOWS_AUTOREPORTING_MONTHLY_OFFSET: {
        route: 'workspaces/:policyID/workflows/auto-reporting-frequency/monthly-offset',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_WORKFLOWS_AUTOREPORTING_MONTHLY_OFFSET route');
            }
            return `workspaces/${policyID}/workflows/auto-reporting-frequency/monthly-offset`;
        },
    },
    WORKSPACE_INVOICES: {
        route: 'workspaces/:policyID/invoices',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_INVOICES route');
            }
            return `workspaces/${policyID}/invoices`;
        },
    },
    WORKSPACE_INVOICES_COMPANY_NAME: {
        route: 'workspaces/:policyID/invoices/company-name',
        getRoute: (policyID) => `workspaces/${policyID}/invoices/company-name`,
    },
    WORKSPACE_INVOICES_COMPANY_WEBSITE: {
        route: 'workspaces/:policyID/invoices/company-website',
        getRoute: (policyID) => `workspaces/${policyID}/invoices/company-website`,
    },
    WORKSPACE_MEMBERS: {
        route: 'workspaces/:policyID/members',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_MEMBERS route');
            }
            return `workspaces/${policyID}/members`;
        },
    },
    WORKSPACE_MEMBERS_IMPORT: {
        route: 'workspaces/:policyID/members/import',
        getRoute: (policyID) => `workspaces/${policyID}/members/import`,
    },
    WORKSPACE_MEMBERS_IMPORTED: {
        route: 'workspaces/:policyID/members/imported',
        getRoute: (policyID) => `workspaces/${policyID}/members/imported`,
    },
    WORKSPACE_MEMBERS_IMPORTED_CONFIRMATION: {
        route: 'workspaces/:policyID/members/imported/confirmation',
        getRoute: (policyID) => `workspaces/${policyID}/members/imported/confirmation`,
    },
    POLICY_ACCOUNTING: {
        route: 'workspaces/:policyID/accounting',
        getRoute: (policyID, newConnectionName, integrationToDisconnect, shouldDisconnectIntegrationBeforeConnecting) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING route');
            }
            let queryParams = '';
            if (newConnectionName) {
                queryParams += `?newConnectionName=${newConnectionName}`;
                if (integrationToDisconnect) {
                    queryParams += `&integrationToDisconnect=${integrationToDisconnect}`;
                }
                if (shouldDisconnectIntegrationBeforeConnecting !== undefined) {
                    queryParams += `&shouldDisconnectIntegrationBeforeConnecting=${shouldDisconnectIntegrationBeforeConnecting}`;
                }
            }
            return `workspaces/${policyID}/accounting${queryParams}`;
        },
    },
    WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ADVANCED: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/advanced',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ADVANCED route');
            }
            return `workspaces/${policyID}/accounting/quickbooks-online/advanced`;
        },
    },
    WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ACCOUNT_SELECTOR: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/account-selector',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/account-selector`,
    },
    WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECTOR: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/invoice-account-selector',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/invoice-account-selector`,
    },
    WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_AUTO_SYNC: {
        route: 'workspaces/:policyID/connections/quickbooks-online/advanced/autosync',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/connections/quickbooks-online/advanced/autosync`, backTo),
    },
    WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ACCOUNTING_METHOD: {
        route: 'workspaces/:policyID/connections/quickbooks-online/advanced/autosync/accounting-method',
        getRoute: (policyID, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/connections/quickbooks-online/advanced/autosync/accounting-method`, backTo),
    },
    WORKSPACE_ACCOUNTING_CARD_RECONCILIATION: {
        route: 'workspaces/:policyID/accounting/:connection/card-reconciliation',
        getRoute: (policyID, connection) => `workspaces/${policyID}/accounting/${connection}/card-reconciliation`,
    },
    WORKSPACE_ACCOUNTING_RECONCILIATION_ACCOUNT_SETTINGS: {
        route: 'workspaces/:policyID/accounting/:connection/card-reconciliation/account',
        getRoute: (policyID, connection, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_ACCOUNTING_RECONCILIATION_ACCOUNT_SETTINGS route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/${connection}/card-reconciliation/account`, backTo);
        },
    },
    WORKSPACE_CATEGORIES: {
        route: 'workspaces/:policyID/categories',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_CATEGORIES route');
            }
            return `workspaces/${policyID}/categories`;
        },
    },
    WORKSPACE_CATEGORY_SETTINGS: {
        route: 'workspaces/:policyID/category/:categoryName',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}`,
    },
    WORKSPACE_UPGRADE: {
        route: 'workspaces/:policyID?/upgrade/:featureName?',
        getRoute: (policyID, featureName, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(policyID ? `workspaces/${policyID}/upgrade/${encodeURIComponent(featureName ?? '')}` : `workspaces/upgrade`, backTo),
    },
    WORKSPACE_DOWNGRADE: {
        route: 'workspaces/:policyID?/downgrade/',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(policyID ? `workspaces/${policyID}/downgrade/` : `workspaces/downgrade`, backTo),
    },
    WORKSPACE_PAY_AND_DOWNGRADE: {
        route: 'workspaces/pay-and-downgrade/',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`workspaces/pay-and-downgrade`, backTo),
    },
    WORKSPACE_CATEGORIES_SETTINGS: {
        route: 'workspaces/:policyID/categories/settings',
        getRoute: (policyID) => `workspaces/${policyID}/categories/settings`,
    },
    WORKSPACE_CATEGORIES_IMPORT: {
        route: 'workspaces/:policyID/categories/import',
        getRoute: (policyID) => `workspaces/${policyID}/categories/import`,
    },
    WORKSPACE_CATEGORIES_IMPORTED: {
        route: 'workspaces/:policyID/categories/imported',
        getRoute: (policyID) => `workspaces/${policyID}/categories/imported`,
    },
    WORKSPACE_CATEGORY_CREATE: {
        route: 'workspaces/:policyID/categories/new',
        getRoute: (policyID) => `workspaces/${policyID}/categories/new`,
    },
    WORKSPACE_CATEGORY_EDIT: {
        route: 'workspaces/:policyID/category/:categoryName/edit',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/edit`,
    },
    WORKSPACE_CATEGORY_PAYROLL_CODE: {
        route: 'workspaces/:policyID/category/:categoryName/payroll-code',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/payroll-code`,
    },
    WORKSPACE_CATEGORY_GL_CODE: {
        route: 'workspaces/:policyID/category/:categoryName/gl-code',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/gl-code`,
    },
    WORKSPACE_CATEGORY_DEFAULT_TAX_RATE: {
        route: 'workspaces/:policyID/category/:categoryName/tax-rate',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/tax-rate`,
    },
    WORKSPACE_CATEGORY_FLAG_AMOUNTS_OVER: {
        route: 'workspaces/:policyID/category/:categoryName/flag-amounts',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/flag-amounts`,
    },
    WORKSPACE_CATEGORY_DESCRIPTION_HINT: {
        route: 'workspaces/:policyID/category/:categoryName/description-hint',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/description-hint`,
    },
    WORKSPACE_CATEGORY_REQUIRE_RECEIPTS_OVER: {
        route: 'workspaces/:policyID/category/:categoryName/require-receipts-over',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/require-receipts-over`,
    },
    WORKSPACE_CATEGORY_APPROVER: {
        route: 'workspaces/:policyID/category/:categoryName/approver',
        getRoute: (policyID, categoryName) => `workspaces/${policyID}/category/${encodeURIComponent(categoryName)}/approver`,
    },
    WORKSPACE_MORE_FEATURES: {
        route: 'workspaces/:policyID/more-features',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_MORE_FEATURES route');
            }
            return `workspaces/${policyID}/more-features`;
        },
    },
    WORKSPACE_TAGS: {
        route: 'workspaces/:policyID/tags',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_TAGS route');
            }
            return `workspaces/${policyID}/tags`;
        },
    },
    WORKSPACE_TAG_CREATE: {
        route: 'workspaces/:policyID/tags/new',
        getRoute: (policyID) => `workspaces/${policyID}/tags/new`,
    },
    WORKSPACE_TAGS_SETTINGS: {
        route: 'workspaces/:policyID/tags/settings',
        getRoute: (policyID) => `workspaces/${policyID}/tags/settings`,
    },
    WORKSPACE_EDIT_TAGS: {
        route: 'workspaces/:policyID/tags/:orderWeight/edit',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, orderWeight, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/tags/${orderWeight}/edit`, backTo),
    },
    WORKSPACE_TAG_EDIT: {
        route: 'workspaces/:policyID/tag/:orderWeight/:tagName/edit',
        getRoute: (policyID, orderWeight, tagName) => `workspaces/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}/edit`,
    },
    WORKSPACE_TAG_SETTINGS: {
        route: 'workspaces/:policyID/tag/:orderWeight/:tagName',
        getRoute: (policyID, orderWeight, tagName, parentTagsFilter) => {
            let queryParams = '';
            if (parentTagsFilter) {
                queryParams += `?parentTagsFilter=${parentTagsFilter}`;
            }
            return `workspaces/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}${queryParams}`;
        },
    },
    WORKSPACE_TAG_APPROVER: {
        route: 'workspaces/:policyID/tag/:orderWeight/:tagName/approver',
        getRoute: (policyID, orderWeight, tagName) => `workspaces/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}/approver`,
    },
    WORKSPACE_TAG_LIST_VIEW: {
        route: 'workspaces/:policyID/tag-list/:orderWeight',
        getRoute: (policyID, orderWeight) => `workspaces/${policyID}/tag-list/${orderWeight}`,
    },
    WORKSPACE_TAG_GL_CODE: {
        route: 'workspaces/:policyID/tag/:orderWeight/:tagName/gl-code',
        getRoute: (policyID, orderWeight, tagName) => `workspaces/${policyID}/tag/${orderWeight}/${encodeURIComponent(tagName)}/gl-code`,
    },
    WORKSPACE_TAGS_IMPORT: {
        route: 'workspaces/:policyID/tags/import',
        getRoute: (policyID) => `workspaces/${policyID}/tags/import`,
    },
    WORKSPACE_MULTI_LEVEL_TAGS_IMPORT_SETTINGS: {
        route: 'workspaces/:policyID/tags/import/multi-level',
        getRoute: (policyID) => `workspaces/${policyID}/tags/import/multi-level`,
    },
    WORKSPACE_TAGS_IMPORT_OPTIONS: {
        route: 'workspaces/:policyID/tags/import/import-options',
        getRoute: (policyID) => `workspaces/${policyID}/tags/import/import-options`,
    },
    WORKSPACE_TAGS_IMPORTED: {
        route: 'workspaces/:policyID/tags/imported',
        getRoute: (policyID) => `workspaces/${policyID}/tags/imported`,
    },
    WORKSPACE_TAGS_IMPORTED_MULTI_LEVEL: {
        route: 'workspaces/:policyID/tags/imported/multi-level',
        getRoute: (policyID) => `workspaces/${policyID}/tags/imported/multi-level`,
    },
    WORKSPACE_TAXES: {
        route: 'workspaces/:policyID/taxes',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_TAXES route');
            }
            return `workspaces/${policyID}/taxes`;
        },
    },
    WORKSPACE_TAXES_SETTINGS: {
        route: 'workspaces/:policyID/taxes/settings',
        getRoute: (policyID) => `workspaces/${policyID}/taxes/settings`,
    },
    WORKSPACE_TAXES_SETTINGS_WORKSPACE_CURRENCY_DEFAULT: {
        route: 'workspaces/:policyID/taxes/settings/workspace-currency',
        getRoute: (policyID) => `workspaces/${policyID}/taxes/settings/workspace-currency`,
    },
    WORKSPACE_TAXES_SETTINGS_FOREIGN_CURRENCY_DEFAULT: {
        route: 'workspaces/:policyID/taxes/settings/foreign-currency',
        getRoute: (policyID) => `workspaces/${policyID}/taxes/settings/foreign-currency`,
    },
    WORKSPACE_TAXES_SETTINGS_CUSTOM_TAX_NAME: {
        route: 'workspaces/:policyID/taxes/settings/tax-name',
        getRoute: (policyID) => `workspaces/${policyID}/taxes/settings/tax-name`,
    },
    WORKSPACE_MEMBER_DETAILS: {
        route: 'workspaces/:policyID/members/:accountID',
        getRoute: (policyID, accountID) => `workspaces/${policyID}/members/${accountID}`,
    },
    WORKSPACE_CUSTOM_FIELDS: {
        route: 'workspaces/:policyID/members/:accountID/:customFieldType',
        getRoute: (policyID, accountID, customFieldType) => `/workspaces/${policyID}/members/${accountID}/${customFieldType}`,
    },
    WORKSPACE_MEMBER_NEW_CARD: {
        route: 'workspaces/:policyID/members/:accountID/new-card',
        getRoute: (policyID, accountID) => `workspaces/${policyID}/members/${accountID}/new-card`,
    },
    WORKSPACE_MEMBER_ROLE_SELECTION: {
        route: 'workspaces/:policyID/members/:accountID/role-selection',
        getRoute: (policyID, accountID) => `workspaces/${policyID}/members/${accountID}/role-selection`,
    },
    WORKSPACE_OWNER_CHANGE_SUCCESS: {
        route: 'workspaces/:policyID/change-owner/:accountID/success',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, accountID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/change-owner/${accountID}/success`, backTo),
    },
    WORKSPACE_OWNER_CHANGE_ERROR: {
        route: 'workspaces/:policyID/change-owner/:accountID/failure',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, accountID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/change-owner/${accountID}/failure`, backTo),
    },
    WORKSPACE_OWNER_CHANGE_CHECK: {
        route: 'workspaces/:policyID/change-owner/:accountID/:error',
        getRoute: (policyID, accountID, error, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_OWNER_CHANGE_CHECK route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/change-owner/${accountID}/${error}`, backTo);
        },
    },
    WORKSPACE_TAX_CREATE: {
        route: 'workspaces/:policyID/taxes/new',
        getRoute: (policyID) => `workspaces/${policyID}/taxes/new`,
    },
    WORKSPACE_TAX_EDIT: {
        route: 'workspaces/:policyID/tax/:taxID',
        getRoute: (policyID, taxID) => `workspaces/${policyID}/tax/${encodeURIComponent(taxID)}`,
    },
    WORKSPACE_TAX_NAME: {
        route: 'workspaces/:policyID/tax/:taxID/name',
        getRoute: (policyID, taxID) => `workspaces/${policyID}/tax/${encodeURIComponent(taxID)}/name`,
    },
    WORKSPACE_TAX_VALUE: {
        route: 'workspaces/:policyID/tax/:taxID/value',
        getRoute: (policyID, taxID) => `workspaces/${policyID}/tax/${encodeURIComponent(taxID)}/value`,
    },
    WORKSPACE_TAX_CODE: {
        route: 'workspaces/:policyID/tax/:taxID/tax-code',
        getRoute: (policyID, taxID) => `workspaces/${policyID}/tax/${encodeURIComponent(taxID)}/tax-code`,
    },
    WORKSPACE_REPORTS: {
        route: 'workspaces/:policyID/reports',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_REPORTS route');
            }
            return `workspaces/${policyID}/reports`;
        },
    },
    WORKSPACE_CREATE_REPORT_FIELD: {
        route: 'workspaces/:policyID/reports/newReportField',
        getRoute: (policyID) => `workspaces/${policyID}/reports/newReportField`,
    },
    WORKSPACE_REPORT_FIELDS_SETTINGS: {
        route: 'workspaces/:policyID/reports/:reportFieldID/edit',
        getRoute: (policyID, reportFieldID) => `workspaces/${policyID}/reports/${encodeURIComponent(reportFieldID)}/edit`,
    },
    WORKSPACE_REPORT_FIELDS_LIST_VALUES: {
        route: 'workspaces/:policyID/reports/listValues/:reportFieldID?',
        getRoute: (policyID, reportFieldID) => `workspaces/${policyID}/reports/listValues/${reportFieldID ? encodeURIComponent(reportFieldID) : ''}`,
    },
    WORKSPACE_REPORT_FIELDS_ADD_VALUE: {
        route: 'workspaces/:policyID/reports/addValue/:reportFieldID?',
        getRoute: (policyID, reportFieldID) => `workspaces/${policyID}/reports/addValue/${reportFieldID ? encodeURIComponent(reportFieldID) : ''}`,
    },
    WORKSPACE_REPORT_FIELDS_VALUE_SETTINGS: {
        route: 'workspaces/:policyID/reports/:valueIndex/:reportFieldID?',
        getRoute: (policyID, valueIndex, reportFieldID) => `workspaces/${policyID}/reports/${valueIndex}/${reportFieldID ? encodeURIComponent(reportFieldID) : ''}`,
    },
    WORKSPACE_REPORT_FIELDS_EDIT_VALUE: {
        route: 'workspaces/:policyID/reports/newReportField/:valueIndex/edit',
        getRoute: (policyID, valueIndex) => `workspaces/${policyID}/reports/newReportField/${valueIndex}/edit`,
    },
    WORKSPACE_EDIT_REPORT_FIELDS_INITIAL_VALUE: {
        route: 'workspaces/:policyID/reports/:reportFieldID/edit/initialValue',
        getRoute: (policyID, reportFieldID) => `workspaces/${policyID}/reports/${encodeURIComponent(reportFieldID)}/edit/initialValue`,
    },
    WORKSPACE_COMPANY_CARDS: {
        route: 'workspaces/:policyID/company-cards',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_COMPANY_CARDS route');
            }
            return `workspaces/${policyID}/company-cards`;
        },
    },
    WORKSPACE_COMPANY_CARDS_BANK_CONNECTION: {
        route: 'workspaces/:policyID/company-cards/:bankName/bank-connection',
        getRoute: (policyID, bankName, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_COMPANY_CARDS_BANK_CONNECTION route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/company-cards/${bankName}/bank-connection`, backTo);
        },
    },
    WORKSPACE_COMPANY_CARDS_ADD_NEW: {
        route: 'workspaces/:policyID/company-cards/add-card-feed',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/company-cards/add-card-feed`, backTo),
    },
    WORKSPACE_COMPANY_CARDS_SELECT_FEED: {
        route: 'workspaces/:policyID/company-cards/select-feed',
        getRoute: (policyID) => `workspaces/${policyID}/company-cards/select-feed`,
    },
    WORKSPACE_COMPANY_CARDS_ASSIGN_CARD: {
        route: 'workspaces/:policyID/company-cards/:feed/assign-card',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, feed, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/company-cards/${feed}/assign-card`, backTo),
    },
    WORKSPACE_COMPANY_CARDS_TRANSACTION_START_DATE: {
        route: 'workspaces/:policyID/company-cards/:feed/assign-card/transaction-start-date',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, feed, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/company-cards/${feed}/assign-card/transaction-start-date`, backTo),
    },
    WORKSPACE_COMPANY_CARD_DETAILS: {
        route: 'workspaces/:policyID/company-cards/:bank/:cardID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, bank, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/company-cards/${bank}/${cardID}`, backTo),
    },
    WORKSPACE_COMPANY_CARD_NAME: {
        route: 'workspaces/:policyID/company-cards/:bank/:cardID/edit/name',
        getRoute: (policyID, cardID, bank) => `workspaces/${policyID}/company-cards/${bank}/${cardID}/edit/name`,
    },
    WORKSPACE_COMPANY_CARD_EXPORT: {
        route: 'workspaces/:policyID/company-cards/:bank/:cardID/edit/export',
        getRoute: (policyID, cardID, bank, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/company-cards/${bank}/${cardID}/edit/export`, backTo, false),
    },
    WORKSPACE_EXPENSIFY_CARD: {
        route: 'workspaces/:policyID/expensify-card',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_EXPENSIFY_CARD route');
            }
            return `workspaces/${policyID}/expensify-card`;
        },
    },
    WORKSPACE_EXPENSIFY_CARD_DETAILS: {
        route: 'workspaces/:policyID/expensify-card/:cardID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/${cardID}`, backTo),
    },
    EXPENSIFY_CARD_DETAILS: {
        route: 'settings/:policyID/expensify-card/:cardID',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`settings/${policyID}/expensify-card/${cardID}`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_NAME: {
        route: 'workspaces/:policyID/expensify-card/:cardID/edit/name',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/${cardID}/edit/name`, backTo),
    },
    EXPENSIFY_CARD_NAME: {
        route: 'settings/:policyID/expensify-card/:cardID/edit/name',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`settings/${policyID}/expensify-card/${cardID}/edit/name`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_LIMIT: {
        route: 'workspaces/:policyID/expensify-card/:cardID/edit/limit',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/${cardID}/edit/limit`, backTo),
    },
    EXPENSIFY_CARD_LIMIT: {
        route: 'settings/:policyID/expensify-card/:cardID/edit/limit',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`settings/${policyID}/expensify-card/${cardID}/edit/limit`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_LIMIT_TYPE: {
        route: 'workspaces/:policyID/expensify-card/:cardID/edit/limit-type',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/${cardID}/edit/limit-type`, backTo),
    },
    EXPENSIFY_CARD_LIMIT_TYPE: {
        route: 'settings/:policyID/expensify-card/:cardID/edit/limit-type',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, cardID, backTo) => getUrlWithBackToParam(`settings/${policyID}/expensify-card/${cardID}/edit/limit-type`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_ISSUE_NEW: {
        route: 'workspaces/:policyID/expensify-card/issue-new',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/issue-new`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_BANK_ACCOUNT: {
        route: 'workspaces/:policyID/expensify-card/choose-bank-account',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_EXPENSIFY_CARD_BANK_ACCOUNT route');
            }
            return `workspaces/${policyID}/expensify-card/choose-bank-account`;
        },
    },
    WORKSPACE_EXPENSIFY_CARD_SETTINGS: {
        route: 'workspaces/:policyID/expensify-card/settings',
        getRoute: (policyID) => `workspaces/${policyID}/expensify-card/settings`,
    },
    WORKSPACE_EXPENSIFY_CARD_SETTINGS_ACCOUNT: {
        route: 'workspaces/:policyID/expensify-card/settings/account',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/settings/account`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_SELECT_FEED: {
        route: 'workspaces/:policyID/expensify-card/select-feed',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/expensify-card/select-feed`, backTo),
    },
    WORKSPACE_EXPENSIFY_CARD_SETTINGS_FREQUENCY: {
        route: 'workspaces/:policyID/expensify-card/settings/frequency',
        getRoute: (policyID) => `workspaces/${policyID}/expensify-card/settings/frequency`,
    },
    WORKSPACE_COMPANY_CARDS_SETTINGS: {
        route: 'workspaces/:policyID/company-cards/settings',
        getRoute: (policyID) => `workspaces/${policyID}/company-cards/settings`,
    },
    WORKSPACE_COMPANY_CARDS_SETTINGS_FEED_NAME: {
        route: 'workspaces/:policyID/company-cards/settings/feed-name',
        getRoute: (policyID) => `workspaces/${policyID}/company-cards/settings/feed-name`,
    },
    WORKSPACE_COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE: {
        route: 'workspaces/:policyID/company-cards/settings/statement-close-date',
        getRoute: (policyID) => `workspaces/${policyID}/company-cards/settings/statement-close-date`,
    },
    WORKSPACE_RULES: {
        route: 'workspaces/:policyID/rules',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_RULES route');
            }
            return `workspaces/${policyID}/rules`;
        },
    },
    WORKSPACE_DISTANCE_RATES: {
        route: 'workspaces/:policyID/distance-rates',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_DISTANCE_RATES route');
            }
            return `workspaces/${policyID}/distance-rates`;
        },
    },
    WORKSPACE_CREATE_DISTANCE_RATE: {
        route: 'workspaces/:policyID/distance-rates/new',
        getRoute: (policyID) => `workspaces/${policyID}/distance-rates/new`,
    },
    WORKSPACE_DISTANCE_RATES_SETTINGS: {
        route: 'workspaces/:policyID/distance-rates/settings',
        getRoute: (policyID) => `workspaces/${policyID}/distance-rates/settings`,
    },
    WORKSPACE_DISTANCE_RATE_DETAILS: {
        route: 'workspaces/:policyID/distance-rates/:rateID',
        getRoute: (policyID, rateID) => `workspaces/${policyID}/distance-rates/${rateID}`,
    },
    WORKSPACE_DISTANCE_RATE_EDIT: {
        route: 'workspaces/:policyID/distance-rates/:rateID/edit',
        getRoute: (policyID, rateID) => `workspaces/${policyID}/distance-rates/${rateID}/edit`,
    },
    WORKSPACE_DISTANCE_RATE_NAME_EDIT: {
        route: 'workspaces/:policyID/distance-rates/:rateID/name/edit',
        getRoute: (policyID, rateID) => `workspaces/${policyID}/distance-rates/${rateID}/name/edit`,
    },
    WORKSPACE_DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT: {
        route: 'workspaces/:policyID/distance-rates/:rateID/tax-reclaimable/edit',
        getRoute: (policyID, rateID) => `workspaces/${policyID}/distance-rates/${rateID}/tax-reclaimable/edit`,
    },
    WORKSPACE_DISTANCE_RATE_TAX_RATE_EDIT: {
        route: 'workspaces/:policyID/distance-rates/:rateID/tax-rate/edit',
        getRoute: (policyID, rateID) => `workspaces/${policyID}/distance-rates/${rateID}/tax-rate/edit`,
    },
    WORKSPACE_PER_DIEM: {
        route: 'workspaces/:policyID/per-diem',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_PER_DIEM route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/per-diem`, backTo);
        },
    },
    WORKSPACE_DUPLICATE: {
        route: 'workspace/:policyID/duplicate',
        getRoute: (policyID) => `workspace/${policyID}/duplicate`,
    },
    WORKSPACE_DUPLICATE_SELECT_FEATURES: {
        route: 'workspace/:policyID/duplicate/select-features',
        getRoute: (policyID) => `workspace/${policyID}/duplicate/select-features`,
    },
    WORKSPACE_RECEIPT_PARTNERS: {
        route: 'workspaces/:policyID/receipt-partners',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_RECEIPT_PARTNERS route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/receipt-partners`, backTo);
        },
    },
    WORKSPACE_RECEIPT_PARTNERS_INVITE: {
        route: 'workspaces/:policyID/receipt-partners/:integration/invite',
        getRoute: (policyID, integration, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_RECEIPT_PARTNERS_INVITE route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/receipt-partners/${integration}/invite`, backTo);
        },
    },
    WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT: {
        route: 'workspaces/:policyID/receipt-partners/:integration/invite/edit',
        getRoute: (policyID, integration, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/receipt-partners/${integration}/invite/edit`, backTo);
        },
    },
    WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT_ALL: 'workspaces/:policyID/receipt-partners/:integration/invite/edit/ReceiptPartnersAllTab',
    WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT_LINKED: 'workspaces/:policyID/receipt-partners/:integration/invite/edit/ReceiptPartnersLinkedTab',
    WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT_OUTSTANDING: 'workspaces/:policyID/receipt-partners/:integration/invite/edit/ReceiptPartnersOutstandingTab',
    WORKSPACE_PER_DIEM_IMPORT: {
        route: 'workspaces/:policyID/per-diem/import',
        getRoute: (policyID) => `workspaces/${policyID}/per-diem/import`,
    },
    WORKSPACE_PER_DIEM_IMPORTED: {
        route: 'workspaces/:policyID/per-diem/imported',
        getRoute: (policyID) => `workspaces/${policyID}/per-diem/imported`,
    },
    WORKSPACE_PER_DIEM_SETTINGS: {
        route: 'workspaces/:policyID/per-diem/settings',
        getRoute: (policyID) => `workspaces/${policyID}/per-diem/settings`,
    },
    WORKSPACE_PER_DIEM_DETAILS: {
        route: 'workspaces/:policyID/per-diem/details/:rateID/:subRateID',
        getRoute: (policyID, rateID, subRateID) => `workspaces/${policyID}/per-diem/details/${rateID}/${subRateID}`,
    },
    WORKSPACE_PER_DIEM_EDIT_DESTINATION: {
        route: 'workspaces/:policyID/per-diem/edit/destination/:rateID/:subRateID',
        getRoute: (policyID, rateID, subRateID) => `workspaces/${policyID}/per-diem/edit/destination/${rateID}/${subRateID}`,
    },
    WORKSPACE_PER_DIEM_EDIT_SUBRATE: {
        route: 'workspaces/:policyID/per-diem/edit/subrate/:rateID/:subRateID',
        getRoute: (policyID, rateID, subRateID) => `workspaces/${policyID}/per-diem/edit/subrate/${rateID}/${subRateID}`,
    },
    WORKSPACE_PER_DIEM_EDIT_AMOUNT: {
        route: 'workspaces/:policyID/per-diem/edit/amount/:rateID/:subRateID',
        getRoute: (policyID, rateID, subRateID) => `workspaces/${policyID}/per-diem/edit/amount/${rateID}/${subRateID}`,
    },
    WORKSPACE_PER_DIEM_EDIT_CURRENCY: {
        route: 'workspaces/:policyID/per-diem/edit/currency/:rateID/:subRateID',
        getRoute: (policyID, rateID, subRateID) => `workspaces/${policyID}/per-diem/edit/currency/${rateID}/${subRateID}`,
    },
    REPORTS_DEFAULT_TITLE: {
        route: 'workspaces/:policyID/reports/name',
        getRoute: (policyID) => `workspaces/${policyID}/reports/name`,
    },
    RULES_AUTO_APPROVE_REPORTS_UNDER: {
        route: 'workspaces/:policyID/rules/auto-approve',
        getRoute: (policyID) => `workspaces/${policyID}/rules/auto-approve`,
    },
    RULES_RANDOM_REPORT_AUDIT: {
        route: 'workspaces/:policyID/rules/audit',
        getRoute: (policyID) => `workspaces/${policyID}/rules/audit`,
    },
    RULES_AUTO_PAY_REPORTS_UNDER: {
        route: 'workspaces/:policyID/rules/auto-pay',
        getRoute: (policyID) => `workspaces/${policyID}/rules/auto-pay`,
    },
    RULES_RECEIPT_REQUIRED_AMOUNT: {
        route: 'workspaces/:policyID/rules/receipt-required-amount',
        getRoute: (policyID) => `workspaces/${policyID}/rules/receipt-required-amount`,
    },
    RULES_MAX_EXPENSE_AMOUNT: {
        route: 'workspaces/:policyID/rules/max-expense-amount',
        getRoute: (policyID) => `workspaces/${policyID}/rules/max-expense-amount`,
    },
    RULES_MAX_EXPENSE_AGE: {
        route: 'workspaces/:policyID/rules/max-expense-age',
        getRoute: (policyID) => `workspaces/${policyID}/rules/max-expense-age`,
    },
    RULES_BILLABLE_DEFAULT: {
        route: 'workspaces/:policyID/rules/billable',
        getRoute: (policyID) => `workspaces/${policyID}/rules/billable`,
    },
    RULES_REIMBURSABLE_DEFAULT: {
        route: 'workspaces/:policyID/rules/reimbursable',
        getRoute: (policyID) => `workspaces/${policyID}/rules/reimbursable`,
    },
    RULES_PROHIBITED_DEFAULT: {
        route: 'workspaces/:policyID/rules/prohibited',
        getRoute: (policyID) => `workspaces/${policyID}/rules/prohibited`,
    },
    RULES_CUSTOM: {
        route: 'workspaces/:policyID/overview/policy',
        getRoute: (policyID) => `workspaces/${policyID}/overview/policy`,
    },
    // Referral program promotion
    REFERRAL_DETAILS_MODAL: {
        route: 'referral/:contentType',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (contentType, backTo) => getUrlWithBackToParam(`referral/${contentType}`, backTo),
    },
    SHARE_ROOT: 'share/root',
    SHARE_ROOT_SHARE: 'share/root/share',
    SHARE_ROOT_SUBMIT: 'share/root/submit',
    SHARE_DETAILS: {
        route: 'share/share-details/:reportOrAccountID',
        getRoute: (reportOrAccountID) => `share/share-details/${reportOrAccountID}`,
    },
    SHARE_SUBMIT_DETAILS: {
        route: 'share/submit-details/:reportOrAccountID',
        getRoute: (reportOrAccountID) => `share/submit-details/${reportOrAccountID}`,
    },
    PROCESS_MONEY_REQUEST_HOLD: {
        route: 'hold-expense-educational',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('hold-expense-educational', backTo),
    },
    CHANGE_POLICY_EDUCATIONAL: {
        route: 'change-workspace-educational',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('change-workspace-educational', backTo),
    },
    TRAVEL_MY_TRIPS: 'travel',
    TRAVEL_DOT_LINK_WEB_VIEW: {
        route: 'travel-dot-link',
        getRoute: (token, isTestAccount) => `travel-dot-link?token=${token}&isTestAccount=${isTestAccount}`,
    },
    TRAVEL_TCS: {
        route: 'travel/terms/:domain/accept',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (domain, backTo) => getUrlWithBackToParam(`travel/terms/${domain}/accept`, backTo),
    },
    TRAVEL_UPGRADE: {
        route: 'travel/upgrade',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('travel/upgrade', backTo),
    },
    TRACK_TRAINING_MODAL: 'track-training',
    TRAVEL_TRIP_SUMMARY: {
        route: 'r/:reportID/trip/:transactionID',
        getRoute: (reportID, transactionID, backTo) => {
            if (!reportID || !transactionID) {
                Log_1.default.warn('Invalid reportID or transactionID is used to build the TRAVEL_TRIP_SUMMARY route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/trip/${transactionID}`, backTo);
        },
    },
    TRAVEL_TRIP_DETAILS: {
        route: 'r/:reportID/trip/:transactionID/:pnr/:sequenceIndex',
        getRoute: (reportID, transactionID, pnr, sequenceIndex, backTo) => {
            if (!reportID || !transactionID || !pnr) {
                Log_1.default.warn('Invalid reportID, transactionID or pnr is used to build the TRAVEL_TRIP_DETAILS route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`r/${reportID}/trip/${transactionID}/${pnr}/${sequenceIndex}`, backTo);
        },
    },
    TRAVEL_DOMAIN_SELECTOR: {
        route: 'travel/domain-selector',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`travel/domain-selector`, backTo),
    },
    TRAVEL_DOMAIN_PERMISSION_INFO: {
        route: 'travel/domain-permission/:domain/info',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (domain, backTo) => getUrlWithBackToParam(`travel/domain-permission/${domain}/info`, backTo),
    },
    TRAVEL_PUBLIC_DOMAIN_ERROR: {
        route: 'travel/public-domain-error',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`travel/public-domain-error`, backTo),
    },
    TRAVEL_WORKSPACE_ADDRESS: {
        route: 'travel/:domain/workspace-address',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (domain, backTo) => getUrlWithBackToParam(`travel/${domain}/workspace-address`, backTo),
    },
    ONBOARDING_ROOT: {
        route: 'onboarding',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding`, backTo),
    },
    ONBOARDING_PERSONAL_DETAILS: {
        route: 'onboarding/personal-details',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/personal-details`, backTo),
    },
    ONBOARDING_PRIVATE_DOMAIN: {
        route: 'onboarding/private-domain',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/private-domain`, backTo),
    },
    ONBOARDING_EMPLOYEES: {
        route: 'onboarding/employees',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/employees`, backTo),
    },
    ONBOARDING_ACCOUNTING: {
        route: 'onboarding/accounting',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/accounting`, backTo),
    },
    ONBOARDING_INTERESTED_FEATURES: {
        route: 'onboarding/interested-features',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (userReportedIntegration, backTo) => getUrlWithBackToParam(`onboarding/interested-features?userReportedIntegration=${userReportedIntegration}`, backTo),
    },
    ONBOARDING_PURPOSE: {
        route: 'onboarding/purpose',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/purpose`, backTo),
    },
    ONBOARDING_WORKSPACES: {
        route: 'onboarding/join-workspaces',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/join-workspaces`, backTo),
    },
    ONBOARDING_WORK_EMAIL: {
        route: 'onboarding/work-email',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/work-email`, backTo),
    },
    ONBOARDING_WORK_EMAIL_VALIDATION: {
        route: 'onboarding/work-email-validation',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/work-email-validation`, backTo),
    },
    ONBOARDING_WORKSPACE: {
        route: 'onboarding/create-workspace',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/create-workspace`, backTo),
    },
    ONBOARDING_WORKSPACE_CONFIRMATION: {
        route: 'onboarding/workspace-confirmation',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/workspace-confirmation`, backTo),
    },
    ONBOARDING_WORKSPACE_CURRENCY: {
        route: 'onboarding/workspace-currency',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/workspace-currency`, backTo),
    },
    ONBOARDING_WORKSPACE_INVITE: {
        route: 'onboarding/workspace-invite',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`onboarding/workspace-invite`, backTo),
    },
    EXPLANATION_MODAL_ROOT: 'onboarding/explanation',
    TEST_DRIVE_MODAL_ROOT: {
        route: 'onboarding/test-drive',
        getRoute: (bossEmail) => `onboarding/test-drive${bossEmail ? `?bossEmail=${encodeURIComponent(bossEmail)}` : ''}`,
    },
    TEST_DRIVE_DEMO_ROOT: 'onboarding/test-drive/demo',
    AUTO_SUBMIT_MODAL_ROOT: '/auto-submit',
    WORKSPACE_CONFIRMATION: {
        route: 'workspace/confirmation',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam(`workspace/confirmation`, backTo),
    },
    MIGRATED_USER_WELCOME_MODAL: {
        route: 'onboarding/migrated-user-welcome',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (shouldOpenSearch) => getUrlWithBackToParam(`onboarding/migrated-user-welcome?${shouldOpenSearch ? 'shouldOpenSearch=true' : ''}`, undefined, false),
    },
    TRANSACTION_RECEIPT: {
        route: 'r/:reportID/transaction/:transactionID/receipt/:action?/:iouType?',
        getRoute: (reportID, transactionID, readonly = false, isFromReviewDuplicates = false, mergeTransactionID) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the TRANSACTION_RECEIPT route');
            }
            if (!transactionID) {
                Log_1.default.warn('Invalid transactionID is used to build the TRANSACTION_RECEIPT route');
            }
            return `r/${reportID}/transaction/${transactionID}/receipt?readonly=${readonly}${isFromReviewDuplicates ? '&isFromReviewDuplicates=true' : ''}${mergeTransactionID ? `&mergeTransactionID=${mergeTransactionID}` : ''}`;
        },
    },
    TRANSACTION_DUPLICATE_REVIEW_PAGE: {
        route: 'r/:threadReportID/duplicates/review',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_MERCHANT_PAGE: {
        route: 'r/:threadReportID/duplicates/review/merchant',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/merchant`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_CATEGORY_PAGE: {
        route: 'r/:threadReportID/duplicates/review/category',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/category`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_TAG_PAGE: {
        route: 'r/:threadReportID/duplicates/review/tag',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/tag`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_TAX_CODE_PAGE: {
        route: 'r/:threadReportID/duplicates/review/tax-code',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/tax-code`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_DESCRIPTION_PAGE: {
        route: 'r/:threadReportID/duplicates/review/description',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/description`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_REIMBURSABLE_PAGE: {
        route: 'r/:threadReportID/duplicates/review/reimbursable',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/reimbursable`, backTo),
    },
    TRANSACTION_DUPLICATE_REVIEW_BILLABLE_PAGE: {
        route: 'r/:threadReportID/duplicates/review/billable',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/review/billable`, backTo),
    },
    TRANSACTION_DUPLICATE_CONFIRMATION_PAGE: {
        route: 'r/:threadReportID/duplicates/confirm',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (threadReportID, backTo) => getUrlWithBackToParam(`r/${threadReportID}/duplicates/confirm`, backTo),
    },
    MERGE_TRANSACTION_LIST_PAGE: {
        route: 'r/:transactionID/merge',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (transactionID, backTo) => getUrlWithBackToParam(`r/${transactionID}/merge`, backTo),
    },
    MERGE_TRANSACTION_RECEIPT_PAGE: {
        route: 'r/:transactionID/merge/receipt',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (transactionID, backTo) => getUrlWithBackToParam(`r/${transactionID}/merge/receipt`, backTo),
    },
    MERGE_TRANSACTION_DETAILS_PAGE: {
        route: 'r/:transactionID/merge/details',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (transactionID, backTo) => getUrlWithBackToParam(`r/${transactionID}/merge/details`, backTo),
    },
    MERGE_TRANSACTION_CONFIRMATION_PAGE: {
        route: 'r/:transactionID/merge/confirmation',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (transactionID, backTo) => getUrlWithBackToParam(`r/${transactionID}/merge/confirmation`, backTo),
    },
    POLICY_ACCOUNTING_XERO_IMPORT: {
        route: 'workspaces/:policyID/accounting/xero/import',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/xero/import`,
    },
    POLICY_ACCOUNTING_XERO_CHART_OF_ACCOUNTS: {
        route: 'workspaces/:policyID/accounting/xero/import/accounts',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/xero/import/accounts`,
    },
    POLICY_ACCOUNTING_XERO_ORGANIZATION: {
        route: 'workspaces/:policyID/accounting/xero/organization/:currentOrganizationID',
        getRoute: (policyID, currentOrganizationID) => {
            if (!policyID || !currentOrganizationID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_ORGANIZATION route');
            }
            return `workspaces/${policyID}/accounting/xero/organization/${currentOrganizationID}`;
        },
    },
    POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES: {
        route: 'workspaces/:policyID/accounting/xero/import/tracking-categories',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES route');
            }
            return `workspaces/${policyID}/accounting/xero/import/tracking-categories`;
        },
    },
    POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES_MAP: {
        route: 'workspaces/:policyID/accounting/xero/import/tracking-categories/mapping/:categoryId/:categoryName',
        getRoute: (policyID, categoryId, categoryName) => `workspaces/${policyID}/accounting/xero/import/tracking-categories/mapping/${categoryId}/${encodeURIComponent(categoryName)}`,
    },
    POLICY_ACCOUNTING_XERO_CUSTOMER: {
        route: 'workspaces/:policyID/accounting/xero/import/customers',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/xero/import/customers`,
    },
    POLICY_ACCOUNTING_XERO_TAXES: {
        route: 'workspaces/:policyID/accounting/xero/import/taxes',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/xero/import/taxes`,
    },
    POLICY_ACCOUNTING_XERO_EXPORT: {
        route: 'workspaces/:policyID/accounting/xero/export',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/xero/export`, backTo, false),
    },
    POLICY_ACCOUNTING_XERO_PREFERRED_EXPORTER_SELECT: {
        route: 'workspaces/:policyID/connections/xero/export/preferred-exporter/select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/connections/xero/export/preferred-exporter/select`, backTo),
    },
    POLICY_ACCOUNTING_XERO_EXPORT_PURCHASE_BILL_DATE_SELECT: {
        route: 'workspaces/:policyID/accounting/xero/export/purchase-bill-date-select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/xero/export/purchase-bill-date-select`, backTo),
    },
    POLICY_ACCOUNTING_XERO_EXPORT_BANK_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/accounting/xero/export/bank-account-select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/xero/export/bank-account-select`, backTo),
    },
    POLICY_ACCOUNTING_XERO_ADVANCED: {
        route: 'workspaces/:policyID/accounting/xero/advanced',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_ADVANCED route');
            }
            return `workspaces/${policyID}/accounting/xero/advanced`;
        },
    },
    POLICY_ACCOUNTING_XERO_AUTO_SYNC: {
        route: 'workspaces/:policyID/accounting/xero/advanced/autosync',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_AUTO_SYNC route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/xero/advanced/autosync`, backTo);
        },
    },
    POLICY_ACCOUNTING_XERO_ACCOUNTING_METHOD: {
        route: 'workspaces/:policyID/accounting/xero/advanced/autosync/accounting-method',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_ACCOUNTING_METHOD route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/accounting/xero/advanced/autosync/accounting-method`, backTo);
        },
    },
    POLICY_ACCOUNTING_XERO_BILL_STATUS_SELECTOR: {
        route: 'workspaces/:policyID/accounting/xero/export/purchase-bill-status-selector',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/xero/export/purchase-bill-status-selector`, backTo),
    },
    POLICY_ACCOUNTING_XERO_INVOICE_SELECTOR: {
        route: 'workspaces/:policyID/accounting/xero/advanced/invoice-account-selector',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_INVOICE_SELECTOR route');
            }
            return `workspaces/${policyID}/accounting/xero/advanced/invoice-account-selector`;
        },
    },
    POLICY_ACCOUNTING_XERO_BILL_PAYMENT_ACCOUNT_SELECTOR: {
        route: 'workspaces/:policyID/accounting/xero/advanced/bill-payment-account-selector',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_XERO_BILL_PAYMENT_ACCOUNT_SELECTOR route');
            }
            return `workspaces/${policyID}/accounting/xero/advanced/bill-payment-account-selector`;
        },
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CHART_OF_ACCOUNTS: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/accounts',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/accounts`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/classes',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/classes`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES_DISPLAYED_AS: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/classes/displayed-as',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/classes/displayed-as`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CUSTOMERS: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/customers',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/customers`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CUSTOMERS_DISPLAYED_AS: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/customers/displayed-as',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/customers/displayed-as`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/locations',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/locations`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS_DISPLAYED_AS: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/locations/displayed-as',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/locations/displayed-as`,
    },
    POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_TAXES: {
        route: 'workspaces/:policyID/accounting/quickbooks-online/import/taxes',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/quickbooks-online/import/taxes`,
    },
    RESTRICTED_ACTION: {
        route: 'restricted-action/workspace/:policyID',
        getRoute: (policyID) => `restricted-action/workspace/${policyID}`,
    },
    MISSING_PERSONAL_DETAILS: 'missing-personal-details',
    POLICY_ACCOUNTING_NETSUITE_SUBSIDIARY_SELECTOR: {
        route: 'workspaces/:policyID/accounting/netsuite/subsidiary-selector',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_SUBSIDIARY_SELECTOR route');
            }
            return `workspaces/${policyID}/accounting/netsuite/subsidiary-selector`;
        },
    },
    POLICY_ACCOUNTING_NETSUITE_EXISTING_CONNECTIONS: {
        route: 'workspaces/:policyID/accounting/netsuite/existing-connections',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/existing-connections`,
    },
    POLICY_ACCOUNTING_NETSUITE_TOKEN_INPUT: {
        route: 'workspaces/:policyID/accounting/netsuite/token-input',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/token-input`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT: {
        route: 'workspaces/:policyID/accounting/netsuite/import',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/import`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_MAPPING: {
        route: 'workspaces/:policyID/accounting/netsuite/import/mapping/:importField',
        getRoute: (policyID, importField) => `workspaces/${policyID}/accounting/netsuite/import/mapping/${importField}`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING: {
        route: 'workspaces/:policyID/accounting/netsuite/import/custom/:importCustomField',
        getRoute: (policyID, importCustomField) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING route');
            }
            return `workspaces/${policyID}/accounting/netsuite/import/custom/${importCustomField}`;
        },
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_VIEW: {
        route: 'workspaces/:policyID/accounting/netsuite/import/custom/:importCustomField/view/:valueIndex',
        getRoute: (policyID, importCustomField, valueIndex) => `workspaces/${policyID}/accounting/netsuite/import/custom/${importCustomField}/view/${valueIndex}`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_EDIT: {
        route: 'workspaces/:policyID/accounting/netsuite/import/custom/:importCustomField/edit/:valueIndex/:fieldName',
        getRoute: (policyID, importCustomField, valueIndex, fieldName) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_EDIT route');
            }
            return `workspaces/${policyID}/accounting/netsuite/import/custom/${importCustomField}/edit/${valueIndex}/${fieldName}`;
        },
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_LIST_ADD: {
        route: 'workspaces/:policyID/accounting/netsuite/import/custom-list/new',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/import/custom-list/new`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_SEGMENT_ADD: {
        route: 'workspaces/:policyID/accounting/netsuite/import/custom-segment/new',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/import/custom-segment/new`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS: {
        route: 'workspaces/:policyID/accounting/netsuite/import/customer-projects',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/import/customer-projects`,
    },
    POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS_SELECT: {
        route: 'workspaces/:policyID/accounting/netsuite/import/customer-projects/select',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/netsuite/import/customer-projects/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_EXPORT: {
        route: 'workspaces/:policyID/connections/netsuite/export/',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_EXPORT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/`, backTo, false);
        },
    },
    POLICY_ACCOUNTING_NETSUITE_PREFERRED_EXPORTER_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/preferred-exporter/select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/preferred-exporter/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_DATE_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/date/select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/date/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES: {
        route: 'workspaces/:policyID/connections/netsuite/export/expenses/:expenseType',
        getRoute: (policyID, expenseType, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/expenses/${expenseType}`, backTo);
        },
    },
    POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_DESTINATION_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/expenses/:expenseType/destination/select',
        getRoute: (policyID, expenseType, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/expenses/${expenseType}/destination/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_VENDOR_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/expenses/:expenseType/vendor/select',
        getRoute: (policyID, expenseType, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/expenses/${expenseType}/vendor/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/expenses/:expenseType/payable-account/select',
        getRoute: (policyID, expenseType, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/expenses/${expenseType}/payable-account/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_JOURNAL_POSTING_PREFERENCE_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/expenses/:expenseType/journal-posting-preference/select',
        getRoute: (policyID, expenseType, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/expenses/${expenseType}/journal-posting-preference/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_RECEIVABLE_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/receivable-account/select',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/receivable-account/select`, backTo),
    },
    POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/invoice-item-preference/select',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/export/invoice-item-preference/select`, backTo);
        },
    },
    POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/invoice-item-preference/invoice-item/select',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_SELECT route');
            }
            return `workspaces/${policyID}/connections/netsuite/export/invoice-item-preference/invoice-item/select`;
        },
    },
    POLICY_ACCOUNTING_NETSUITE_TAX_POSTING_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/tax-posting-account/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/export/tax-posting-account/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/export/provincial-tax-posting-account/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/export/provincial-tax-posting-account/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_ADVANCED: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_ADVANCED route');
            }
            return `workspaces/${policyID}/connections/netsuite/advanced/`;
        },
    },
    POLICY_ACCOUNTING_NETSUITE_REIMBURSEMENT_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/reimbursement-account/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/advanced/reimbursement-account/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_COLLECTION_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/collection-account/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/advanced/collection-account/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_EXPENSE_REPORT_APPROVAL_LEVEL_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/expense-report-approval-level/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/advanced/expense-report-approval-level/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_VENDOR_BILL_APPROVAL_LEVEL_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/vendor-bill-approval-level/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/advanced/vendor-bill-approval-level/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_JOURNAL_ENTRY_APPROVAL_LEVEL_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/journal-entry-approval-level/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/advanced/journal-entry-approval-level/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_APPROVAL_ACCOUNT_SELECT: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/approval-account/select',
        getRoute: (policyID) => `workspaces/${policyID}/connections/netsuite/advanced/approval-account/select`,
    },
    POLICY_ACCOUNTING_NETSUITE_CUSTOM_FORM_ID: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/custom-form-id/:expenseType',
        getRoute: (policyID, expenseType) => `workspaces/${policyID}/connections/netsuite/advanced/custom-form-id/${expenseType}`,
    },
    POLICY_ACCOUNTING_NETSUITE_AUTO_SYNC: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/autosync',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_AUTO_SYNC route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/advanced/autosync`, backTo);
        },
    },
    POLICY_ACCOUNTING_NETSUITE_ACCOUNTING_METHOD: {
        route: 'workspaces/:policyID/connections/netsuite/advanced/autosync/accounting-method',
        getRoute: (policyID, backTo) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_NETSUITE_ACCOUNTING_METHOD route');
            }
            // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
            return getUrlWithBackToParam(`workspaces/${policyID}/connections/netsuite/advanced/autosync/accounting-method`, backTo);
        },
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_PREREQUISITES: {
        route: 'workspaces/:policyID/accounting/sage-intacct/prerequisites',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/prerequisites`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_ENTER_CREDENTIALS: {
        route: 'workspaces/:policyID/accounting/sage-intacct/enter-credentials',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/enter-credentials`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_EXISTING_CONNECTIONS: {
        route: 'workspaces/:policyID/accounting/sage-intacct/existing-connections',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/existing-connections`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_ENTITY: {
        route: 'workspaces/:policyID/accounting/sage-intacct/entity',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_SAGE_INTACCT_ENTITY route');
            }
            return `workspaces/${policyID}/accounting/sage-intacct/entity`;
        },
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/import`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_TOGGLE_MAPPINGS: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/toggle-mapping/:mapping',
        getRoute: (policyID, mapping) => `workspaces/${policyID}/accounting/sage-intacct/import/toggle-mapping/${mapping}`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_MAPPINGS_TYPE: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/mapping-type/:mapping',
        getRoute: (policyID, mapping) => `workspaces/${policyID}/accounting/sage-intacct/import/mapping-type/${mapping}`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/tax',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/import/tax`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX_MAPPING: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/tax/mapping',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/import/tax/mapping`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/user-dimensions',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/import/user-dimensions`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_ADD_USER_DIMENSION: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/add-user-dimension',
        getRoute: (policyID) => `workspaces/${policyID}/accounting/sage-intacct/import/add-user-dimension`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_EDIT_USER_DIMENSION: {
        route: 'workspaces/:policyID/accounting/sage-intacct/import/edit-user-dimension/:dimensionName',
        getRoute: (policyID, dimensionName) => `workspaces/${policyID}/accounting/sage-intacct/import/edit-user-dimension/${dimensionName}`,
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export`, backTo, false),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_PREFERRED_EXPORTER: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/preferred-exporter',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/preferred-exporter`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT_DATE: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/date',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/date`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_EXPENSES: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/reimbursable',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/reimbursable`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/nonreimbursable',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/nonreimbursable`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_DESTINATION: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/reimbursable/destination',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/reimbursable/destination`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_DESTINATION: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/nonreimbursable/destination',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/nonreimbursable/destination`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_DEFAULT_VENDOR: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/:reimbursable/default-vendor',
        getRoute: (policyID, reimbursable, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/${reimbursable}/default-vendor`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_CREDIT_CARD_ACCOUNT: {
        route: 'workspaces/:policyID/accounting/sage-intacct/export/nonreimbursable/credit-card-account',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (policyID, backTo) => getUrlWithBackToParam(`workspaces/${policyID}/accounting/sage-intacct/export/nonreimbursable/credit-card-account`, backTo),
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED: {
        route: 'workspaces/:policyID/accounting/sage-intacct/advanced',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED route');
            }
            return `workspaces/${policyID}/accounting/sage-intacct/advanced`;
        },
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_PAYMENT_ACCOUNT: {
        route: 'workspaces/:policyID/accounting/sage-intacct/advanced/payment-account',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_SAGE_INTACCT_PAYMENT_ACCOUNT route');
            }
            return `workspaces/${policyID}/accounting/sage-intacct/advanced/payment-account`;
        },
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_AUTO_SYNC: {
        route: 'workspaces/:policyID/accounting/sage-intacct/advanced/autosync',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_SAGE_INTACCT_AUTO_SYNC route');
            }
            return `workspaces/${policyID}/accounting/sage-intacct/advanced/autosync`;
        },
    },
    POLICY_ACCOUNTING_SAGE_INTACCT_ACCOUNTING_METHOD: {
        route: 'workspaces/:policyID/accounting/sage-intacct/advanced/autosync/accounting-method',
        getRoute: (policyID) => {
            if (!policyID) {
                Log_1.default.warn('Invalid policyID is used to build the POLICY_ACCOUNTING_SAGE_INTACCT_ACCOUNTING_METHOD route');
            }
            return `workspaces/${policyID}/accounting/sage-intacct/advanced/autosync/accounting-method`;
        },
    },
    ADD_UNREPORTED_EXPENSE: {
        route: 'search/r/:reportID/add-unreported-expense/:backToReport?',
        getRoute: (reportID, backToReport) => `search/r/${reportID}/add-unreported-expense/${backToReport ?? ''}`,
    },
    DEBUG_REPORT: {
        route: 'debug/report/:reportID',
        getRoute: (reportID) => `debug/report/${reportID}`,
    },
    DEBUG_REPORT_TAB_DETAILS: {
        route: 'debug/report/:reportID/details',
        getRoute: (reportID) => `debug/report/${reportID}/details`,
    },
    DEBUG_REPORT_TAB_JSON: {
        route: 'debug/report/:reportID/json',
        getRoute: (reportID) => `debug/report/${reportID}/json`,
    },
    DEBUG_REPORT_TAB_ACTIONS: {
        route: 'debug/report/:reportID/actions',
        getRoute: (reportID) => `debug/report/${reportID}/actions`,
    },
    DEBUG_REPORT_ACTION: {
        route: 'debug/report/:reportID/actions/:reportActionID',
        getRoute: (reportID, reportActionID) => {
            if (!reportID) {
                Log_1.default.warn('Invalid reportID is used to build the DEBUG_REPORT_ACTION route');
            }
            return `debug/report/${reportID}/actions/${reportActionID}`;
        },
    },
    DEBUG_REPORT_ACTION_CREATE: {
        route: 'debug/report/:reportID/actions/create',
        getRoute: (reportID) => `debug/report/${reportID}/actions/create`,
    },
    DEBUG_REPORT_ACTION_TAB_DETAILS: {
        route: 'debug/report/:reportID/actions/:reportActionID/details',
        getRoute: (reportID, reportActionID) => `debug/report/${reportID}/actions/${reportActionID}/details`,
    },
    DEBUG_REPORT_ACTION_TAB_JSON: {
        route: 'debug/report/:reportID/actions/:reportActionID/json',
        getRoute: (reportID, reportActionID) => `debug/report/${reportID}/actions/${reportActionID}/json`,
    },
    DEBUG_REPORT_ACTION_TAB_PREVIEW: {
        route: 'debug/report/:reportID/actions/:reportActionID/preview',
        getRoute: (reportID, reportActionID) => `debug/report/${reportID}/actions/${reportActionID}/preview`,
    },
    DETAILS_CONSTANT_PICKER_PAGE: {
        route: 'debug/:formType/details/constant/:fieldName',
        getRoute: (formType, fieldName, fieldValue, policyID, backTo) => 
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getUrlWithBackToParam(`debug/${formType}/details/constant/${fieldName}?fieldValue=${fieldValue}&policyID=${policyID}`, backTo),
    },
    DETAILS_DATE_TIME_PICKER_PAGE: {
        route: 'debug/details/datetime/:fieldName',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (fieldName, fieldValue, backTo) => getUrlWithBackToParam(`debug/details/datetime/${fieldName}?fieldValue=${fieldValue}`, backTo),
    },
    DEBUG_TRANSACTION: {
        route: 'debug/transaction/:transactionID',
        getRoute: (transactionID) => `debug/transaction/${transactionID}`,
    },
    DEBUG_TRANSACTION_TAB_DETAILS: {
        route: 'debug/transaction/:transactionID/details',
        getRoute: (transactionID) => `debug/transaction/${transactionID}/details`,
    },
    DEBUG_TRANSACTION_TAB_JSON: {
        route: 'debug/transaction/:transactionID/json',
        getRoute: (transactionID) => `debug/transaction/${transactionID}/json`,
    },
    DEBUG_TRANSACTION_TAB_VIOLATIONS: {
        route: 'debug/transaction/:transactionID/violations',
        getRoute: (transactionID) => `debug/transaction/${transactionID}/violations`,
    },
    DEBUG_TRANSACTION_VIOLATION_CREATE: {
        route: 'debug/transaction/:transactionID/violations/create',
        getRoute: (transactionID) => `debug/transaction/${transactionID}/violations/create`,
    },
    DEBUG_TRANSACTION_VIOLATION: {
        route: 'debug/transaction/:transactionID/violations/:index',
        getRoute: (transactionID, index) => `debug/transaction/${transactionID}/violations/${index}`,
    },
    DEBUG_TRANSACTION_VIOLATION_TAB_DETAILS: {
        route: 'debug/transaction/:transactionID/violations/:index/details',
        getRoute: (transactionID, index) => `debug/transaction/${transactionID}/violations/${index}/details`,
    },
    DEBUG_TRANSACTION_VIOLATION_TAB_JSON: {
        route: 'debug/transaction/:transactionID/violations/:index/json',
        getRoute: (transactionID, index) => `debug/transaction/${transactionID}/violations/${index}/json`,
    },
    REJECT_MONEY_REQUEST_REASON: {
        route: 'reject/reason/:transactionID',
        getRoute: (transactionID, reportID, backTo) => `reject/reason/${transactionID}?reportID=${reportID}&backTo=${backTo}`,
    },
    SCHEDULE_CALL_BOOK: {
        route: 'r/:reportID/schedule-call/book',
        getRoute: (reportID) => `r/${reportID}/schedule-call/book`,
    },
    SCHEDULE_CALL_CONFIRMATION: {
        route: 'r/:reportID/schedule-call/confirmation',
        getRoute: (reportID) => `r/${reportID}/schedule-call/confirmation`,
    },
    TEST_TOOLS_MODAL: {
        route: 'test-tools',
        // eslint-disable-next-line no-restricted-syntax -- Legacy route generation
        getRoute: (backTo) => getUrlWithBackToParam('test-tools', backTo),
    },
};
/**
 * Configuration for shared parameters that can be passed between routes.
 * These parameters are commonly used across multiple screens and are preserved
 * during navigation state transitions.
 *
 * Currently includes:
 * - `backTo`: Specifies the route to return to when navigating back, preserving
 *   navigation context in split-screen and central screen
 */
const SHARED_ROUTE_PARAMS = {
    [SCREENS_1.default.WORKSPACE.INITIAL]: ['backTo'],
};
exports.SHARED_ROUTE_PARAMS = SHARED_ROUTE_PARAMS;
exports.default = ROUTES;
function getAttachmentModalScreenRoute(url, params) {
    if (!params?.source) {
        return url;
    }
    const { source, attachmentID, type, reportID, accountID, isAuthTokenRequired, originalFileName, attachmentLink } = params;
    const sourceParam = `?source=${encodeURIComponent(source)}`;
    const attachmentIDParam = attachmentID ? `&attachmentID=${attachmentID}` : '';
    const typeParam = type ? `&type=${type}` : '';
    const reportIDParam = reportID ? `&reportID=${reportID}` : '';
    const accountIDParam = accountID ? `&accountID=${accountID}` : '';
    const authTokenParam = isAuthTokenRequired ? '&isAuthTokenRequired=true' : '';
    const fileNameParam = originalFileName ? `&originalFileName=${originalFileName}` : '';
    const attachmentLinkParam = attachmentLink ? `&attachmentLink=${attachmentLink}` : '';
    return `${url}${sourceParam}${typeParam}${reportIDParam}${attachmentIDParam}${accountIDParam}${authTokenParam}${fileNameParam}${attachmentLinkParam} `;
}
