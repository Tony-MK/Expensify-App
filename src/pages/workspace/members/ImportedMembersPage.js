"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ImportSpreadsheetColumns_1 = require("@components/ImportSpreadsheetColumns");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useCloseImportPage_1 = require("@hooks/useCloseImportPage");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const Member_1 = require("@libs/actions/Policy/Member");
const importSpreadsheetUtils_1 = require("@libs/importSpreadsheetUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ImportedMembersPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [spreadsheet, spreadsheetMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IMPORTED_SPREADSHEET, { canBeMissing: true });
    const [isImporting, setIsImporting] = (0, react_1.useState)(false);
    const [isValidationEnabled, setIsValidationEnabled] = (0, react_1.useState)(false);
    const { setIsClosing } = (0, useCloseImportPage_1.default)();
    const [shouldShowConfirmModal, setShouldShowConfirmModal] = (0, react_1.useState)(true);
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const columnNames = (0, importSpreadsheetUtils_1.generateColumnNames)(spreadsheet?.data?.length ?? 0);
    const { containsHeader = true } = spreadsheet ?? {};
    const columnRoles = [
        { text: translate('common.ignore'), value: CONST_1.default.CSV_IMPORT_COLUMNS.IGNORE },
        { text: translate('common.email'), value: CONST_1.default.CSV_IMPORT_COLUMNS.EMAIL, isRequired: true },
        { text: translate('common.role'), value: CONST_1.default.CSV_IMPORT_COLUMNS.ROLE },
        { text: translate('common.submitTo'), value: CONST_1.default.CSV_IMPORT_COLUMNS.SUBMIT_TO },
        { text: translate('common.forwardTo'), value: CONST_1.default.CSV_IMPORT_COLUMNS.APPROVE_TO },
    ];
    const requiredColumns = columnRoles.filter((role) => role.isRequired).map((role) => role);
    // checks if all required columns are mapped and no column is mapped more than once
    // returns found errors or empty object if both conditions are met
    const validate = (0, react_1.useCallback)(() => {
        const columns = Object.values(spreadsheet?.columns ?? {});
        let errors = {};
        const missingRequiredColumns = requiredColumns.find((requiredColumn) => !columns.includes(requiredColumn.value));
        if (missingRequiredColumns) {
            errors.required = translate('spreadsheet.fieldNotMapped', { fieldName: missingRequiredColumns.text });
        }
        else {
            const duplicate = (0, importSpreadsheetUtils_1.findDuplicate)(columns);
            if (duplicate) {
                errors.duplicates = translate('spreadsheet.singleFieldMultipleColumns', { fieldName: duplicate });
            }
            else {
                errors = {};
            }
        }
        return errors;
    }, [requiredColumns, spreadsheet?.columns, translate]);
    const importMembers = (0, react_1.useCallback)(() => {
        setIsValidationEnabled(true);
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            return;
        }
        let isRoleMissing = false;
        const columns = Object.values(spreadsheet?.columns ?? {});
        const membersEmailsColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.EMAIL);
        const membersRolesColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.ROLE);
        const membersEmails = spreadsheet?.data[membersEmailsColumn].map((email) => email);
        const membersRoles = membersRolesColumn !== -1 ? spreadsheet?.data[membersRolesColumn].map((role) => role) : [];
        const membersSubmitsToColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.SUBMIT_TO);
        const membersForwardsToColumn = columns.findIndex((column) => column === CONST_1.default.CSV_IMPORT_COLUMNS.APPROVE_TO);
        const membersSubmitsTo = membersSubmitsToColumn !== -1 ? spreadsheet?.data[membersSubmitsToColumn].map((submitsTo) => submitsTo) : [];
        const membersForwardsTo = membersForwardsToColumn !== -1 ? spreadsheet?.data[membersForwardsToColumn].map((forwardsTo) => forwardsTo) : [];
        const members = membersEmails?.slice(containsHeader ? 1 : 0).map((email, index) => {
            const isPolicyMember = (0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(email, policy);
            let role = isPolicyMember ? (policy?.employeeList?.[email]?.role ?? '') : '';
            if (membersRolesColumn !== -1 && membersRoles?.[containsHeader ? index + 1 : index]) {
                role = membersRoles?.[containsHeader ? index + 1 : index];
            }
            if (membersRolesColumn !== -1 && !role) {
                isRoleMissing = true;
            }
            let submitsTo = '';
            if (membersSubmitsToColumn !== -1 && membersSubmitsTo?.[containsHeader ? index + 1 : index]) {
                submitsTo = membersSubmitsTo?.[containsHeader ? index + 1 : index];
            }
            let forwardsTo = '';
            if (membersForwardsToColumn !== -1 && membersForwardsTo?.[containsHeader ? index + 1 : index]) {
                forwardsTo = membersForwardsTo?.[containsHeader ? index + 1 : index];
            }
            return {
                email,
                role,
                submitsTo,
                forwardsTo,
            };
        });
        const allMembers = [...(members ?? [])];
        // Add submitsTo and forwardsTo members if they are not in the workspace
        members?.forEach((member) => {
            if (member.submitsTo && !allMembers.some((m) => m.email === member.submitsTo) && !(0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(member.submitsTo, policy)) {
                isRoleMissing = true;
                allMembers.push({
                    email: member.submitsTo,
                    role: '',
                    submitsTo: '',
                    forwardsTo: '',
                });
            }
            if (member.forwardsTo && !allMembers.some((m) => m.email === member.forwardsTo) && !(0, PolicyUtils_1.isPolicyMemberWithoutPendingDelete)(member.forwardsTo, policy)) {
                isRoleMissing = true;
                allMembers.push({
                    email: member.forwardsTo,
                    role: policy?.employeeList?.[member.forwardsTo]?.role ?? '',
                    submitsTo: '',
                    forwardsTo: '',
                });
            }
        });
        if (isRoleMissing) {
            (0, Member_1.setImportedSpreadsheetMemberData)(allMembers);
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_MEMBERS_IMPORTED_CONFIRMATION.getRoute(policyID));
        }
        else {
            setIsImporting(true);
            (0, Member_1.importPolicyMembers)(policyID, allMembers);
        }
    }, [validate, spreadsheet?.columns, spreadsheet?.data, containsHeader, policy, policyID]);
    if (!spreadsheet && (0, isLoadingOnyxValue_1.default)(spreadsheetMetadata)) {
        return;
    }
    const spreadsheetColumns = spreadsheet?.data;
    if (!spreadsheetColumns) {
        return <NotFoundPage_1.default />;
    }
    const closeImportPageAndModal = () => {
        setIsClosing(true);
        setIsImporting(false);
        setShouldShowConfirmModal(false);
    };
    return (<ScreenWrapper_1.default testID={ImportedMembersPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.people.importMembers')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MEMBERS_IMPORT.getRoute(policyID))}/>
            <ImportSpreadsheetColumns_1.default spreadsheetColumns={spreadsheetColumns} columnNames={columnNames} importFunction={importMembers} errors={isValidationEnabled ? validate() : undefined} columnRoles={columnRoles} isButtonLoading={isImporting} learnMoreLink={CONST_1.default.IMPORT_SPREADSHEET.MEMBERS_ARTICLE_LINK}/>
            <ConfirmModal_1.default isVisible={spreadsheet?.shouldFinalModalBeOpened && shouldShowConfirmModal} title={spreadsheet?.importFinalModal?.title ?? ''} prompt={spreadsheet?.importFinalModal?.prompt ?? ''} onConfirm={closeImportPageAndModal} onCancel={closeImportPageAndModal} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false} shouldHandleNavigationBack onModalHide={() => {
            react_native_1.InteractionManager.runAfterInteractions(() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_MEMBERS.getRoute(policyID)));
        }}/>
        </ScreenWrapper_1.default>);
}
ImportedMembersPage.displayName = 'ImportedMembersPage';
exports.default = ImportedMembersPage;
