"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ApiUtils_1 = require("@libs/ApiUtils");
const Network_1 = require("@userActions/Network");
const Session_1 = require("@userActions/Session");
const User_1 = require("@userActions/User");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Button_1 = require("./Button");
const SoftKillTestToolRow_1 = require("./SoftKillTestToolRow");
const Switch_1 = require("./Switch");
const TestCrash_1 = require("./TestCrash");
const TestToolRow_1 = require("./TestToolRow");
const Text_1 = require("./Text");
const ACCOUNT_DEFAULT = {
    isSubscribedToNewsletter: false,
    validated: false,
    isFromPublicDomain: false,
    isUsingExpensifyCard: false,
};
function TestToolMenu() {
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [network] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NETWORK, { canBeMissing: true });
    const [account = ACCOUNT_DEFAULT] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [isUsingImportedState] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_USING_IMPORTED_STATE, { canBeMissing: true });
    const [shouldUseStagingServer = (0, ApiUtils_1.isUsingStagingApi)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER, { canBeMissing: true });
    const [isDebugModeEnabled = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true });
    const shouldBlockTransactionThreadReportCreation = !!account?.shouldBlockTransactionThreadReportCreation;
    const shouldShowTransactionThreadReportToggle = isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // Check if the user is authenticated to show options that require authentication
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    return (<>
            <Text_1.default style={[styles.textLabelSupporting, styles.mb4]} numberOfLines={1}>
                {translate('initialSettingsPage.troubleshoot.testingPreferences')}
            </Text_1.default>
            {isAuthenticated && (<>
                    {/* When toggled, the app won't create the transaction thread report. It should be removed together with CONST.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS beta */}
                    {shouldShowTransactionThreadReportToggle && (<TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.shouldBlockTransactionThreadReportCreation')}>
                            <Switch_1.default accessibilityLabel={translate('initialSettingsPage.troubleshoot.shouldBlockTransactionThreadReportCreation')} isOn={shouldBlockTransactionThreadReportCreation} onToggle={() => (0, User_1.setShouldBlockTransactionThreadReportCreation)(!shouldBlockTransactionThreadReportCreation)}/>
                        </TestToolRow_1.default>)}

                    {/* When toggled the app will be put into debug mode. */}
                    <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.debugMode')}>
                        <Switch_1.default accessibilityLabel={translate('initialSettingsPage.troubleshoot.debugMode')} isOn={isDebugModeEnabled} onToggle={() => (0, User_1.setIsDebugModeEnabled)(!isDebugModeEnabled)}/>
                    </TestToolRow_1.default>

                    {/* Instantly invalidates a user's local authToken. Useful for testing flows related to reauthentication. */}
                    <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.authenticationStatus')}>
                        <Button_1.default small text={translate('initialSettingsPage.troubleshoot.invalidate')} onPress={() => (0, Session_1.invalidateAuthToken)()}/>
                    </TestToolRow_1.default>

                    {/* Invalidate stored user auto-generated credentials. Useful for manually testing sign out logic. */}
                    <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.deviceCredentials')}>
                        <Button_1.default small text={translate('initialSettingsPage.troubleshoot.destroy')} onPress={() => (0, Session_1.invalidateCredentials)()}/>
                    </TestToolRow_1.default>

                    {/* Sends an expired session to the FE and invalidates the session by the same time in the BE. Action is delayed for 15s */}
                    <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.authenticationStatus')}>
                        <Button_1.default small text={translate('initialSettingsPage.troubleshoot.invalidateWithDelay')} onPress={() => (0, Session_1.expireSessionWithDelay)()}/>
                    </TestToolRow_1.default>
                </>)}

            {/* Option to switch between staging and default api endpoints.
    This enables QA, internal testers and external devs to take advantage of sandbox environments for 3rd party services like Plaid and Onfido.
    This toggle is not rendered for internal devs as they make environment changes directly to the .env file. */}
            {!CONFIG_1.default.IS_USING_LOCAL_WEB && (<TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.useStagingServer')}>
                    <Switch_1.default accessibilityLabel="Use Staging Server" isOn={shouldUseStagingServer} onToggle={() => (0, User_1.setShouldUseStagingServer)(!shouldUseStagingServer)}/>
                </TestToolRow_1.default>)}

            {/* When toggled the app will be forced offline. */}
            <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.forceOffline')}>
                <Switch_1.default accessibilityLabel="Force offline" isOn={!!network?.shouldForceOffline} onToggle={() => (0, Network_1.setShouldForceOffline)(!network?.shouldForceOffline)} disabled={!!isUsingImportedState || !!network?.shouldSimulatePoorConnection || network?.shouldFailAllRequests}/>
            </TestToolRow_1.default>

            {/* When toggled the app will randomly change internet connection every 2-5 seconds */}
            <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.simulatePoorConnection')}>
                <Switch_1.default accessibilityLabel="Simulate poor internet connection" isOn={!!network?.shouldSimulatePoorConnection} onToggle={() => (0, Network_1.setShouldSimulatePoorConnection)(!network?.shouldSimulatePoorConnection, network?.poorConnectionTimeoutID)} disabled={!!isUsingImportedState || !!network?.shouldFailAllRequests || network?.shouldForceOffline}/>
            </TestToolRow_1.default>

            {/* When toggled all network requests will fail. */}
            <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.simulateFailingNetworkRequests')}>
                <Switch_1.default accessibilityLabel="Simulate failing network requests" isOn={!!network?.shouldFailAllRequests} onToggle={() => (0, Network_1.setShouldFailAllRequests)(!network?.shouldFailAllRequests)} disabled={!!network?.shouldForceOffline || network?.shouldSimulatePoorConnection}/>
            </TestToolRow_1.default>
            <SoftKillTestToolRow_1.default />
            <TestCrash_1.default />
        </>);
}
TestToolMenu.displayName = 'TestToolMenu';
exports.default = TestToolMenu;
