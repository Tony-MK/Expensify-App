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
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const DebugUtils_1 = require("@libs/DebugUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const Debug_1 = require("@userActions/Debug");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const getInitialTransactionViolation = () => DebugUtils_1.default.stringifyJSON({
    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
    name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
    data: {
        rejectedBy: undefined,
        rejectReason: undefined,
        formattedLimit: undefined,
        surcharge: undefined,
        invoiceMarkup: undefined,
        maxAge: undefined,
        tagName: undefined,
        category: undefined,
        brokenBankConnection: undefined,
        isAdmin: undefined,
        email: undefined,
        isTransactionOlderThan7Days: false,
        member: undefined,
        taxName: undefined,
        tagListIndex: undefined,
        tagListName: undefined,
        errorIndexes: [],
        pendingPattern: undefined,
        type: undefined,
        displayPercentVariance: undefined,
        duplicates: [],
        rterType: undefined,
        comment: undefined,
    },
});
function DebugTransactionViolationCreatePage({ route: { params: { transactionID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const transactionViolations = (0, useTransactionViolations_1.default)(transactionID);
    const [draftTransactionViolation, setDraftTransactionViolation] = (0, react_1.useState)(() => getInitialTransactionViolation());
    const [error, setError] = (0, react_1.useState)();
    const editJSON = (0, react_1.useCallback)((updatedJSON) => {
        try {
            DebugUtils_1.default.validateTransactionViolationJSON(updatedJSON);
            setError('');
        }
        catch (e) {
            const { cause, message } = e;
            setError(cause ? translate(message, cause) : message);
        }
        finally {
            setDraftTransactionViolation(updatedJSON);
        }
    }, [translate]);
    const createTransactionViolation = (0, react_1.useCallback)(() => {
        const parsedTransactionViolation = DebugUtils_1.default.stringToOnyxData(draftTransactionViolation, 'object');
        Debug_1.default.setDebugData(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`, [...(transactionViolations ?? []), parsedTransactionViolation]);
        Navigation_1.default.navigate(ROUTES_1.default.DEBUG_TRANSACTION_TAB_VIOLATIONS.getRoute(transactionID));
    }, [draftTransactionViolation, transactionID, transactionViolations]);
    if (!transactionID) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnableKeyboardAvoidingView={false} shouldEnableMinHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={DebugTransactionViolationCreatePage.displayName}>
            {({ safeAreaPaddingBottomStyle }) => (<react_native_1.View style={[styles.flex1, safeAreaPaddingBottomStyle]}>
                    <HeaderWithBackButton_1.default title={`${translate('debug.debug')} - ${translate('debug.createTransactionViolation')}`} onBackButtonPress={Navigation_1.default.goBack}/>
                    <ScrollView_1.default contentContainerStyle={[styles.ph5, styles.pb5, styles.gap5]}>
                        <react_native_1.View>
                            <Text_1.default style={[styles.textLabelSupporting, styles.mb2]}>{translate('debug.editJson')}</Text_1.default>
                            <TextInput_1.default errorText={error} accessibilityLabel={translate('debug.editJson')} forceActiveLabel numberOfLines={18} multiline value={draftTransactionViolation} onChangeText={editJSON} 
        // We need to explicitly add styles.pt5 and styles.pb5 to override the default top and bottom padding of the text input
        textInputContainerStyles={[styles.border, styles.borderBottom, styles.ph5, styles.pt5, styles.pb5]}/>
                        </react_native_1.View>
                        <Text_1.default style={[styles.headerText, styles.textAlignCenter]}>{translate('debug.hint')}</Text_1.default>
                        <Button_1.default success text={translate('common.save')} isDisabled={!draftTransactionViolation || !!error} onPress={createTransactionViolation}/>
                    </ScrollView_1.default>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
DebugTransactionViolationCreatePage.displayName = 'DebugTransactionViolationCreatePage';
exports.default = DebugTransactionViolationCreatePage;
