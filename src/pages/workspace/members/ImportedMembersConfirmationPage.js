"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var ConfirmModal_1 = require("@components/ConfirmModal");
var FixedFooter_1 = require("@components/FixedFooter");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
var ReportActionAvatars_1 = require("@components/ReportActionAvatars");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var Text_1 = require("@components/Text");
var useCloseImportPage_1 = require("@hooks/useCloseImportPage");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Link_1 = require("@libs/actions/Link");
var Member_1 = require("@libs/actions/Policy/Member");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
var WorkspaceMemberRoleSelectionModal_1 = require("@pages/workspace/WorkspaceMemberRoleSelectionModal");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function ImportedMembersConfirmationPage(_a) {
    var _b, _c, _d, _e, _f;
    var route = _a.route;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var spreadsheet = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true })[0];
    var _g = (0, react_1.useState)(CONST_1.default.POLICY.ROLE.USER), role = _g[0], setRole = _g[1];
    var _h = (0, react_1.useState)(false), isRoleSelectionModalVisible = _h[0], setIsRoleSelectionModalVisible = _h[1];
    var policyID = route.params.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    var _j = (0, react_1.useState)(false), isImporting = _j[0], setIsImporting = _j[1];
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var setIsClosing = (0, useCloseImportPage_1.default)().setIsClosing;
    (0, react_1.useEffect)(function () {
        return function () {
            (0, Member_1.clearImportedSpreadsheetMemberData)();
        };
    }, []);
    var importedSpreadsheetMemberData = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET_MEMBER_DATA, { canBeMissing: true })[0];
    var newMembers = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = importedSpreadsheetMemberData === null || importedSpreadsheetMemberData === void 0 ? void 0 : importedSpreadsheetMemberData.filter(function (member) { return !(0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(member.email, policy) && !member.role; })) !== null && _a !== void 0 ? _a : [];
    }, [importedSpreadsheetMemberData, policy]);
    var invitedEmailsToAccountIDsDraft = (0, react_1.useMemo)(function () {
        var memberEmails = newMembers.map(function (member) { return member.email; });
        return memberEmails.reduce(function (acc, email) {
            var _a, _b;
            acc[email] = (_b = (_a = (0, PersonalDetailsUtils_1.getAccountIDsByLogins)([email])) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : 0;
            return acc;
        }, {});
        // getAccountIDsByLogins function uses the personalDetails data from the connection, so we need to re-run this logic when the personal detail is changed.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMembers, personalDetails]);
    /** Opens privacy url as an external link */
    var openPrivacyURL = function (event) {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        (0, Link_1.openExternalLink)(CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL);
    };
    var importMembers = (0, react_1.useCallback)(function () {
        if (!newMembers) {
            return;
        }
        setIsImporting(true);
        var membersWithRole = (importedSpreadsheetMemberData !== null && importedSpreadsheetMemberData !== void 0 ? importedSpreadsheetMemberData : []).map(function (member) { return (__assign(__assign({}, member), { role: member.role || role })); });
        (0, Member_1.importPolicyMembers)(policyID, membersWithRole);
    }, [importedSpreadsheetMemberData, newMembers, policyID, role]);
    var closeImportPageAndModal = function () {
        setIsClosing(true);
        setIsImporting(false);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(policyID));
    };
    var onRoleChange = function (item) {
        setRole(item.value);
        setIsRoleSelectionModalVisible(false);
    };
    var roleItems = [
        {
            value: CONST_1.default.POLICY.ROLE.ADMIN,
            text: translate('common.admin'),
            alternateText: translate('workspace.common.adminAlternateText'),
            isSelected: role === CONST_1.default.POLICY.ROLE.ADMIN,
            keyForList: CONST_1.default.POLICY.ROLE.ADMIN,
        },
        {
            value: CONST_1.default.POLICY.ROLE.AUDITOR,
            text: translate('common.auditor'),
            alternateText: translate('workspace.common.auditorAlternateText'),
            isSelected: role === CONST_1.default.POLICY.ROLE.AUDITOR,
            keyForList: CONST_1.default.POLICY.ROLE.AUDITOR,
        },
        {
            value: CONST_1.default.POLICY.ROLE.USER,
            text: translate('common.member'),
            alternateText: translate('workspace.common.memberAlternateText'),
            isSelected: role === CONST_1.default.POLICY.ROLE.USER,
            keyForList: CONST_1.default.POLICY.ROLE.USER,
        },
    ];
    if (!spreadsheet || !importedSpreadsheetMemberData) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default shouldEnableMaxHeight shouldUseCachedViewportHeight testID={ImportedMembersConfirmationPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.inviteMessage.confirmDetails')} subtitle={policy === null || policy === void 0 ? void 0 : policy.name} shouldShowBackButton onBackButtonPress={function () {
            Navigation_1.default.goBack();
        }}/>
            <react_native_1.View style={styles.ph5}>
                <react_native_1.View style={[styles.mv4, styles.justifyContentCenter, styles.alignItemsCenter]}>
                    <ReportActionAvatars_1.default size={CONST_1.default.AVATAR_SIZE.LARGE} accountIDs={Object.values(invitedEmailsToAccountIDsDraft !== null && invitedEmailsToAccountIDsDraft !== void 0 ? invitedEmailsToAccountIDsDraft : {})} horizontalStacking={{
            displayInRows: true,
        }} secondaryAvatarContainerStyle={[styles.secondAvatarInline]}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.mb5]}>
                    <Text_1.default>{translate('spreadsheet.importMemberConfirmation', { count: (_b = newMembers === null || newMembers === void 0 ? void 0 : newMembers.length) !== null && _b !== void 0 ? _b : 0 })}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mb3]}>
                    <react_native_1.View style={[styles.mhn5, styles.mb3]}>
                        <MenuItemWithTopDescription_1.default title={translate("workspace.common.roleName", { role: role })} description={translate('common.role')} shouldShowRightIcon onPress={function () {
            setIsRoleSelectionModalVisible(true);
        }}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
            <FixedFooter_1.default style={[styles.flex1, styles.justifyContentEnd]}>
                <Button_1.default text={translate('common.import')} onPress={importMembers} isLoading={isImporting} isDisabled={isOffline} pressOnEnter success large style={styles.mb3}/>
                <PressableWithoutFeedback_1.default onPress={openPrivacyURL} role={CONST_1.default.ROLE.LINK} accessibilityLabel={translate('common.privacy')} href={CONST_1.default.OLD_DOT_PUBLIC_URLS.PRIVACY_URL} style={[styles.mv2, styles.alignSelfStart]}>
                    <react_native_1.View style={[styles.flexRow]}>
                        <Text_1.default style={[styles.mr1, styles.label, styles.link]}>{translate('common.privacy')}</Text_1.default>
                    </react_native_1.View>
                </PressableWithoutFeedback_1.default>
            </FixedFooter_1.default>
            <ConfirmModal_1.default isVisible={spreadsheet === null || spreadsheet === void 0 ? void 0 : spreadsheet.shouldFinalModalBeOpened} title={(_d = (_c = spreadsheet === null || spreadsheet === void 0 ? void 0 : spreadsheet.importFinalModal) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : ''} prompt={(_f = (_e = spreadsheet === null || spreadsheet === void 0 ? void 0 : spreadsheet.importFinalModal) === null || _e === void 0 ? void 0 : _e.prompt) !== null && _f !== void 0 ? _f : ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack/>
            <WorkspaceMemberRoleSelectionModal_1.default isVisible={isRoleSelectionModalVisible} items={roleItems} onRoleChange={onRoleChange} onClose={function () { return setIsRoleSelectionModalVisible(false); }}/>
        </ScreenWrapper_1.default>);
}
ImportedMembersConfirmationPage.displayName = 'ImportedMembersConfirmationPage';
exports.default = ImportedMembersConfirmationPage;
