"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const createPlatformStackNavigator_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigator");
const index_website_1 = require("@pages/ValidateLoginPage/index.website");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const RootStack = (0, createPlatformStackNavigator_1.default)();
const renderPage = (initialParams) => {
    return (0, react_native_1.render)(<native_1.NavigationContainer>
            <RootStack.Navigator>
                <RootStack.Screen name={SCREENS_1.default.VALIDATE_LOGIN} component={index_website_1.default} initialParams={initialParams}/>
            </RootStack.Navigator>
        </native_1.NavigationContainer>);
};
describe('ValidateLoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
    });
    it('Should show not found view when the magic code is invalid and there is an exitTo param', async () => {
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
            autoAuthState: CONST_1.default.AUTO_AUTH_STATE.NOT_STARTED,
        });
        renderPage({ accountID: '1', validateCode: 'ABCDEF', exitTo: 'concierge' });
        expect(react_native_1.screen.getByTestId('validate-code-not-found')).not.toBeNull();
    });
    it('Should not show ValidateCodeModal when signed in and there is an exitTo param', async () => {
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, {
            authToken: 'abcd',
            autoAuthState: CONST_1.default.AUTO_AUTH_STATE.NOT_STARTED,
        });
        renderPage({ accountID: '1', validateCode: '123456', exitTo: 'concierge' });
        expect(react_native_1.screen.queryByTestId('validate-code')).toBeNull();
    });
});
