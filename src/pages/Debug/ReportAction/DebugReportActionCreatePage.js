"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const DebugUtils_1 = require("@libs/DebugUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NumberUtils_1 = require("@libs/NumberUtils");
const ReportActionItem_1 = require("@pages/home/report/ReportActionItem");
const Debug_1 = require("@userActions/Debug");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const getInitialReportAction = (reportID, session, personalDetailsList) => DebugUtils_1.default.stringifyJSON({
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
    reportID,
    reportActionID: (0, NumberUtils_1.rand64)(),
    created: DateUtils_1.default.getDBTime(),
    actorAccountID: session?.accountID,
    avatar: (session?.accountID && personalDetailsList?.[session.accountID]?.avatar) ?? '',
    message: [{ type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT, html: 'Hello world!', text: 'Hello world!' }],
});
function DebugReportActionCreatePage({ route: { params: { reportID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [personalDetailsList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [userWalletTierName] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: (wallet) => wallet?.tierName, canBeMissing: false });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [draftReportAction, setDraftReportAction] = (0, react_1.useState)(() => getInitialReportAction(reportID, session, personalDetailsList));
    const [userBillingFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false });
    const isTryNewDotNVPDismissed = !!tryNewDot?.classicRedirect?.dismissed;
    const [error, setError] = (0, react_1.useState)();
    const createReportAction = (0, react_1.useCallback)(() => {
        const parsedReportAction = JSON.parse(draftReportAction.replaceAll('\n', ''));
        Debug_1.default.mergeDebugData(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
            [parsedReportAction.reportActionID]: parsedReportAction,
        });
        Navigation_1.default.navigate(ROUTES_1.default.DEBUG_REPORT_TAB_ACTIONS.getRoute(reportID));
    }, [draftReportAction, reportID]);
    const editJSON = (0, react_1.useCallback)((updatedJSON) => {
        try {
            DebugUtils_1.default.validateReportActionJSON(updatedJSON);
            setError('');
        }
        catch (e) {
            const { cause, message } = e;
            setError(cause ? translate(message, cause) : message);
        }
        finally {
            setDraftReportAction(updatedJSON);
        }
    }, [translate]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DebugReportActionCreatePage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                    <HeaderWithBackButton_1.default title={`${translate('debug.debug')} - ${translate('debug.createReportAction')}`} onBackButtonPress={Navigation_1.default.goBack}/>
                    <ScrollView_1.default contentContainerStyle={[styles.ph5, styles.pb5, styles.gap5]}>
                        <react_native_1.View>
                            <Text_1.default style={[styles.textLabelSupporting, styles.mb2]}>{translate('debug.editJson')}</Text_1.default>
                            <TextInput_1.default errorText={error} accessibilityLabel={translate('debug.editJson')} forceActiveLabel numberOfLines={18} multiline value={draftReportAction} onChangeText={editJSON} 
        // We need to explicitly add styles.pt5 and styles.pb5 to override the default top and bottom padding of the text input
        textInputContainerStyles={[styles.border, styles.borderBottom, styles.ph5, styles.pt5, styles.pb5]}/>
                        </react_native_1.View>
                        <react_native_1.View>
                            <Text_1.default style={[styles.textLabelSupporting, styles.mb2]}>{translate('debug.preview')}</Text_1.default>
                            {!error ? (<ReportActionItem_1.default allReports={allReports} policies={policies} action={JSON.parse(draftReportAction.replaceAll('\n', ''))} report={{ reportID }} reportActions={[]} parentReportAction={undefined} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={0} isFirstVisibleReportAction={false} shouldDisplayContextMenu={false} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetailsList} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>) : (<Text_1.default>{translate('debug.nothingToPreview')}</Text_1.default>)}
                        </react_native_1.View>
                        <Text_1.default style={[styles.headerText, styles.textAlignCenter]}>{translate('debug.hint')}</Text_1.default>
                        <Button_1.default success text={translate('common.save')} isDisabled={!draftReportAction || !!error} onPress={createReportAction}/>
                    </ScrollView_1.default>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
DebugReportActionCreatePage.displayName = 'DebugReportActionCreatePage';
exports.default = DebugReportActionCreatePage;
