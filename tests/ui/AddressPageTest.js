"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const PersonalAddressPage_1 = require("@pages/settings/Profile/PersonalDetails/PersonalAddressPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
jest.mock('@rnmapbox/maps', () => {
    return {
        default: jest.fn(),
        MarkerView: jest.fn(),
        setAccessToken: jest.fn(),
    };
});
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
}));
const Stack = (0, createPlatformStackNavigator_1.default)();
const renderPage = (initialRouteName) => {
    return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <portal_1.PortalProvider>
                <native_1.NavigationContainer ref={Navigation_1.navigationRef}>
                    <Stack.Navigator initialRouteName={initialRouteName}>
                        <Stack.Screen name={SCREENS_1.default.SETTINGS.PROFILE.ADDRESS} component={PersonalAddressPage_1.default}/>
                    </Stack.Navigator>
                </native_1.NavigationContainer>
            </portal_1.PortalProvider>
        </ComposeProviders_1.default>);
};
describe('AddressPageTest', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, CONST_1.default.LOCALES.EN);
    });
    it('should not reset state', async () => {
        await TestHelper.signInWithTestUser();
        await (0, react_native_1.act)(async () => {
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS}`, {
                addresses: [
                    {
                        state: 'Test',
                        country: 'VN',
                        street: 'Test',
                    },
                ],
            });
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.IS_LOADING_APP}`, false);
        });
        renderPage(SCREENS_1.default.SETTINGS.PROFILE.ADDRESS);
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        const state = react_native_1.screen.getAllByLabelText('State / Province');
        expect(state.at(1)?.props.value).toEqual('Test');
        Navigation_1.default.setParams({
            country: 'VN',
        });
        await (0, waitForBatchedUpdatesWithAct_1.default)();
        expect(state?.at(1)?.props.value).toEqual('Test');
    });
});
