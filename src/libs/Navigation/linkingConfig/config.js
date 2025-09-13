"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.normalizedConfigs = void 0;
const createNormalizedConfigs_1 = require("@libs/Navigation/helpers/createNormalizedConfigs");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const getHistoryParamParse_1 = require("./helpers/getHistoryParamParse");
const HISTORY_PARAM_1 = require("./HISTORY_PARAM");
// Moved to a separate file to avoid cyclic dependencies.
const config = {
    screens: {
        // Main Routes
        [SCREENS_1.default.VALIDATE_LOGIN]: ROUTES_1.default.VALIDATE_LOGIN,
        [SCREENS_1.default.UNLINK_LOGIN]: ROUTES_1.default.UNLINK_LOGIN,
        [SCREENS_1.default.TRANSITION_BETWEEN_APPS]: ROUTES_1.default.TRANSITION_BETWEEN_APPS,
        [SCREENS_1.default.CONNECTION_COMPLETE]: ROUTES_1.default.CONNECTION_COMPLETE,
        [SCREENS_1.default.BANK_CONNECTION_COMPLETE]: ROUTES_1.default.BANK_CONNECTION_COMPLETE,
        [SCREENS_1.default.CONCIERGE]: ROUTES_1.default.CONCIERGE,
        [SCREENS_1.default.TRACK_EXPENSE]: ROUTES_1.default.TRACK_EXPENSE,
        [SCREENS_1.default.SUBMIT_EXPENSE]: ROUTES_1.default.SUBMIT_EXPENSE,
        [SCREENS_1.default.SIGN_IN_WITH_APPLE_DESKTOP]: ROUTES_1.default.APPLE_SIGN_IN,
        [SCREENS_1.default.SIGN_IN_WITH_GOOGLE_DESKTOP]: ROUTES_1.default.GOOGLE_SIGN_IN,
        [SCREENS_1.default.SAML_SIGN_IN]: ROUTES_1.default.SAML_SIGN_IN,
        [SCREENS_1.default.DESKTOP_SIGN_IN_REDIRECT]: ROUTES_1.default.DESKTOP_SIGN_IN_REDIRECT,
        [SCREENS_1.default.ATTACHMENTS]: ROUTES_1.default.ATTACHMENTS.route,
        [SCREENS_1.default.PROFILE_AVATAR]: ROUTES_1.default.PROFILE_AVATAR.route,
        [SCREENS_1.default.WORKSPACE_AVATAR]: ROUTES_1.default.WORKSPACE_AVATAR.route,
        [SCREENS_1.default.REPORT_AVATAR]: ROUTES_1.default.REPORT_AVATAR.route,
        [SCREENS_1.default.TRANSACTION_RECEIPT]: ROUTES_1.default.TRANSACTION_RECEIPT.route,
        [SCREENS_1.default.MONEY_REQUEST.RECEIPT_PREVIEW]: ROUTES_1.default.MONEY_REQUEST_RECEIPT_PREVIEW.route,
        [SCREENS_1.default.WORKSPACE_JOIN_USER]: ROUTES_1.default.WORKSPACE_JOIN_USER.route,
        [SCREENS_1.default.REQUIRE_TWO_FACTOR_AUTH]: ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH,
        [SCREENS_1.default.WORKSPACES_LIST]: {
            path: ROUTES_1.default.WORKSPACES_LIST.route,
            exact: true,
        },
        [SCREENS_1.default.NOT_FOUND]: '*',
        [NAVIGATORS_1.default.PUBLIC_RIGHT_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.PUBLIC_CONSOLE_DEBUG]: {
                    path: ROUTES_1.default.PUBLIC_CONSOLE_DEBUG.route,
                    exact: true,
                },
            },
        },
        [NAVIGATORS_1.default.FEATURE_TRAINING_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.FEATURE_TRAINING_ROOT]: {
                    path: ROUTES_1.default.TRACK_TRAINING_MODAL,
                    exact: true,
                },
                [SCREENS_1.default.PROCESS_MONEY_REQUEST_HOLD_ROOT]: ROUTES_1.default.PROCESS_MONEY_REQUEST_HOLD.route,
                [SCREENS_1.default.AUTO_SUBMIT_ROOT]: ROUTES_1.default.AUTO_SUBMIT_MODAL_ROOT,
                [SCREENS_1.default.CHANGE_POLICY_EDUCATIONAL_ROOT]: ROUTES_1.default.CHANGE_POLICY_EDUCATIONAL.route,
            },
        },
        [NAVIGATORS_1.default.EXPLANATION_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.EXPLANATION_MODAL.ROOT]: {
                    path: ROUTES_1.default.EXPLANATION_MODAL_ROOT,
                    exact: true,
                },
            },
        },
        [NAVIGATORS_1.default.MIGRATED_USER_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.MIGRATED_USER_WELCOME_MODAL.ROOT]: {
                    path: ROUTES_1.default.MIGRATED_USER_WELCOME_MODAL.route,
                    exact: true,
                },
            },
        },
        [NAVIGATORS_1.default.TEST_DRIVE_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.TEST_DRIVE_MODAL.ROOT]: {
                    path: ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route,
                    exact: true,
                },
            },
        },
        [NAVIGATORS_1.default.TEST_DRIVE_DEMO_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.TEST_DRIVE_DEMO.ROOT]: {
                    path: ROUTES_1.default.TEST_DRIVE_DEMO_ROOT,
                    exact: true,
                },
            },
        },
        [NAVIGATORS_1.default.ONBOARDING_MODAL_NAVIGATOR]: {
            // Don't set the initialRouteName, because when the user continues from the last visited onboarding page,
            // the onboarding purpose page will be briefly visible.
            path: ROUTES_1.default.ONBOARDING_ROOT.route,
            screens: {
                [SCREENS_1.default.ONBOARDING.WORK_EMAIL]: {
                    path: ROUTES_1.default.ONBOARDING_WORK_EMAIL.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.WORK_EMAIL_VALIDATION]: {
                    path: ROUTES_1.default.ONBOARDING_WORK_EMAIL_VALIDATION.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.PURPOSE]: {
                    path: ROUTES_1.default.ONBOARDING_PURPOSE.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS]: {
                    path: ROUTES_1.default.ONBOARDING_PERSONAL_DETAILS.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.PRIVATE_DOMAIN]: {
                    path: ROUTES_1.default.ONBOARDING_PRIVATE_DOMAIN.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.EMPLOYEES]: {
                    path: ROUTES_1.default.ONBOARDING_EMPLOYEES.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.ACCOUNTING]: {
                    path: ROUTES_1.default.ONBOARDING_ACCOUNTING.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.INTERESTED_FEATURES]: {
                    path: ROUTES_1.default.ONBOARDING_INTERESTED_FEATURES.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.WORKSPACES]: {
                    path: ROUTES_1.default.ONBOARDING_WORKSPACES.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.WORKSPACE_OPTIONAL]: {
                    path: ROUTES_1.default.ONBOARDING_WORKSPACE.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.WORKSPACE_CONFIRMATION]: {
                    path: ROUTES_1.default.ONBOARDING_WORKSPACE_CONFIRMATION.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.WORKSPACE_CURRENCY]: {
                    path: ROUTES_1.default.ONBOARDING_WORKSPACE_CURRENCY.route,
                    exact: true,
                },
                [SCREENS_1.default.ONBOARDING.WORKSPACE_INVITE]: {
                    path: ROUTES_1.default.ONBOARDING_WORKSPACE_INVITE.route,
                    exact: true,
                },
            },
        },
        [NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.RIGHT_MODAL.SETTINGS]: {
                    screens: {
                        [SCREENS_1.default.SETTINGS.PREFERENCES.PRIORITY_MODE]: {
                            path: ROUTES_1.default.SETTINGS_PRIORITY_MODE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PREFERENCES.LANGUAGE]: {
                            path: ROUTES_1.default.SETTINGS_LANGUAGE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.ADD_PAYMENT_CARD]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.CHANGE_BILLING_CURRENCY]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_CHANGE_BILLING_CURRENCY,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.CHANGE_PAYMENT_CURRENCY]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_CHANGE_PAYMENT_CURRENCY,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.ADD_PAYMENT_CARD_CHANGE_CURRENCY]: {
                            path: ROUTES_1.default.SETTINGS_CHANGE_CURRENCY,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PREFERENCES.THEME]: {
                            path: ROUTES_1.default.SETTINGS_THEME,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PREFERENCES.PAYMENT_CURRENCY]: {
                            path: ROUTES_1.default.SETTINGS_PAYMENT_CURRENCY,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.CLOSE]: {
                            path: ROUTES_1.default.SETTINGS_CLOSE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_DETAILS]: {
                            path: ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.ACCOUNT_VALIDATE]: {
                            path: ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_MAGIC_CODE.route,
                        },
                        [SCREENS_1.default.SETTINGS.MERGE_ACCOUNTS.MERGE_RESULT]: {
                            path: ROUTES_1.default.SETTINGS_MERGE_ACCOUNTS_RESULT.route,
                        },
                        [SCREENS_1.default.SETTINGS.LOCK.LOCK_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_LOCK_ACCOUNT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.LOCK.UNLOCK_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_UNLOCK_ACCOUNT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.LOCK.FAILED_TO_LOCK_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_FAILED_TO_LOCK_ACCOUNT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.DOMAIN_CARD]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_DOMAIN_CARD.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.REPORT_VIRTUAL_CARD_FRAUD]: {
                            path: ROUTES_1.default.SETTINGS_REPORT_FRAUD.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.REPORT_VIRTUAL_CARD_FRAUD_CONFIRMATION]: {
                            path: ROUTES_1.default.SETTINGS_REPORT_FRAUD_CONFIRMATION.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.ENABLE_PAYMENTS]: {
                            path: ROUTES_1.default.SETTINGS_ENABLE_PAYMENTS,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.ENABLE_GLOBAL_REIMBURSEMENTS]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_ENABLE_GLOBAL_REIMBURSEMENTS.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.TRANSFER_BALANCE]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_TRANSFER_BALANCE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.CHOOSE_TRANSFER_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_CHOOSE_TRANSFER_ACCOUNT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.REPORT_CARD_LOST_OR_DAMAGED]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_REPORT_CARD_LOST_OR_DAMAGED.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.CARD_ACTIVATE]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_CARD_ACTIVATE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.WALLET.CARDS_DIGITAL_DETAILS_UPDATE_ADDRESS]: {
                            path: ROUTES_1.default.SETTINGS_WALLET_CARD_DIGITAL_DETAILS_UPDATE_ADDRESS.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.ADD_DEBIT_CARD]: {
                            path: ROUTES_1.default.SETTINGS_ADD_DEBIT_CARD,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.ADD_BANK_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_ADD_BANK_ACCOUNT.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.ADD_US_BANK_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_ADD_US_BANK_ACCOUNT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.PRONOUNS]: {
                            path: ROUTES_1.default.SETTINGS_PRONOUNS,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.DISPLAY_NAME]: {
                            path: ROUTES_1.default.SETTINGS_DISPLAY_NAME,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.TIMEZONE]: {
                            path: ROUTES_1.default.SETTINGS_TIMEZONE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.TIMEZONE_SELECT]: {
                            path: ROUTES_1.default.SETTINGS_TIMEZONE_SELECT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.APP_DOWNLOAD_LINKS]: {
                            path: ROUTES_1.default.SETTINGS_APP_DOWNLOAD_LINKS,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.CONSOLE]: {
                            path: ROUTES_1.default.SETTINGS_CONSOLE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.SHARE_LOG]: ROUTES_1.default.SETTINGS_SHARE_LOG.route,
                        [SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHODS]: {
                            path: ROUTES_1.default.SETTINGS_CONTACT_METHODS.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHOD_DETAILS]: {
                            path: ROUTES_1.default.SETTINGS_CONTACT_METHOD_DETAILS.route,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.NEW_CONTACT_METHOD]: {
                            path: ROUTES_1.default.SETTINGS_NEW_CONTACT_METHOD.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.CONTACT_METHOD_VERIFY_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.LEGAL_NAME]: {
                            path: ROUTES_1.default.SETTINGS_LEGAL_NAME,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.PHONE_NUMBER]: {
                            path: ROUTES_1.default.SETTINGS_PHONE_NUMBER,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.DATE_OF_BIRTH]: {
                            path: ROUTES_1.default.SETTINGS_DATE_OF_BIRTH,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.ADDRESS]: {
                            path: ROUTES_1.default.SETTINGS_ADDRESS,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.ADDRESS_COUNTRY]: {
                            path: ROUTES_1.default.SETTINGS_ADDRESS_COUNTRY.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.ADDRESS_STATE]: {
                            path: ROUTES_1.default.SETTINGS_ADDRESS_STATE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.DELEGATE.VERIFY_ACCOUNT]: {
                            path: ROUTES_1.default.SETTINGS_DELEGATE_VERIFY_ACCOUNT,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.DELEGATE.ADD_DELEGATE]: {
                            path: ROUTES_1.default.SETTINGS_ADD_DELEGATE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_ROLE]: {
                            path: ROUTES_1.default.SETTINGS_DELEGATE_ROLE.route,
                        },
                        [SCREENS_1.default.SETTINGS.DELEGATE.UPDATE_DELEGATE_ROLE]: {
                            path: ROUTES_1.default.SETTINGS_UPDATE_DELEGATE_ROLE.route,
                        },
                        [SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_CONFIRM]: {
                            path: ROUTES_1.default.SETTINGS_DELEGATE_CONFIRM.route,
                            parse: (0, getHistoryParamParse_1.default)(HISTORY_PARAM_1.default.SHOW_VALIDATE_CODE_ACTION_MODAL),
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.STATUS]: {
                            path: ROUTES_1.default.SETTINGS_STATUS,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER]: {
                            path: ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER_DATE]: {
                            path: ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER_DATE,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.STATUS_CLEAR_AFTER_TIME]: {
                            path: ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER_TIME,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.SETTINGS_DETAILS]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_SETTINGS_DETAILS,
                        },
                        [SCREENS_1.default.SETTINGS.PROFILE.VACATION_DELEGATE]: {
                            path: ROUTES_1.default.SETTINGS_VACATION_DELEGATE,
                            exact: true,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.SIZE]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_SIZE.route,
                            parse: {
                                canChangeSize: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.DISABLE_AUTO_RENEW_SURVEY]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_DISABLE_AUTO_RENEW_SURVEY,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.REQUEST_EARLY_CANCELLATION]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_REQUEST_EARLY_CANCELLATION,
                        },
                        [SCREENS_1.default.SETTINGS.SUBSCRIPTION.SUBSCRIPTION_DOWNGRADE_BLOCKED]: {
                            path: ROUTES_1.default.SETTINGS_SUBSCRIPTION_DOWNGRADE_BLOCKED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CURRENCY]: {
                            path: ROUTES_1.default.WORKSPACE_OVERVIEW_CURRENCY.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ADDRESS]: {
                            path: ROUTES_1.default.WORKSPACE_OVERVIEW_ADDRESS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PLAN]: {
                            path: ROUTES_1.default.WORKSPACE_OVERVIEW_PLAN.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_IMPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CHART_OF_ACCOUNTS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CHART_OF_ACCOUNTS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CLASSES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CUSTOMERS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CUSTOMERS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_LOCATIONS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_TAXES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_TAXES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_DATE_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_DATE_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_INVOICE_ACCOUNT_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_COMPANY_CARD_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_EXPORT_PREFERRED_EXPORTER]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_PREFERRED_EXPORTER.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ADVANCED]: {
                            path: ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ADVANCED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ACCOUNT_SELECTOR]: {
                            path: ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ACCOUNT_SELECTOR.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECTOR]: {
                            path: ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECTOR.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CLASSES_DISPLAYED_AS]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES_DISPLAYED_AS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_CUSTOMERS_DISPLAYED_AS]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CUSTOMERS_DISPLAYED_AS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_LOCATIONS_DISPLAYED_AS]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS_DISPLAYED_AS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_AUTO_SYNC]: {
                            path: ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_AUTO_SYNC.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_ONLINE_ACCOUNTING_METHOD]: {
                            path: ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ACCOUNTING_METHOD.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_COMPANY_CARD_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_ADVANCED]: {
                            path: ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_DESKTOP_ADVANCED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_PREFERRED_EXPORTER]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_PREFERRED_EXPORTER.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_EXPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_MODAL]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_MODAL.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_TRIGGER_FIRST_SYNC]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_TRIGGER_FIRST_SYNC.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_IMPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_IMPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CHART_OF_ACCOUNTS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CHART_OF_ACCOUNTS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CLASSES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CLASSES_DISPLAYED_AS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES_DISPLAYED_AS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CUSTOMERS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CUSTOMERS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_CUSTOMERS_DISPLAYED_AS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CUSTOMERS_DISPLAYED_AS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_ITEMS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_ITEMS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_IMPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_IMPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_CHART_OF_ACCOUNTS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_CHART_OF_ACCOUNTS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ORGANIZATION]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_ORGANIZATION.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_TRACKING_CATEGORIES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_MAP_TRACKING_CATEGORY]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES_MAP.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_CUSTOMER]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_CUSTOMER.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_TAXES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_TAXES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_PURCHASE_BILL_DATE_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT_PURCHASE_BILL_DATE_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_BANK_ACCOUNT_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT_BANK_ACCOUNT_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ADVANCED]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_ADVANCED.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_AUTO_SYNC]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_AUTO_SYNC.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_ACCOUNTING_METHOD]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_ACCOUNTING_METHOD.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_BILL_STATUS_SELECTOR]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_BILL_STATUS_SELECTOR.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_INVOICE_ACCOUNT_SELECTOR]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_INVOICE_SELECTOR.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_EXPORT_PREFERRED_EXPORTER_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_PREFERRED_EXPORTER_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.XERO_BILL_PAYMENT_ACCOUNT_SELECTOR]: { path: ROUTES_1.default.POLICY_ACCOUNTING_XERO_BILL_PAYMENT_ACCOUNT_SELECTOR.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_SUBSIDIARY_SELECTOR]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_SUBSIDIARY_SELECTOR.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_TOKEN_INPUT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_TOKEN_INPUT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_REUSE_EXISTING_CONNECTIONS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXISTING_CONNECTIONS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_MAPPING]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_MAPPING.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD_VIEW]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_VIEW.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_FIELD_EDIT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_EDIT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_LIST_ADD]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_LIST_ADD.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOM_SEGMENT_ADD]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_SEGMENT_ADD.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS_SELECT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS_SELECT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_PREFERRED_EXPORTER_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_PREFERRED_EXPORTER_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_DATE_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_DATE_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_DESTINATION_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_DESTINATION_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_VENDOR_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_VENDOR_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPORT_EXPENSES_JOURNAL_POSTING_PREFERENCE_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_JOURNAL_POSTING_PREFERENCE_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_RECEIVABLE_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_RECEIVABLE_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_INVOICE_ITEM_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_TAX_POSTING_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_TAX_POSTING_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_ADVANCED]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_REIMBURSEMENT_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_REIMBURSEMENT_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_COLLECTION_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_COLLECTION_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_EXPENSE_REPORT_APPROVAL_LEVEL_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPENSE_REPORT_APPROVAL_LEVEL_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_VENDOR_BILL_APPROVAL_LEVEL_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_VENDOR_BILL_APPROVAL_LEVEL_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_JOURNAL_ENTRY_APPROVAL_LEVEL_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_JOURNAL_ENTRY_APPROVAL_LEVEL_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_APPROVAL_ACCOUNT_SELECT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_APPROVAL_ACCOUNT_SELECT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_CUSTOM_FORM_ID]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_CUSTOM_FORM_ID.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_AUTO_SYNC]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_AUTO_SYNC.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.NETSUITE_ACCOUNTING_METHOD]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ACCOUNTING_METHOD.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PREREQUISITES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PREREQUISITES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.ENTER_SAGE_INTACCT_CREDENTIALS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ENTER_CREDENTIALS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.EXISTING_SAGE_INTACCT_CONNECTIONS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXISTING_CONNECTIONS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ENTITY]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ENTITY.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_MAPPING_TYPE]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_MAPPINGS_TYPE.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT_TAX]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_IMPORT_TAX_MAPPING]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT_TAX_MAPPING.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_TOGGLE_MAPPING]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_TOGGLE_MAPPINGS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_USER_DIMENSIONS]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_USER_DIMENSIONS.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ADD_USER_DIMENSION]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADD_USER_DIMENSION.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EDIT_USER_DIMENSION]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EDIT_USER_DIMENSION.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EXPORT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PREFERRED_EXPORTER]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PREFERRED_EXPORTER.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_EXPORT_DATE]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT_DATE.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_REIMBURSABLE_EXPENSES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_EXPENSES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_REIMBURSABLE_DESTINATION]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_DESTINATION.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_DESTINATION]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_DESTINATION.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_DEFAULT_VENDOR]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_DEFAULT_VENDOR.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_NON_REIMBURSABLE_CREDIT_CARD_ACCOUNT]: {
                            path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_CREDIT_CARD_ACCOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ADVANCED]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_AUTO_SYNC]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_AUTO_SYNC.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_ACCOUNTING_METHOD]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ACCOUNTING_METHOD.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.SAGE_INTACCT_PAYMENT_ACCOUNT]: { path: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PAYMENT_ACCOUNT.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.CARD_RECONCILIATION]: { path: ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.route },
                        [SCREENS_1.default.WORKSPACE.ACCOUNTING.RECONCILIATION_ACCOUNT_SETTINGS]: { path: ROUTES_1.default.WORKSPACE_ACCOUNTING_RECONCILIATION_ACCOUNT_SETTINGS.route },
                        [SCREENS_1.default.WORKSPACE.DESCRIPTION]: {
                            path: ROUTES_1.default.WORKSPACE_OVERVIEW_DESCRIPTION.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_AUTO_REPORTING_FREQUENCY]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_AUTOREPORTING_FREQUENCY.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_AUTO_REPORTING_MONTHLY_OFFSET]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_AUTOREPORTING_MONTHLY_OFFSET.route,
                        },
                        [SCREENS_1.default.WORKSPACE.SHARE]: {
                            path: ROUTES_1.default.WORKSPACE_OVERVIEW_SHARE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.INVOICES_COMPANY_NAME]: {
                            path: ROUTES_1.default.WORKSPACE_INVOICES_COMPANY_NAME.route,
                        },
                        [SCREENS_1.default.WORKSPACE.INVOICES_COMPANY_WEBSITE]: {
                            path: ROUTES_1.default.WORKSPACE_INVOICES_COMPANY_WEBSITE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SELECT_FEED]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SELECT_FEED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_BANK_CONNECTION]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_BANK_CONNECTION.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARD_DETAILS]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARD_NAME]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARD_NAME.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARD_EXPORT]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARD_EXPORT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_LIMIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_ISSUE_NEW]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_ISSUE_NEW.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_NAME]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_NAME.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_LIMIT_TYPE]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_LIMIT_TYPE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_BANK_ACCOUNT]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_BANK_ACCOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS_FREQUENCY]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS_FREQUENCY.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SETTINGS_ACCOUNT]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS_ACCOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_SELECT_FEED]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SELECT_FEED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS_FEED_NAME]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS_FEED_NAME.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SETTINGS_STATEMENT_CLOSE_DATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD_DETAILS]: {
                            path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_DETAILS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ADD_NEW]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ADD_NEW.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_ASSIGN_CARD]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_ASSIGN_CARD.route,
                        },
                        [SCREENS_1.default.WORKSPACE.COMPANY_CARDS_TRANSACTION_START_DATE]: {
                            path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS_TRANSACTION_START_DATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.INVITE]: {
                            path: ROUTES_1.default.WORKSPACE_INVITE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.MEMBERS_IMPORT]: {
                            path: ROUTES_1.default.WORKSPACE_MEMBERS_IMPORT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.MEMBERS_IMPORTED]: {
                            path: ROUTES_1.default.WORKSPACE_MEMBERS_IMPORTED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.MEMBERS_IMPORTED_CONFIRMATION]: {
                            path: ROUTES_1.default.WORKSPACE_MEMBERS_IMPORTED_CONFIRMATION.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_NEW]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_NEW.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_EXPENSES_FROM]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_EXPENSES_FROM.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_APPROVALS_APPROVER]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_APPROVALS_APPROVER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.INVITE_MESSAGE]: {
                            path: ROUTES_1.default.WORKSPACE_INVITE_MESSAGE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.INVITE_MESSAGE_ROLE]: {
                            path: ROUTES_1.default.WORKSPACE_INVITE_MESSAGE_ROLE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS_INVITE]: {
                            path: ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS_INVITE_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT.route,
                            screens: {
                                [CONST_1.default.TAB.RECEIPT_PARTNERS.ALL]: {
                                    path: ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT_ALL,
                                    exact: true,
                                },
                                [CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED]: {
                                    path: ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT_LINKED,
                                    exact: true,
                                },
                                [CONST_1.default.TAB.RECEIPT_PARTNERS.OUTSTANDING]: {
                                    path: ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS_INVITE_EDIT_OUTSTANDING,
                                    exact: true,
                                },
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.UPGRADE]: {
                            path: ROUTES_1.default.WORKSPACE_UPGRADE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DOWNGRADE]: {
                            path: ROUTES_1.default.WORKSPACE_DOWNGRADE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PAY_AND_DOWNGRADE]: {
                            path: ROUTES_1.default.WORKSPACE_PAY_AND_DOWNGRADE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORIES_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORIES_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORIES_IMPORT]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORIES_IMPORT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORIES_IMPORTED]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORIES_IMPORTED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.WORKFLOWS_PAYER]: {
                            path: ROUTES_1.default.WORKSPACE_WORKFLOWS_PAYER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.MEMBER_DETAILS]: {
                            path: ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.MEMBER_CUSTOM_FIELD]: {
                            path: ROUTES_1.default.WORKSPACE_CUSTOM_FIELDS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.MEMBER_NEW_CARD]: {
                            path: ROUTES_1.default.WORKSPACE_MEMBER_NEW_CARD.route,
                        },
                        [SCREENS_1.default.WORKSPACE.OWNER_CHANGE_SUCCESS]: {
                            path: ROUTES_1.default.WORKSPACE_OWNER_CHANGE_SUCCESS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.OWNER_CHANGE_ERROR]: {
                            path: ROUTES_1.default.WORKSPACE_OWNER_CHANGE_ERROR.route,
                        },
                        [SCREENS_1.default.WORKSPACE.OWNER_CHANGE_CHECK]: {
                            path: ROUTES_1.default.WORKSPACE_OWNER_CHANGE_CHECK.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_CREATE]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_CREATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_PAYROLL_CODE]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_PAYROLL_CODE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_GL_CODE]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_GL_CODE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_DEFAULT_TAX_RATE]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_DEFAULT_TAX_RATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_FLAG_AMOUNTS_OVER]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_FLAG_AMOUNTS_OVER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_DESCRIPTION_HINT]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_DESCRIPTION_HINT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_APPROVER]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_APPROVER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CATEGORY_REQUIRE_RECEIPTS_OVER]: {
                            path: ROUTES_1.default.WORKSPACE_CATEGORY_REQUIRE_RECEIPTS_OVER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.CREATE_DISTANCE_RATE]: {
                            path: ROUTES_1.default.WORKSPACE_CREATE_DISTANCE_RATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DISTANCE_RATES_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_DISTANCE_RATES_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_DETAILS]: {
                            path: ROUTES_1.default.WORKSPACE_DISTANCE_RATE_DETAILS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_DISTANCE_RATE_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_NAME_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_DISTANCE_RATE_NAME_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_DISTANCE_RATE_TAX_RECLAIMABLE_ON_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.DISTANCE_RATE_TAX_RATE_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_DISTANCE_RATE_TAX_RATE_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_TAGS_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_EDIT_TAGS.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_IMPORT]: {
                            path: ROUTES_1.default.WORKSPACE_TAGS_IMPORT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_IMPORT_OPTIONS]: {
                            path: ROUTES_1.default.WORKSPACE_TAGS_IMPORT_OPTIONS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_IMPORT_MULTI_LEVEL_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_MULTI_LEVEL_TAGS_IMPORT_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_IMPORTED]: {
                            path: ROUTES_1.default.WORKSPACE_TAGS_IMPORTED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAGS_IMPORTED_MULTI_LEVEL]: {
                            path: ROUTES_1.default.WORKSPACE_TAGS_IMPORTED_MULTI_LEVEL.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAG_CREATE]: {
                            path: ROUTES_1.default.WORKSPACE_TAG_CREATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAG_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_TAG_EDIT.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.TAG_APPROVER]: {
                            path: ROUTES_1.default.WORKSPACE_TAG_APPROVER.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.TAG_GL_CODE]: {
                            path: ROUTES_1.default.WORKSPACE_TAG_GL_CODE.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.TAG_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_TAG_SETTINGS.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.TAG_LIST_VIEW]: {
                            path: ROUTES_1.default.WORKSPACE_TAG_LIST_VIEW.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_TAXES_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_CUSTOM_TAX_NAME]: {
                            path: ROUTES_1.default.WORKSPACE_TAXES_SETTINGS_CUSTOM_TAX_NAME.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_FOREIGN_CURRENCY_DEFAULT]: {
                            path: ROUTES_1.default.WORKSPACE_TAXES_SETTINGS_FOREIGN_CURRENCY_DEFAULT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAXES_SETTINGS_WORKSPACE_CURRENCY_DEFAULT]: {
                            path: ROUTES_1.default.WORKSPACE_TAXES_SETTINGS_WORKSPACE_CURRENCY_DEFAULT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_CREATE]: {
                            path: ROUTES_1.default.WORKSPACE_CREATE_REPORT_FIELD.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_LIST_VALUES]: {
                            path: ROUTES_1.default.WORKSPACE_REPORT_FIELDS_LIST_VALUES.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_ADD_VALUE]: {
                            path: ROUTES_1.default.WORKSPACE_REPORT_FIELDS_ADD_VALUE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_VALUE_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_REPORT_FIELDS_VALUE_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_EDIT_VALUE]: {
                            path: ROUTES_1.default.WORKSPACE_REPORT_FIELDS_EDIT_VALUE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_REPORT_FIELDS_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORT_FIELDS_EDIT_INITIAL_VALUE]: {
                            path: ROUTES_1.default.WORKSPACE_EDIT_REPORT_FIELDS_INITIAL_VALUE.route,
                        },
                        [SCREENS_1.default.REIMBURSEMENT_ACCOUNT]: {
                            path: ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.route,
                            exact: true,
                        },
                        [SCREENS_1.default.REIMBURSEMENT_ACCOUNT_ENTER_SIGNER_INFO]: ROUTES_1.default.BANK_ACCOUNT_ENTER_SIGNER_INFO.route,
                        [SCREENS_1.default.KEYBOARD_SHORTCUTS]: {
                            path: ROUTES_1.default.KEYBOARD_SHORTCUTS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.NAME]: ROUTES_1.default.WORKSPACE_OVERVIEW_NAME.route,
                        [SCREENS_1.default.SETTINGS.SHARE_CODE]: {
                            path: ROUTES_1.default.SETTINGS_SHARE_CODE,
                        },
                        [SCREENS_1.default.SETTINGS.EXIT_SURVEY.REASON]: {
                            path: ROUTES_1.default.SETTINGS_EXIT_SURVEY_REASON.route,
                        },
                        [SCREENS_1.default.SETTINGS.EXIT_SURVEY.RESPONSE]: {
                            path: ROUTES_1.default.SETTINGS_EXIT_SURVEY_RESPONSE.route,
                        },
                        [SCREENS_1.default.SETTINGS.EXIT_SURVEY.CONFIRM]: {
                            path: ROUTES_1.default.SETTINGS_EXIT_SURVEY_CONFIRM.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAX_CREATE]: {
                            path: ROUTES_1.default.WORKSPACE_TAX_CREATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAX_EDIT]: {
                            path: ROUTES_1.default.WORKSPACE_TAX_EDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAX_CODE]: {
                            path: ROUTES_1.default.WORKSPACE_TAX_CODE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAX_NAME]: {
                            path: ROUTES_1.default.WORKSPACE_TAX_NAME.route,
                        },
                        [SCREENS_1.default.WORKSPACE.TAX_VALUE]: {
                            path: ROUTES_1.default.WORKSPACE_TAX_VALUE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.REPORTS_DEFAULT_TITLE]: {
                            path: ROUTES_1.default.REPORTS_DEFAULT_TITLE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_AUTO_APPROVE_REPORTS_UNDER]: {
                            path: ROUTES_1.default.RULES_AUTO_APPROVE_REPORTS_UNDER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_RANDOM_REPORT_AUDIT]: {
                            path: ROUTES_1.default.RULES_RANDOM_REPORT_AUDIT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_AUTO_PAY_REPORTS_UNDER]: {
                            path: ROUTES_1.default.RULES_AUTO_PAY_REPORTS_UNDER.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_RECEIPT_REQUIRED_AMOUNT]: {
                            path: ROUTES_1.default.RULES_RECEIPT_REQUIRED_AMOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_MAX_EXPENSE_AMOUNT]: {
                            path: ROUTES_1.default.RULES_MAX_EXPENSE_AMOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_MAX_EXPENSE_AGE]: {
                            path: ROUTES_1.default.RULES_MAX_EXPENSE_AGE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_BILLABLE_DEFAULT]: {
                            path: ROUTES_1.default.RULES_BILLABLE_DEFAULT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_REIMBURSABLE_DEFAULT]: {
                            path: ROUTES_1.default.RULES_REIMBURSABLE_DEFAULT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_CUSTOM]: {
                            path: ROUTES_1.default.RULES_CUSTOM.route,
                        },
                        [SCREENS_1.default.WORKSPACE.RULES_PROHIBITED_DEFAULT]: {
                            path: ROUTES_1.default.RULES_PROHIBITED_DEFAULT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_IMPORT]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_IMPORT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_IMPORTED]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_IMPORTED.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_SETTINGS]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_SETTINGS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_DETAILS]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_DETAILS.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_DESTINATION]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_DESTINATION.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_SUBRATE]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_SUBRATE.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_AMOUNT]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_AMOUNT.route,
                        },
                        [SCREENS_1.default.WORKSPACE.PER_DIEM_EDIT_CURRENCY]: {
                            path: ROUTES_1.default.WORKSPACE_PER_DIEM_EDIT_CURRENCY.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.TWO_FACTOR_AUTH]: {
                    screens: {
                        [SCREENS_1.default.TWO_FACTOR_AUTH.ROOT]: {
                            path: ROUTES_1.default.SETTINGS_2FA_ROOT.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TWO_FACTOR_AUTH.VERIFY]: {
                            path: ROUTES_1.default.SETTINGS_2FA_VERIFY.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TWO_FACTOR_AUTH.SUCCESS]: {
                            path: ROUTES_1.default.SETTINGS_2FA_SUCCESS.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TWO_FACTOR_AUTH.DISABLED]: {
                            path: ROUTES_1.default.SETTINGS_2FA_DISABLED,
                            exact: true,
                        },
                        [SCREENS_1.default.TWO_FACTOR_AUTH.DISABLE]: {
                            path: ROUTES_1.default.SETTINGS_2FA_DISABLE,
                            exact: true,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.PRIVATE_NOTES]: {
                    screens: {
                        [SCREENS_1.default.PRIVATE_NOTES.LIST]: ROUTES_1.default.PRIVATE_NOTES_LIST.route,
                        [SCREENS_1.default.PRIVATE_NOTES.EDIT]: ROUTES_1.default.PRIVATE_NOTES_EDIT.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.NEW_REPORT_WORKSPACE_SELECTION]: {
                    screens: {
                        [SCREENS_1.default.NEW_REPORT_WORKSPACE_SELECTION.ROOT]: ROUTES_1.default.NEW_REPORT_WORKSPACE_SELECTION,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.REPORT_DETAILS]: {
                    screens: {
                        [SCREENS_1.default.REPORT_DETAILS.ROOT]: ROUTES_1.default.REPORT_WITH_ID_DETAILS.route,
                        [SCREENS_1.default.REPORT_DETAILS.SHARE_CODE]: ROUTES_1.default.REPORT_WITH_ID_DETAILS_SHARE_CODE.route,
                        [SCREENS_1.default.REPORT_DETAILS.EXPORT]: ROUTES_1.default.REPORT_WITH_ID_DETAILS_EXPORT.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.REPORT_CHANGE_WORKSPACE]: {
                    screens: {
                        [SCREENS_1.default.REPORT_CHANGE_WORKSPACE.ROOT]: ROUTES_1.default.REPORT_WITH_ID_CHANGE_WORKSPACE.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.REPORT_SETTINGS]: {
                    screens: {
                        [SCREENS_1.default.REPORT_SETTINGS.ROOT]: {
                            path: ROUTES_1.default.REPORT_SETTINGS.route,
                        },
                        [SCREENS_1.default.REPORT_SETTINGS.NAME]: {
                            path: ROUTES_1.default.REPORT_SETTINGS_NAME.route,
                        },
                        [SCREENS_1.default.REPORT_SETTINGS.NOTIFICATION_PREFERENCES]: {
                            path: ROUTES_1.default.REPORT_SETTINGS_NOTIFICATION_PREFERENCES.route,
                        },
                        [SCREENS_1.default.REPORT_SETTINGS.WRITE_CAPABILITY]: {
                            path: ROUTES_1.default.REPORT_SETTINGS_WRITE_CAPABILITY.route,
                        },
                        [SCREENS_1.default.REPORT_SETTINGS.VISIBILITY]: {
                            path: ROUTES_1.default.REPORT_SETTINGS_VISIBILITY.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SETTINGS_CATEGORIES]: {
                    screens: {
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_SETTINGS]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORY_SETTINGS.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_SETTINGS]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORIES_SETTINGS.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_CREATE]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORY_CREATE.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_EDIT]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORY_EDIT.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORT]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORIES_IMPORT.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_IMPORTED]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORIES_IMPORTED.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_PAYROLL_CODE]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORY_PAYROLL_CODE.route,
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORY_GL_CODE]: {
                            path: ROUTES_1.default.SETTINGS_CATEGORY_GL_CODE.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SETTINGS_TAGS]: {
                    screens: {
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_SETTINGS]: {
                            path: ROUTES_1.default.SETTINGS_TAGS_SETTINGS.route,
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_EDIT]: {
                            path: ROUTES_1.default.SETTINGS_TAGS_EDIT.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_CREATE]: {
                            path: ROUTES_1.default.SETTINGS_TAG_CREATE.route,
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_EDIT]: {
                            path: ROUTES_1.default.SETTINGS_TAG_EDIT.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_SETTINGS]: {
                            path: ROUTES_1.default.SETTINGS_TAG_SETTINGS.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_APPROVER]: {
                            path: ROUTES_1.default.SETTINGS_TAG_APPROVER.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_LIST_VIEW]: {
                            path: ROUTES_1.default.SETTINGS_TAG_LIST_VIEW.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAG_GL_CODE]: {
                            path: ROUTES_1.default.SETTINGS_TAG_GL_CODE.route,
                            parse: {
                                orderWeight: Number,
                            },
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORT]: {
                            path: ROUTES_1.default.SETTINGS_TAGS_IMPORT.route,
                        },
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_IMPORTED]: {
                            path: ROUTES_1.default.SETTINGS_TAGS_IMPORTED.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.EXPENSIFY_CARD]: {
                    screens: {
                        [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_DETAILS]: {
                            path: ROUTES_1.default.EXPENSIFY_CARD_DETAILS.route,
                        },
                        [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_NAME]: {
                            path: ROUTES_1.default.EXPENSIFY_CARD_NAME.route,
                        },
                        [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_LIMIT]: {
                            path: ROUTES_1.default.EXPENSIFY_CARD_LIMIT.route,
                        },
                        [SCREENS_1.default.EXPENSIFY_CARD.EXPENSIFY_CARD_LIMIT_TYPE]: {
                            path: ROUTES_1.default.EXPENSIFY_CARD_LIMIT_TYPE.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.DOMAIN_CARD]: {
                    screens: {
                        [SCREENS_1.default.DOMAIN_CARD.DOMAIN_CARD_DETAIL]: {
                            path: ROUTES_1.default.SETTINGS_DOMAIN_CARD_DETAIL.route,
                        },
                        [SCREENS_1.default.DOMAIN_CARD.DOMAIN_CARD_REPORT_FRAUD]: {
                            path: ROUTES_1.default.SETTINGS_DOMAIN_CARD_REPORT_FRAUD.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.REPORT_DESCRIPTION]: {
                    screens: {
                        [SCREENS_1.default.REPORT_DESCRIPTION_ROOT]: ROUTES_1.default.REPORT_DESCRIPTION.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.NEW_CHAT]: {
                    screens: {
                        [SCREENS_1.default.NEW_CHAT.ROOT]: {
                            path: ROUTES_1.default.NEW,
                            exact: true,
                            screens: {
                                [SCREENS_1.default.NEW_CHAT.NEW_CHAT]: {
                                    path: ROUTES_1.default.NEW_CHAT,
                                    exact: true,
                                },
                                [SCREENS_1.default.NEW_CHAT.NEW_ROOM]: {
                                    path: ROUTES_1.default.NEW_ROOM,
                                    exact: true,
                                },
                            },
                        },
                        [SCREENS_1.default.NEW_CHAT.NEW_CHAT_CONFIRM]: {
                            path: ROUTES_1.default.NEW_CHAT_CONFIRM,
                            exact: true,
                        },
                        [SCREENS_1.default.NEW_CHAT.NEW_CHAT_EDIT_NAME]: {
                            path: ROUTES_1.default.NEW_CHAT_EDIT_NAME,
                            exact: true,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.WORKSPACE_CONFIRMATION]: {
                    screens: {
                        [SCREENS_1.default.WORKSPACE_CONFIRMATION.ROOT]: ROUTES_1.default.WORKSPACE_CONFIRMATION.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.WORKSPACE_DUPLICATE]: {
                    screens: {
                        [SCREENS_1.default.WORKSPACE_DUPLICATE.ROOT]: ROUTES_1.default.WORKSPACE_DUPLICATE.route,
                        [SCREENS_1.default.WORKSPACE_DUPLICATE.SELECT_FEATURES]: ROUTES_1.default.WORKSPACE_DUPLICATE_SELECT_FEATURES.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.NEW_TASK]: {
                    screens: {
                        [SCREENS_1.default.NEW_TASK.ROOT]: ROUTES_1.default.NEW_TASK.route,
                        [SCREENS_1.default.NEW_TASK.TASK_ASSIGNEE_SELECTOR]: ROUTES_1.default.NEW_TASK_ASSIGNEE.route,
                        [SCREENS_1.default.NEW_TASK.TASK_SHARE_DESTINATION_SELECTOR]: ROUTES_1.default.NEW_TASK_SHARE_DESTINATION,
                        [SCREENS_1.default.NEW_TASK.DETAILS]: ROUTES_1.default.NEW_TASK_DETAILS.route,
                        [SCREENS_1.default.NEW_TASK.TITLE]: ROUTES_1.default.NEW_TASK_TITLE.route,
                        [SCREENS_1.default.NEW_TASK.DESCRIPTION]: ROUTES_1.default.NEW_TASK_DESCRIPTION.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.TEACHERS_UNITE]: {
                    screens: {
                        [SCREENS_1.default.I_KNOW_A_TEACHER]: ROUTES_1.default.I_KNOW_A_TEACHER,
                        [SCREENS_1.default.INTRO_SCHOOL_PRINCIPAL]: ROUTES_1.default.INTRO_SCHOOL_PRINCIPAL,
                        [SCREENS_1.default.I_AM_A_TEACHER]: ROUTES_1.default.I_AM_A_TEACHER,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.PROFILE]: {
                    screens: {
                        [SCREENS_1.default.PROFILE_ROOT]: ROUTES_1.default.PROFILE.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.PARTICIPANTS]: {
                    screens: {
                        [SCREENS_1.default.REPORT_PARTICIPANTS.ROOT]: ROUTES_1.default.REPORT_PARTICIPANTS.route,
                        [SCREENS_1.default.REPORT_PARTICIPANTS.INVITE]: ROUTES_1.default.REPORT_PARTICIPANTS_INVITE.route,
                        [SCREENS_1.default.REPORT_PARTICIPANTS.DETAILS]: ROUTES_1.default.REPORT_PARTICIPANTS_DETAILS.route,
                        [SCREENS_1.default.REPORT_PARTICIPANTS.ROLE]: ROUTES_1.default.REPORT_PARTICIPANTS_ROLE_SELECTION.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.ROOM_MEMBERS]: {
                    screens: {
                        [SCREENS_1.default.ROOM_MEMBERS.ROOT]: ROUTES_1.default.ROOM_MEMBERS.route,
                        [SCREENS_1.default.ROOM_MEMBERS.INVITE]: ROUTES_1.default.ROOM_INVITE.route,
                        [SCREENS_1.default.ROOM_MEMBERS.DETAILS]: ROUTES_1.default.ROOM_MEMBER_DETAILS.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.MONEY_REQUEST]: {
                    screens: {
                        [SCREENS_1.default.MONEY_REQUEST.START]: ROUTES_1.default.MONEY_REQUEST_START.route,
                        [SCREENS_1.default.MONEY_REQUEST.CREATE]: {
                            path: ROUTES_1.default.MONEY_REQUEST_CREATE.route,
                            exact: true,
                            screens: {
                                distance: {
                                    path: ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_DISTANCE.route,
                                },
                                manual: {
                                    path: ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_MANUAL.route,
                                },
                                scan: {
                                    path: ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_SCAN.route,
                                },
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'per-diem': {
                                    path: ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_PER_DIEM.route,
                                },
                            },
                        },
                        [SCREENS_1.default.MONEY_REQUEST.DISTANCE_CREATE]: {
                            path: ROUTES_1.default.DISTANCE_REQUEST_CREATE.route,
                            exact: true,
                            screens: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'distance-map': {
                                    path: ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MAP.route,
                                },
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'distance-manual': {
                                    path: ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MANUAL.route,
                                },
                            },
                        },
                        [SCREENS_1.default.SETTINGS_CATEGORIES.SETTINGS_CATEGORIES_ROOT]: ROUTES_1.default.SETTINGS_CATEGORIES_ROOT.route,
                        [SCREENS_1.default.SETTINGS_TAGS.SETTINGS_TAGS_ROOT]: ROUTES_1.default.SETTINGS_TAGS_ROOT.route,
                        [SCREENS_1.default.MONEY_REQUEST.EDIT_REPORT]: ROUTES_1.default.MONEY_REQUEST_EDIT_REPORT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_SEND_FROM]: ROUTES_1.default.MONEY_REQUEST_STEP_SEND_FROM.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_REPORT]: ROUTES_1.default.MONEY_REQUEST_STEP_REPORT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_COMPANY_INFO]: ROUTES_1.default.MONEY_REQUEST_STEP_COMPANY_INFO.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_AMOUNT]: ROUTES_1.default.MONEY_REQUEST_STEP_AMOUNT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_CATEGORY]: ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_CONFIRMATION]: ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_CURRENCY]: ROUTES_1.default.MONEY_REQUEST_STEP_CURRENCY.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_DATE]: ROUTES_1.default.MONEY_REQUEST_STEP_DATE.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_DESCRIPTION]: ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE]: ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_DISTANCE_RATE]: ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE_RATE.route,
                        [SCREENS_1.default.MONEY_REQUEST.HOLD]: ROUTES_1.default.MONEY_REQUEST_HOLD_REASON.route,
                        [SCREENS_1.default.MONEY_REQUEST.REJECT]: ROUTES_1.default.REJECT_MONEY_REQUEST_REASON.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_MERCHANT]: ROUTES_1.default.MONEY_REQUEST_STEP_MERCHANT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_PARTICIPANTS]: ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_SCAN]: ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.route,
                        [SCREENS_1.default.MONEY_REQUEST.RECEIPT_VIEW]: ROUTES_1.default.MONEY_REQUEST_RECEIPT_VIEW.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_TAG]: ROUTES_1.default.MONEY_REQUEST_STEP_TAG.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_WAYPOINT]: ROUTES_1.default.MONEY_REQUEST_STEP_WAYPOINT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_TAX_AMOUNT]: ROUTES_1.default.MONEY_REQUEST_STEP_TAX_AMOUNT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_TAX_RATE]: ROUTES_1.default.MONEY_REQUEST_STEP_TAX_RATE.route,
                        [SCREENS_1.default.MONEY_REQUEST.STATE_SELECTOR]: {
                            path: ROUTES_1.default.MONEY_REQUEST_STATE_SELECTOR.route,
                            exact: true,
                        },
                        [SCREENS_1.default.MONEY_REQUEST.STEP_SPLIT_PAYER]: ROUTES_1.default.MONEY_REQUEST_STEP_SPLIT_PAYER.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_ATTENDEES]: ROUTES_1.default.MONEY_REQUEST_ATTENDEE.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_ACCOUNTANT]: ROUTES_1.default.MONEY_REQUEST_ACCOUNTANT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_UPGRADE]: ROUTES_1.default.MONEY_REQUEST_UPGRADE.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_DESTINATION]: ROUTES_1.default.MONEY_REQUEST_STEP_DESTINATION.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_TIME]: ROUTES_1.default.MONEY_REQUEST_STEP_TIME.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_SUBRATE]: ROUTES_1.default.MONEY_REQUEST_STEP_SUBRATE.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_DESTINATION_EDIT]: ROUTES_1.default.MONEY_REQUEST_STEP_DESTINATION_EDIT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_TIME_EDIT]: ROUTES_1.default.MONEY_REQUEST_STEP_TIME_EDIT.route,
                        [SCREENS_1.default.MONEY_REQUEST.STEP_SUBRATE_EDIT]: ROUTES_1.default.MONEY_REQUEST_STEP_SUBRATE_EDIT.route,
                        [SCREENS_1.default.IOU_SEND.ENABLE_PAYMENTS]: ROUTES_1.default.IOU_SEND_ENABLE_PAYMENTS,
                        [SCREENS_1.default.IOU_SEND.ADD_BANK_ACCOUNT]: ROUTES_1.default.IOU_SEND_ADD_BANK_ACCOUNT,
                        [SCREENS_1.default.IOU_SEND.ADD_DEBIT_CARD]: ROUTES_1.default.IOU_SEND_ADD_DEBIT_CARD,
                        [SCREENS_1.default.MONEY_REQUEST.SPLIT_EXPENSE]: {
                            path: ROUTES_1.default.SPLIT_EXPENSE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.MONEY_REQUEST.SPLIT_EXPENSE_EDIT]: {
                            path: ROUTES_1.default.SPLIT_EXPENSE_EDIT.route,
                            exact: true,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.TRANSACTION_DUPLICATE]: {
                    screens: {
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.REVIEW]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.MERCHANT]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_MERCHANT_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.CATEGORY]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_CATEGORY_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.TAG]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAG_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.DESCRIPTION]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_DESCRIPTION_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.TAX_CODE]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAX_CODE_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.REIMBURSABLE]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_REIMBURSABLE_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.BILLABLE]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_BILLABLE_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.TRANSACTION_DUPLICATE.CONFIRMATION]: {
                            path: ROUTES_1.default.TRANSACTION_DUPLICATE_CONFIRMATION_PAGE.route,
                            exact: true,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.MERGE_TRANSACTION]: {
                    screens: {
                        [SCREENS_1.default.MERGE_TRANSACTION.LIST_PAGE]: ROUTES_1.default.MERGE_TRANSACTION_LIST_PAGE.route,
                        [SCREENS_1.default.MERGE_TRANSACTION.RECEIPT_PAGE]: ROUTES_1.default.MERGE_TRANSACTION_RECEIPT_PAGE.route,
                        [SCREENS_1.default.MERGE_TRANSACTION.DETAILS_PAGE]: ROUTES_1.default.MERGE_TRANSACTION_DETAILS_PAGE.route,
                        [SCREENS_1.default.MERGE_TRANSACTION.CONFIRMATION_PAGE]: ROUTES_1.default.MERGE_TRANSACTION_CONFIRMATION_PAGE.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SPLIT_DETAILS]: {
                    screens: {
                        [SCREENS_1.default.SPLIT_DETAILS.ROOT]: ROUTES_1.default.SPLIT_BILL_DETAILS.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.TASK_DETAILS]: {
                    screens: {
                        [SCREENS_1.default.TASK.TITLE]: ROUTES_1.default.TASK_TITLE.route,
                        [SCREENS_1.default.TASK.ASSIGNEE]: ROUTES_1.default.TASK_ASSIGNEE.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.ADD_PERSONAL_BANK_ACCOUNT]: {
                    screens: {
                        [SCREENS_1.default.ADD_PERSONAL_BANK_ACCOUNT_ROOT]: ROUTES_1.default.BANK_ACCOUNT_PERSONAL,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.ENABLE_PAYMENTS]: {
                    screens: {
                        [SCREENS_1.default.ENABLE_PAYMENTS_ROOT]: ROUTES_1.default.ENABLE_PAYMENTS,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.WALLET_STATEMENT]: {
                    screens: {
                        [SCREENS_1.default.WALLET_STATEMENT_ROOT]: ROUTES_1.default.WALLET_STATEMENT_WITH_DATE,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.FLAG_COMMENT]: {
                    screens: {
                        [SCREENS_1.default.FLAG_COMMENT_ROOT]: ROUTES_1.default.FLAG_COMMENT.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.EDIT_REQUEST]: {
                    screens: {
                        [SCREENS_1.default.EDIT_REQUEST.REPORT_FIELD]: {
                            path: ROUTES_1.default.EDIT_REPORT_FIELD_REQUEST.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SIGN_IN]: {
                    screens: {
                        [SCREENS_1.default.SIGN_IN_ROOT]: ROUTES_1.default.SIGN_IN_MODAL,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.REFERRAL]: {
                    screens: {
                        [SCREENS_1.default.REFERRAL_DETAILS]: ROUTES_1.default.REFERRAL_DETAILS_MODAL.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.TRAVEL]: {
                    screens: {
                        [SCREENS_1.default.TRAVEL.MY_TRIPS]: ROUTES_1.default.TRAVEL_MY_TRIPS,
                        [SCREENS_1.default.TRAVEL.TRAVEL_DOT_LINK_WEB_VIEW]: ROUTES_1.default.TRAVEL_DOT_LINK_WEB_VIEW.route,
                        [SCREENS_1.default.TRAVEL.UPGRADE]: ROUTES_1.default.TRAVEL_UPGRADE.route,
                        [SCREENS_1.default.TRAVEL.TCS]: ROUTES_1.default.TRAVEL_TCS.route,
                        [SCREENS_1.default.TRAVEL.TRIP_SUMMARY]: ROUTES_1.default.TRAVEL_TRIP_SUMMARY.route,
                        [SCREENS_1.default.TRAVEL.TRIP_DETAILS]: {
                            path: ROUTES_1.default.TRAVEL_TRIP_DETAILS.route,
                            parse: {
                                reservationIndex: (reservationIndex) => parseInt(reservationIndex, 10),
                            },
                        },
                        [SCREENS_1.default.TRAVEL.DOMAIN_SELECTOR]: ROUTES_1.default.TRAVEL_DOMAIN_SELECTOR.route,
                        [SCREENS_1.default.TRAVEL.DOMAIN_PERMISSION_INFO]: ROUTES_1.default.TRAVEL_DOMAIN_PERMISSION_INFO.route,
                        [SCREENS_1.default.TRAVEL.PUBLIC_DOMAIN_ERROR]: ROUTES_1.default.TRAVEL_PUBLIC_DOMAIN_ERROR.route,
                        [SCREENS_1.default.TRAVEL.WORKSPACE_ADDRESS]: ROUTES_1.default.TRAVEL_WORKSPACE_ADDRESS.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT]: {
                    screens: {
                        [SCREENS_1.default.SEARCH.REPORT_RHP]: ROUTES_1.default.SEARCH_REPORT.route,
                        [SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS]: ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS.route,
                        [SCREENS_1.default.SEARCH.TRANSACTION_HOLD_REASON_RHP]: ROUTES_1.default.TRANSACTION_HOLD_REASON_RHP,
                        [SCREENS_1.default.SEARCH.TRANSACTIONS_CHANGE_REPORT_SEARCH_RHP]: ROUTES_1.default.MOVE_TRANSACTIONS_SEARCH_RHP,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SEARCH_ADVANCED_FILTERS]: {
                    screens: {
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TYPE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TYPE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_GROUP_BY_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.GROUP_BY),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_STATUS_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.STATUS),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_DATE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DATE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_SUBMITTED_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.SUBMITTED),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_APPROVED_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.APPROVED),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PAID_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.PAID),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_EXPORTED_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.EXPORTED),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_POSTED_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.POSTED),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWN_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWN),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CURRENCY_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CURRENCY),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_GROUP_CURRENCY_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.GROUP_CURRENCY),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_MERCHANT_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.MERCHANT),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_DESCRIPTION_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.DESCRIPTION),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_REPORT_ID_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.REPORT_ID),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_AMOUNT_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.AMOUNT),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TOTAL_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TOTAL),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CATEGORY_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CATEGORY),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_KEYWORD_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.KEYWORD),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_CARD_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.CARD_ID),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TAX_RATE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.TAX_RATE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_EXPENSE_TYPE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.EXPENSE_TYPE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWAL_TYPE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.WITHDRAWAL_TYPE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WITHDRAWAL_ID_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.WITHDRAWAL_ID),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TAG_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TAG),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_FROM_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TO_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TO),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_IN_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.IN),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_TITLE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.TITLE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ASSIGNEE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.ASSIGNEE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_BILLABLE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.BILLABLE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_REIMBURSABLE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.REIMBURSABLE),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_WORKSPACE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.POLICY_ID),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_HAS_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.HAS),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PURCHASE_AMOUNT_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.PURCHASE_AMOUNT),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_PURCHASE_CURRENCY_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.PURCHASE_CURRENCY),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ACTION_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.ACTION),
                        [SCREENS_1.default.SEARCH.ADVANCED_FILTERS_ATTENDEE_RHP]: ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute(CONST_1.default.SEARCH.SEARCH_USER_FRIENDLY_KEYS.ATTENDEE),
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SEARCH_SAVED_SEARCH]: {
                    screens: {
                        [SCREENS_1.default.SEARCH.SAVED_SEARCH_RENAME_RHP]: ROUTES_1.default.SEARCH_SAVED_SEARCH_RENAME.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.RESTRICTED_ACTION]: {
                    screens: {
                        [SCREENS_1.default.RESTRICTED_ACTION_ROOT]: ROUTES_1.default.RESTRICTED_ACTION.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.MISSING_PERSONAL_DETAILS]: {
                    screens: {
                        [SCREENS_1.default.MISSING_PERSONAL_DETAILS_ROOT]: ROUTES_1.default.MISSING_PERSONAL_DETAILS,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.ADD_UNREPORTED_EXPENSE]: {
                    screens: {
                        [SCREENS_1.default.ADD_UNREPORTED_EXPENSES_ROOT]: ROUTES_1.default.ADD_UNREPORTED_EXPENSE.route,
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.DEBUG]: {
                    screens: {
                        [SCREENS_1.default.DEBUG.REPORT]: {
                            path: ROUTES_1.default.DEBUG_REPORT.route,
                            exact: true,
                            screens: {
                                details: {
                                    path: ROUTES_1.default.DEBUG_REPORT_TAB_DETAILS.route,
                                    exact: true,
                                },
                                json: {
                                    path: ROUTES_1.default.DEBUG_REPORT_TAB_JSON.route,
                                    exact: true,
                                },
                                actions: {
                                    path: ROUTES_1.default.DEBUG_REPORT_TAB_ACTIONS.route,
                                    exact: true,
                                },
                            },
                        },
                        [SCREENS_1.default.DEBUG.REPORT_ACTION]: {
                            path: ROUTES_1.default.DEBUG_REPORT_ACTION.route,
                            exact: true,
                            screens: {
                                details: {
                                    path: ROUTES_1.default.DEBUG_REPORT_ACTION_TAB_DETAILS.route,
                                    exact: true,
                                },
                                json: {
                                    path: ROUTES_1.default.DEBUG_REPORT_ACTION_TAB_JSON.route,
                                    exact: true,
                                },
                                preview: {
                                    path: ROUTES_1.default.DEBUG_REPORT_ACTION_TAB_PREVIEW.route,
                                    exact: true,
                                },
                            },
                        },
                        [SCREENS_1.default.DEBUG.REPORT_ACTION_CREATE]: {
                            path: ROUTES_1.default.DEBUG_REPORT_ACTION_CREATE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.DEBUG.DETAILS_CONSTANT_PICKER_PAGE]: {
                            path: ROUTES_1.default.DETAILS_CONSTANT_PICKER_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.DEBUG.DETAILS_DATE_TIME_PICKER_PAGE]: {
                            path: ROUTES_1.default.DETAILS_DATE_TIME_PICKER_PAGE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.DEBUG.TRANSACTION]: {
                            path: ROUTES_1.default.DEBUG_TRANSACTION.route,
                            exact: true,
                            screens: {
                                details: {
                                    path: ROUTES_1.default.DEBUG_TRANSACTION_TAB_DETAILS.route,
                                    exact: true,
                                },
                                json: {
                                    path: ROUTES_1.default.DEBUG_TRANSACTION_TAB_JSON.route,
                                    exact: true,
                                },
                                violations: {
                                    path: ROUTES_1.default.DEBUG_TRANSACTION_TAB_VIOLATIONS.route,
                                    exact: true,
                                },
                            },
                        },
                        [SCREENS_1.default.DEBUG.TRANSACTION_VIOLATION_CREATE]: {
                            path: ROUTES_1.default.DEBUG_TRANSACTION_VIOLATION_CREATE.route,
                            exact: true,
                        },
                        [SCREENS_1.default.DEBUG.TRANSACTION_VIOLATION]: {
                            path: ROUTES_1.default.DEBUG_TRANSACTION_VIOLATION.route,
                            exact: true,
                            screens: {
                                details: {
                                    path: ROUTES_1.default.DEBUG_TRANSACTION_VIOLATION_TAB_DETAILS.route,
                                    exact: true,
                                },
                                json: {
                                    path: ROUTES_1.default.DEBUG_TRANSACTION_VIOLATION_TAB_JSON.route,
                                    exact: true,
                                },
                            },
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.SCHEDULE_CALL]: {
                    screens: {
                        [SCREENS_1.default.SCHEDULE_CALL.BOOK]: {
                            path: ROUTES_1.default.SCHEDULE_CALL_BOOK.route,
                        },
                        [SCREENS_1.default.SCHEDULE_CALL.CONFIRMATION]: {
                            path: ROUTES_1.default.SCHEDULE_CALL_CONFIRMATION.route,
                        },
                    },
                },
                [SCREENS_1.default.RIGHT_MODAL.REPORT_CHANGE_APPROVER]: {
                    screens: {
                        [SCREENS_1.default.REPORT_CHANGE_APPROVER.ROOT]: ROUTES_1.default.REPORT_CHANGE_APPROVER.route,
                        [SCREENS_1.default.REPORT_CHANGE_APPROVER.ADD_APPROVER]: ROUTES_1.default.REPORT_CHANGE_APPROVER_ADD_APPROVER.route,
                    },
                },
            },
        },
        [NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR]: {
            path: ROUTES_1.default.ROOT,
            screens: {
                [SCREENS_1.default.HOME]: {
                    path: ROUTES_1.default.HOME,
                    exact: true,
                },
                [SCREENS_1.default.REPORT]: {
                    path: ROUTES_1.default.REPORT_WITH_ID.route,
                    // If params are defined, but reportID is explicitly undefined, we will get the url /r/undefined.
                    // We want to avoid that situation, so we will return an empty string instead.
                    parse: {
                        // eslint-disable-next-line
                        reportID: (reportID) => reportID ?? '',
                    },
                    stringify: {
                        // eslint-disable-next-line
                        reportID: (reportID) => reportID ?? '',
                    },
                },
            },
        },
        [NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.SETTINGS.ROOT]: ROUTES_1.default.SETTINGS,
                [SCREENS_1.default.SETTINGS.PROFILE.ROOT]: {
                    path: ROUTES_1.default.SETTINGS_PROFILE.route,
                    exact: true,
                },
                [SCREENS_1.default.SETTINGS.SECURITY]: {
                    path: ROUTES_1.default.SETTINGS_SECURITY,
                    exact: true,
                },
                [SCREENS_1.default.SETTINGS.WALLET.ROOT]: {
                    path: ROUTES_1.default.SETTINGS_WALLET,
                    exact: true,
                },
                [SCREENS_1.default.SETTINGS.ABOUT]: {
                    path: ROUTES_1.default.SETTINGS_ABOUT,
                    exact: true,
                },
                [SCREENS_1.default.SETTINGS.TROUBLESHOOT]: {
                    path: ROUTES_1.default.SETTINGS_TROUBLESHOOT,
                    exact: true,
                },
                [SCREENS_1.default.SETTINGS.SAVE_THE_WORLD]: ROUTES_1.default.SETTINGS_SAVE_THE_WORLD,
                [SCREENS_1.default.SETTINGS.PREFERENCES.ROOT]: {
                    path: ROUTES_1.default.SETTINGS_PREFERENCES,
                    // exact: true,
                },
                [SCREENS_1.default.SETTINGS.SUBSCRIPTION.ROOT]: ROUTES_1.default.SETTINGS_SUBSCRIPTION.route,
            },
        },
        [NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR]: {
            // The path given as initialRouteName does not have route params.
            // initialRouteName is not defined in this split navigator because in this case the initial route requires a policyID defined in its route params.
            screens: {
                [SCREENS_1.default.WORKSPACE.INITIAL]: {
                    path: ROUTES_1.default.WORKSPACE_INITIAL.route,
                },
                [SCREENS_1.default.WORKSPACE.PROFILE]: ROUTES_1.default.WORKSPACE_OVERVIEW.route,
                [SCREENS_1.default.WORKSPACE.EXPENSIFY_CARD]: {
                    path: ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.route,
                },
                [SCREENS_1.default.WORKSPACE.COMPANY_CARDS]: {
                    path: ROUTES_1.default.WORKSPACE_COMPANY_CARDS.route,
                },
                [SCREENS_1.default.WORKSPACE.PER_DIEM]: {
                    path: ROUTES_1.default.WORKSPACE_PER_DIEM.route,
                },
                [SCREENS_1.default.WORKSPACE.RECEIPT_PARTNERS]: {
                    path: ROUTES_1.default.WORKSPACE_RECEIPT_PARTNERS.route,
                },
                [SCREENS_1.default.WORKSPACE.WORKFLOWS]: {
                    path: ROUTES_1.default.WORKSPACE_WORKFLOWS.route,
                },
                [SCREENS_1.default.WORKSPACE.INVOICES]: {
                    path: ROUTES_1.default.WORKSPACE_INVOICES.route,
                },
                [SCREENS_1.default.WORKSPACE.MEMBERS]: {
                    path: ROUTES_1.default.WORKSPACE_MEMBERS.route,
                },
                [SCREENS_1.default.WORKSPACE.ACCOUNTING.ROOT]: {
                    path: ROUTES_1.default.POLICY_ACCOUNTING.route,
                },
                [SCREENS_1.default.WORKSPACE.CATEGORIES]: {
                    path: ROUTES_1.default.WORKSPACE_CATEGORIES.route,
                },
                [SCREENS_1.default.WORKSPACE.MORE_FEATURES]: {
                    path: ROUTES_1.default.WORKSPACE_MORE_FEATURES.route,
                },
                [SCREENS_1.default.WORKSPACE.TAGS]: {
                    path: ROUTES_1.default.WORKSPACE_TAGS.route,
                },
                [SCREENS_1.default.WORKSPACE.TAXES]: {
                    path: ROUTES_1.default.WORKSPACE_TAXES.route,
                },
                [SCREENS_1.default.WORKSPACE.REPORTS]: {
                    path: ROUTES_1.default.WORKSPACE_REPORTS.route,
                },
                [SCREENS_1.default.WORKSPACE.DISTANCE_RATES]: {
                    path: ROUTES_1.default.WORKSPACE_DISTANCE_RATES.route,
                },
                [SCREENS_1.default.WORKSPACE.RULES]: {
                    path: ROUTES_1.default.WORKSPACE_RULES.route,
                },
            },
        },
        [NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.SEARCH.ROOT]: {
                    path: ROUTES_1.default.SEARCH_ROOT.route,
                },
                [SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT]: {
                    path: ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.route,
                },
            },
        },
        [NAVIGATORS_1.default.SHARE_MODAL_NAVIGATOR]: {
            initialRouteName: SCREENS_1.default.SHARE.ROOT,
            screens: {
                [SCREENS_1.default.SHARE.ROOT]: {
                    path: ROUTES_1.default.SHARE_ROOT,
                    screens: {
                        [CONST_1.default.TAB.SHARE.SHARE]: {
                            path: ROUTES_1.default.SHARE_ROOT_SHARE,
                            exact: true,
                        },
                        [CONST_1.default.TAB.SHARE.SUBMIT]: {
                            path: ROUTES_1.default.SHARE_ROOT_SUBMIT,
                            exact: true,
                        },
                    },
                },
                [SCREENS_1.default.SHARE.SHARE_DETAILS]: { path: ROUTES_1.default.SHARE_DETAILS.route },
                [SCREENS_1.default.SHARE.SUBMIT_DETAILS]: { path: ROUTES_1.default.SHARE_SUBMIT_DETAILS.route },
            },
        },
        [NAVIGATORS_1.default.TEST_TOOLS_MODAL_NAVIGATOR]: {
            screens: {
                [SCREENS_1.default.TEST_TOOLS_MODAL.ROOT]: {
                    path: ROUTES_1.default.TEST_TOOLS_MODAL.route,
                    exact: true,
                },
            },
        },
    },
};
exports.config = config;
const normalizedConfigs = Object.keys(config.screens)
    .map((key) => (0, createNormalizedConfigs_1.default)(key, config.screens, [], config.initialRouteName
    ? [
        {
            initialRouteName: config.initialRouteName,
            parentScreens: [],
        },
    ]
    : [], []))
    .flat()
    .reduce((acc, route) => {
    acc[route.screen] = route;
    return acc;
}, {});
exports.normalizedConfigs = normalizedConfigs;
