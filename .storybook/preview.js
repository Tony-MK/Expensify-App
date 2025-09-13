"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameters = exports.decorators = void 0;
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const ComposeProviders_1 = require("@src/components/ComposeProviders");
const HTMLEngineProvider_1 = require("@src/components/HTMLEngineProvider");
const LocaleContextProvider_1 = require("@src/components/LocaleContextProvider");
const withEnvironment_1 = require("@src/components/withEnvironment");
const withKeyboardState_1 = require("@src/components/withKeyboardState");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
require("./fonts.css");
react_native_onyx_1.default.init({
    keys: ONYXKEYS_1.default,
    initialKeyStates: {
        [ONYXKEYS_1.default.NETWORK]: { isOffline: false },
    },
});
IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
const decorators = [
    (Story) => (<ComposeProviders_1.default components={[
            OnyxListItemProvider_1.default,
            LocaleContextProvider_1.LocaleContextProvider,
            HTMLEngineProvider_1.default,
            react_native_safe_area_context_1.SafeAreaProvider,
            portal_1.PortalProvider,
            withEnvironment_1.EnvironmentProvider,
            withKeyboardState_1.KeyboardStateProvider,
            SearchContext_1.SearchContextProvider,
        ]}>
            <Story />
        </ComposeProviders_1.default>),
];
exports.decorators = decorators;
const parameters = {
    controls: {
        matchers: {
            color: /(background|color)$/i,
        },
    },
};
exports.parameters = parameters;
