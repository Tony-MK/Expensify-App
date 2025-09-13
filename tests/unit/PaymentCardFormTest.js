"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const PaymentCard_1 = require("@pages/settings/Subscription/PaymentCard");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
}));
jest.mock('@libs/ReportUtils', () => ({
    UnreadIndicatorUpdaterHelper: jest.fn(),
    getReportIDFromLink: jest.fn(() => ''),
    parseReportRouteParams: jest.fn(() => ({ reportID: '' })),
}));
jest.mock('@pages/settings/Subscription/PaymentCard', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return jest.requireActual('@pages/settings/Subscription/PaymentCard/index.tsx');
});
beforeAll(() => {
    react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
});
afterAll(() => {
    jest.clearAllMocks();
});
describe('Subscription/AddPaymentCard', () => {
    const Stack = (0, stack_1.createStackNavigator)();
    const renderAddPaymentCardPage = (initialRouteName) => {
        return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
                <portal_1.PortalProvider>
                    <native_1.NavigationContainer>
                        <Stack.Navigator initialRouteName={initialRouteName}>
                            <Stack.Screen name={SCREENS_1.default.SETTINGS.SUBSCRIPTION.ADD_PAYMENT_CARD} component={PaymentCard_1.default}/>
                        </Stack.Navigator>
                    </native_1.NavigationContainer>
                </portal_1.PortalProvider>
            </ComposeProviders_1.default>);
    };
    describe('AddPaymentCardPage Expiration Date Formatting', () => {
        const runFormatTest = async (input, formattedAs) => {
            renderAddPaymentCardPage(SCREENS_1.default.SETTINGS.SUBSCRIPTION.ADD_PAYMENT_CARD);
            const expirationDateField = await react_native_1.screen.findByTestId('addPaymentCardPage.expiration');
            react_native_1.fireEvent.changeText(expirationDateField, input);
            expect(expirationDateField.props.value).toBe(formattedAs);
        };
        it('formats "0" as "0"', async () => {
            await runFormatTest('0', '0');
        });
        it('formats "2" as "02/"', async () => {
            await runFormatTest('2', '02/');
        });
        it('formats "11" as "11/"', async () => {
            await runFormatTest('11', '11/');
        });
        it('formats "13" as "01/3"', async () => {
            await runFormatTest('13', '01/3');
        });
        it('formats "20" as "02/0"', async () => {
            await runFormatTest('20', '02/0');
        });
        it('formats "45" as "04/5"', async () => {
            await runFormatTest('45', '04/5');
        });
        it('formats "98" as "09/8"', async () => {
            await runFormatTest('98', '09/8');
        });
        it('formats "123" as "12/3"', async () => {
            await runFormatTest('123', '12/3');
        });
        it('formats "567" as "05/67"', async () => {
            await runFormatTest('567', '05/67');
        });
        it('formats "00" as "0"', async () => {
            await runFormatTest('00', '0');
        });
        it('formats "11111" as "11/11"', async () => {
            await runFormatTest('11111', '11/11');
        });
        it('formats "99/99" as "09/99"', async () => {
            await runFormatTest('99/99', '09/99');
        });
        it('formats "0825" as "08/25"', async () => {
            await runFormatTest('0825', '08/25');
        });
        it('formats "12255" as "12/25"', async () => {
            await runFormatTest('12255', '12/25');
        });
    });
});
