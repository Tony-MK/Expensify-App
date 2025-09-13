"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Member_1 = require("@libs/actions/Policy/Member");
const WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceOwnerChangeCheck({ policy, accountID, error }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [displayTexts, setDisplayTexts] = (0, react_1.useState)({
        title: '',
        text: '',
        buttonText: '',
    });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const policyID = policy?.id;
    const updateDisplayTexts = (0, react_1.useCallback)(() => {
        const changeOwnerErrors = Object.keys(policy?.errorFields?.changeOwner ?? {});
        if (error !== changeOwnerErrors.at(0)) {
            return;
        }
        const texts = (0, WorkspacesSettingsUtils_1.getOwnershipChecksDisplayText)(error, translate, policy, personalDetails?.[accountID]?.login);
        setDisplayTexts(texts);
    }, [accountID, error, personalDetails, policy, translate]);
    (0, react_1.useEffect)(() => {
        updateDisplayTexts();
    }, [updateDisplayTexts]);
    const confirm = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        if (error === CONST_1.default.POLICY.OWNERSHIP_ERRORS.HAS_FAILED_SETTLEMENTS || error === CONST_1.default.POLICY.OWNERSHIP_ERRORS.FAILED_TO_CLEAR_BALANCE) {
            // cannot transfer ownership if there are failed settlements, or we cannot clear the balance
            (0, Member_1.clearWorkspaceOwnerChangeFlow)(policyID);
            Navigation_1.default.goBack();
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBER_DETAILS.getRoute(policyID, accountID));
            return;
        }
        (0, Member_1.requestWorkspaceOwnerChange)(policyID);
    }, [accountID, error, policyID]);
    return (<>
            <Text_1.default style={[styles.textHeadline, styles.mt3, styles.mb2]}>{displayTexts.title}</Text_1.default>
            <Text_1.default style={styles.flex1}>{displayTexts.text}</Text_1.default>
            <react_native_1.View style={styles.pb5}>
                <Button_1.default success large onPress={confirm} text={displayTexts.buttonText}/>
            </react_native_1.View>
        </>);
}
WorkspaceOwnerChangeCheck.displayName = 'WorkspaceOwnerChangeCheckPage';
exports.default = WorkspaceOwnerChangeCheck;
