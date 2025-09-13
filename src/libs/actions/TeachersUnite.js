"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * @param publicRoomReportID - This is the global reportID for the public room, we'll ignore the optimistic one
 */
function referTeachersUniteVolunteer(partnerUserID, firstName, lastName, policyID, publicRoomReportID) {
    const optimisticPublicRoom = (0, ReportUtils_1.buildOptimisticChatReport)({
        participantList: [],
        reportName: CONST_1.default.TEACHERS_UNITE.PUBLIC_ROOM_NAME,
        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
        policyID,
    });
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${publicRoomReportID}`,
            value: {
                ...optimisticPublicRoom,
                reportID: publicRoomReportID,
                policyName: CONST_1.default.TEACHERS_UNITE.POLICY_NAME,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${publicRoomReportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
    ];
    const parameters = {
        reportID: publicRoomReportID,
        firstName,
        lastName,
        partnerUserID,
    };
    API.write(types_1.WRITE_COMMANDS.REFER_TEACHERS_UNITE_VOLUNTEER, parameters, { optimisticData });
    Navigation_1.default.dismissModalWithReport({ reportID: publicRoomReportID });
}
/**
 * Optimistically creates a policyExpenseChat for the school principal and passes data to AddSchoolPrincipal
 */
function addSchoolPrincipal(firstName, partnerUserID, lastName, policyID, localCurrencyCode, sessionEmail, sessionAccountID) {
    const policyName = CONST_1.default.TEACHERS_UNITE.POLICY_NAME;
    const loggedInEmail = (0, PhoneNumber_1.addSMSDomainIfPhoneNumber)(sessionEmail);
    const reportCreationData = {};
    const expenseChatData = (0, ReportUtils_1.buildOptimisticChatReport)({
        participantList: [sessionAccountID],
        reportName: '',
        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        policyID,
        ownerAccountID: sessionAccountID,
        isOwnPolicyExpenseChat: true,
        oldPolicyName: policyName,
    });
    const expenseChatReportID = expenseChatData.reportID;
    const expenseReportCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(sessionEmail);
    const expenseReportActionData = {
        [expenseReportCreatedAction.reportActionID]: expenseReportCreatedAction,
    };
    reportCreationData[loggedInEmail] = {
        reportID: expenseChatReportID,
        reportActionID: expenseReportCreatedAction.reportActionID,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                id: policyID,
                isPolicyExpenseChatEnabled: true,
                type: CONST_1.default.POLICY.TYPE.CORPORATE,
                name: policyName,
                role: CONST_1.default.POLICY.ROLE.USER,
                owner: sessionEmail,
                // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
                // eslint-disable-next-line deprecation/deprecation
                outputCurrency: (0, PolicyUtils_1.getPolicy)(policyID)?.outputCurrency ?? localCurrencyCode ?? CONST_1.default.CURRENCY.USD,
                employeeList: {
                    [sessionEmail]: {
                        role: CONST_1.default.POLICY.ROLE.USER,
                        errors: {},
                    },
                },
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
                ...expenseChatData,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: expenseReportActionData,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: { pendingAction: null },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: {
                pendingFields: {
                    addWorkspaceRoom: null,
                },
                pendingAction: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${expenseChatReportID}`,
            value: {
                isOptimisticReport: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: {
                [Object.keys(expenseChatData).at(0) ?? '']: {
                    pendingAction: null,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                [sessionEmail]: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${expenseChatReportID}`,
            value: null,
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseChatReportID}`,
            value: null,
        },
    ];
    const parameters = {
        firstName,
        lastName,
        partnerUserID,
        policyID,
        reportCreationData: JSON.stringify(reportCreationData),
    };
    API.write(types_1.WRITE_COMMANDS.ADD_SCHOOL_PRINCIPAL, parameters, { optimisticData, successData, failureData });
    Navigation_1.default.dismissModalWithReport({ reportID: expenseChatReportID });
}
exports.default = { referTeachersUniteVolunteer, addSchoolPrincipal };
