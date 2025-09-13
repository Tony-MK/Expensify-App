"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
var react_native_1 = require("react-native");
var react_native_config_1 = require("react-native-config");
var CONST_1 = require("./CONST");
var getPlatform_1 = require("./libs/getPlatform");
var UrlUtils_1 = require("./libs/UrlUtils");
// react-native-config doesn't trim whitespace on iOS for some reason so we
// add a trim() call to prevent headaches
var get = function (config, key, defaultValue) { var _a; return ((_a = config === null || config === void 0 ? void 0 : config[key]) !== null && _a !== void 0 ? _a : defaultValue).trim(); };
var getDefaultLegacyPartnerConfig = function () {
    // eslint-disable-next-line no-restricted-properties
    if (!react_native_hybrid_app_1.default.isHybridApp()) {
        return { name: '', password: '' };
    }
    if (react_native_1.Platform.OS === 'ios') {
        return {
            name: 'iphone',
            password: 'e88ed31140a66c73b36a',
        };
    }
    // Android partner config
    return {
        name: 'android',
        password: 'c3a9ac418ea3f152aae2',
    };
};
// Set default values to contributor friendly values to make development work out of the box without an .env file
var ENVIRONMENT = get(react_native_config_1.default, 'ENVIRONMENT', CONST_1.default.ENVIRONMENT.DEV);
var newExpensifyURL = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'NEW_EXPENSIFY_URL', 'https://new.expensify.com/'));
var expensifyURL = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'EXPENSIFY_URL', 'https://www.expensify.com/'));
var stagingExpensifyURL = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'STAGING_EXPENSIFY_URL', 'https://staging.expensify.com/'));
var stagingSecureExpensifyUrl = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'STAGING_SECURE_EXPENSIFY_URL', 'https://staging-secure.expensify.com/'));
var ngrokURL = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'NGROK_URL', ''));
var secureNgrokURL = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'SECURE_NGROK_URL', ''));
var secureExpensifyUrl = (0, UrlUtils_1.default)(get(react_native_config_1.default, 'SECURE_EXPENSIFY_URL', 'https://secure.expensify.com/'));
var useNgrok = get(react_native_config_1.default, 'USE_NGROK', 'false') === 'true';
var useWebProxy = get(react_native_config_1.default, 'USE_WEB_PROXY', 'true') === 'true';
var expensifyComWithProxy = (0, getPlatform_1.default)() === 'web' && useWebProxy ? '/' : expensifyURL;
var googleGeolocationAPIKey = get(react_native_config_1.default, 'GCP_GEOLOCATION_API_KEY', '');
// Throw errors on dev if config variables are not set correctly
if (ENVIRONMENT === CONST_1.default.ENVIRONMENT.DEV) {
    if (!useNgrok && expensifyURL.includes('dev') && !secureExpensifyUrl.includes('dev')) {
        throw new Error('SECURE_EXPENSIFY_URL must end with .dev when EXPENSIFY_URL ends with .dev');
    }
    if (useNgrok && !secureNgrokURL) {
        throw new Error('SECURE_NGROK_URL must be defined in .env when USE_NGROK=true');
    }
}
var secureURLRoot = useNgrok && secureNgrokURL ? secureNgrokURL : secureExpensifyUrl;
// Ngrok helps us avoid many of our cross-domain issues with connecting to our API
// and is required for viewing images on mobile and for developing on android
// To enable, set the USE_NGROK value to true in .env and update the NGROK_URL
var expensifyURLRoot = useNgrok && ngrokURL ? ngrokURL : expensifyComWithProxy;
exports.default = {
    APP_NAME: 'NewExpensify',
    AUTH_TOKEN_EXPIRATION_TIME: 1000 * 60 * 90,
    ENVIRONMENT: ENVIRONMENT,
    EXPENSIFY: {
        // Note: This will be EXACTLY what is set for EXPENSIFY_URL whether the proxy is enabled or not.
        EXPENSIFY_URL: expensifyURL,
        SECURE_EXPENSIFY_URL: secureExpensifyUrl,
        NEW_EXPENSIFY_URL: newExpensifyURL,
        // The DEFAULT API is the API used by most environments, except staging, where we use STAGING (defined below)
        // The "staging toggle" in settings toggles between DEFAULT and STAGING APIs
        // On both STAGING and PROD this (DEFAULT) address points to production
        // On DEV it can be configured through ENV settings and can be a proxy or ngrok address (defaults to PROD)
        // Usually you don't need to use this URL directly - prefer `ApiUtils.getApiRoot()`
        DEFAULT_API_ROOT: expensifyURLRoot,
        DEFAULT_SECURE_API_ROOT: secureURLRoot,
        STAGING_API_ROOT: stagingExpensifyURL,
        STAGING_SECURE_API_ROOT: stagingSecureExpensifyUrl,
        LEGACY_PARTNER_NAME: get(react_native_config_1.default, 'LEGACY_EXPENSIFY_PARTNER_NAME', getDefaultLegacyPartnerConfig().name),
        LEGACY_PARTNER_PASSWORD: get(react_native_config_1.default, 'LEGACY_EXPENSIFY_PARTNER_PASSWORD', getDefaultLegacyPartnerConfig().password),
        PARTNER_NAME: get(react_native_config_1.default, 'EXPENSIFY_PARTNER_NAME', 'chat-expensify-com'),
        PARTNER_PASSWORD: get(react_native_config_1.default, 'EXPENSIFY_PARTNER_PASSWORD', 'e21965746fd75f82bb66'),
        EXPENSIFY_CASH_REFERER: 'ecash',
        CONCIERGE_URL_PATHNAME: 'concierge/',
        DEVPORTAL_URL_PATHNAME: '_devportal/',
        CONCIERGE_URL: "".concat(expensifyURL, "concierge/"),
        SAML_URL: "".concat(expensifyURL, "authentication/saml/login"),
    },
    IS_IN_PRODUCTION: react_native_1.Platform.OS === 'web' ? process.env.NODE_ENV === 'production' : !__DEV__,
    IS_IN_STAGING: ENVIRONMENT === CONST_1.default.ENVIRONMENT.STAGING,
    IS_USING_LOCAL_WEB: useNgrok || expensifyURLRoot.includes('dev'),
    PUSHER: {
        APP_KEY: get(react_native_config_1.default, 'PUSHER_APP_KEY', '268df511a204fbb60884'),
        SUFFIX: ENVIRONMENT === CONST_1.default.ENVIRONMENT.DEV ? get(react_native_config_1.default, 'PUSHER_DEV_SUFFIX', '') : '',
        CLUSTER: 'mt1',
    },
    SITE_TITLE: 'New Expensify',
    FAVICON: {
        DEFAULT: '/favicon.png',
        UNREAD: '/favicon-unread.png',
    },
    CAPTURE_METRICS: get(react_native_config_1.default, 'CAPTURE_METRICS', 'false') === 'true',
    ONYX_METRICS: get(react_native_config_1.default, 'ONYX_METRICS', 'false') === 'true',
    DEV_PORT: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8082,
    E2E_TESTING: get(react_native_config_1.default, 'E2E_TESTING', 'false') === 'true',
    SEND_CRASH_REPORTS: get(react_native_config_1.default, 'SEND_CRASH_REPORTS', 'false') === 'true',
    IS_USING_WEB_PROXY: (0, getPlatform_1.default)() === 'web' && useWebProxy,
    APPLE_SIGN_IN: {
        SERVICE_ID: 'com.chat.expensify.chat.AppleSignIn',
        REDIRECT_URI: "".concat(newExpensifyURL, "appleauth"),
    },
    GOOGLE_SIGN_IN: {
        // cspell:disable-next-line
        WEB_CLIENT_ID: '921154746561-gpsoaqgqfuqrfsjdf8l7vohfkfj7b9up.apps.googleusercontent.com',
        // cspell:disable-next-line
        IOS_CLIENT_ID: '921154746561-s3uqn2oe4m85tufi6mqflbfbuajrm2i3.apps.googleusercontent.com',
        HYBRID_APP: {
            // cspell:disable-next-line
            IOS_CLIENT_ID: '1008697809946-sh04nqq0hea396s1qdqqbj6ia649odb2.apps.googleusercontent.com',
            WEB_CLIENT_ID: {
                // cspell:disable-next-line
                IOS: '1008697809946-5e095eqem3o6ugtpc2rjf7v880tcp28p.apps.googleusercontent.com',
                // cspell:disable-next-line
                ANDROID: '240677659774-86pov3adub93cv4b8uj13g7varolmk2l.apps.googleusercontent.com',
            },
        },
    },
    GCP_GEOLOCATION_API_KEY: googleGeolocationAPIKey,
    FIREBASE_WEB_CONFIG: {
        apiKey: get(react_native_config_1.default, 'FB_API_KEY', 'AIzaSyBrLKgCuo6Vem6Xi5RPokdumssW8HaWBow'),
        appId: get(react_native_config_1.default, 'FB_APP_ID', '1:1008697809946:web:ca25268d2645fc285445a3'),
        projectId: get(react_native_config_1.default, 'FB_PROJECT_ID', 'expensify-mobile-app'),
    },
    // to read more about StrictMode see: contributingGuides/STRICT_MODE.md
    USE_REACT_STRICT_MODE_IN_DEV: false,
    ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
    IS_TEST_ENV: process.env.NODE_ENV === 'test',
    // eslint-disable-next-line no-restricted-properties
    IS_HYBRID_APP: react_native_hybrid_app_1.default.isHybridApp(),
};
