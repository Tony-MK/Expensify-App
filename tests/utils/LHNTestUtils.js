"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakePersonalDetails = void 0;
exports.getDefaultRenderedSidebarLinks = getDefaultRenderedSidebarLinks;
exports.getAdvancedFakeReport = getAdvancedFakeReport;
exports.getFakeReport = getFakeReport;
exports.getFakeReportAction = getFakeReportAction;
exports.MockedSidebarLinks = MockedSidebarLinks;
exports.getDefaultRenderedReportActionItemSingle = getDefaultRenderedReportActionItemSingle;
exports.MockedReportActionItemSingle = MockedReportActionItemSingle;
exports.getFakeReportWithPolicy = getFakeReportWithPolicy;
exports.getFakePolicy = getFakePolicy;
exports.getFakeAdvancedReportAction = getFakeAdvancedReportAction;
exports.getFakeTransactionViolation = getFakeTransactionViolation;
exports.getFakeTransaction = getFakeTransaction;
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const ComposeProviders_1 = require("@components/ComposeProviders");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const withEnvironment_1 = require("@components/withEnvironment");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const DateUtils_1 = require("@libs/DateUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ReportActionItemSingle_1 = require("@pages/home/report/ReportActionItemSingle");
const SidebarLinksData_1 = require("@pages/home/sidebar/SidebarLinksData");
const CONST_1 = require("@src/CONST");
const waitForBatchedUpdatesWithAct_1 = require("./waitForBatchedUpdatesWithAct");
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigationState: () => true,
        useRoute: jest.fn(),
        useFocusEffect: jest.fn(),
        useIsFocused: () => true,
        useNavigation: () => ({
            navigate: jest.fn(),
            addListener: jest.fn(),
        }),
        createNavigationContainerRef: jest.fn(),
    };
});
const fakePersonalDetails = {
    1: {
        accountID: 1,
        login: 'email1@test.com',
        displayName: 'Email One',
        avatar: 'none',
        firstName: 'One',
    },
    2: {
        accountID: 2,
        login: 'email2@test.com',
        displayName: 'Email Two',
        avatar: 'none',
        firstName: 'Two',
        pronouns: '__predefined_sheHerHers',
    },
    3: {
        accountID: 3,
        login: 'email3@test.com',
        displayName: 'Email Three',
        avatar: 'none',
        firstName: 'Three',
    },
    4: {
        accountID: 4,
        login: 'email4@test.com',
        displayName: 'Email Four',
        avatar: 'none',
        firstName: 'Four',
    },
    5: {
        accountID: 5,
        login: 'email5@test.com',
        displayName: 'Email Five',
        avatar: 'none',
        firstName: 'Five',
    },
    6: {
        accountID: 6,
        login: 'email6@test.com',
        displayName: 'Email Six',
        avatar: 'none',
        firstName: 'Six',
    },
    7: {
        accountID: 7,
        login: 'email7@test.com',
        displayName: 'Email Seven',
        avatar: 'none',
        firstName: 'Seven',
    },
    8: {
        accountID: 8,
        login: 'email8@test.com',
        displayName: 'Email Eight',
        avatar: 'none',
        firstName: 'Eight',
    },
    9: {
        accountID: 9,
        login: 'email9@test.com',
        displayName: 'Email Nine',
        avatar: 'none',
        firstName: 'Nine',
    },
    10: {
        accountID: 10,
        login: 'email10@test.com',
        displayName: 'Email Ten',
        avatar: 'none',
        firstName: 'Ten',
    },
};
exports.fakePersonalDetails = fakePersonalDetails;
let lastFakeReportID = 0;
let lastFakeReportActionID = 0;
let lastFakeTransactionID = 0;
/**
 * @param millisecondsInThePast the number of milliseconds in the past for the last message timestamp (to order reports by most recent messages)
 */
function getFakeReport(participantAccountIDs = [1, 2], millisecondsInThePast = 0, isUnread = false, adminIDs = []) {
    const lastVisibleActionCreated = DateUtils_1.default.getDBTime(Date.now() - millisecondsInThePast);
    const participants = (0, ReportUtils_1.buildParticipantsFromAccountIDs)(participantAccountIDs);
    adminIDs.forEach((id) => {
        participants[id] = {
            notificationPreference: 'always',
            role: CONST_1.default.REPORT.ROLE.ADMIN,
        };
    });
    return {
        type: CONST_1.default.REPORT.TYPE.CHAT,
        reportID: `${++lastFakeReportID}`,
        reportName: 'Report',
        lastVisibleActionCreated,
        lastReadTime: isUnread ? DateUtils_1.default.subtractMillisecondsFromDateTime(lastVisibleActionCreated, 1) : lastVisibleActionCreated,
        participants,
    };
}
/**
 * @param millisecondsInThePast the number of milliseconds in the past for the last message timestamp (to order reports by most recent messages)
 */
function getFakeReportAction(actor = 'email1@test.com', millisecondsInThePast = 0) {
    const timestamp = Date.now() - millisecondsInThePast;
    const created = DateUtils_1.default.getDBTime(timestamp);
    const reportActionID = ++lastFakeReportActionID;
    return {
        actor,
        actorAccountID: 1,
        reportActionID: `${reportActionID}`,
        actionName: CONST_1.default.REPORT.ACTIONS.TYPE.CREATED,
        shouldShow: true,
        created,
        person: [
            {
                type: 'TEXT',
                style: 'strong',
                text: 'Email One',
            },
        ],
        automatic: false,
        message: [
            {
                type: 'COMMENT',
                html: 'hey',
                text: 'hey',
                isEdited: false,
                whisperedTo: [],
                isDeletedParentAction: false,
            },
        ],
        originalMessage: {
            whisperedTo: [],
            html: 'hey',
            lastModified: '2023-08-28 15:28:12.432',
        },
    };
}
function getFakeTransaction(expenseReportID, amount = 1, currency = CONST_1.default.CURRENCY.USD) {
    return {
        transactionID: `${++lastFakeTransactionID}`,
        amount,
        currency,
        reportID: expenseReportID,
    };
}
function getAdvancedFakeReport(isArchived, isUserCreatedPolicyRoom, hasAddWorkspaceError, isUnread, isPinned) {
    return {
        ...getFakeReport([1, 2], 0, isUnread),
        type: CONST_1.default.REPORT.TYPE.CHAT,
        chatType: isUserCreatedPolicyRoom ? CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM : CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
        statusNum: isArchived ? CONST_1.default.REPORT.STATUS_NUM.CLOSED : 0,
        stateNum: isArchived ? CONST_1.default.REPORT.STATE_NUM.APPROVED : 0,
        errorFields: hasAddWorkspaceError ? { 1708946640843000: { addWorkspaceRoom: 'blah' } } : undefined,
        isPinned,
    };
}
/**
 * @param millisecondsInThePast the number of milliseconds in the past for the last message timestamp (to order reports by most recent messages)
 */
function getFakeReportWithPolicy(participantAccountIDs = [1, 2], millisecondsInThePast = 0, isUnread = false) {
    return {
        ...getFakeReport(participantAccountIDs, millisecondsInThePast, isUnread),
        type: CONST_1.default.REPORT.TYPE.CHAT,
        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        policyID: '08CE60F05A5D86E1',
        oldPolicyName: '',
        isOwnPolicyExpenseChat: false,
        ownerAccountID: participantAccountIDs.at(0),
    };
}
function getFakePolicy(id = '1', name = 'Workspace-Test-001') {
    return {
        id,
        name,
        isFromFullPolicy: false,
        role: 'admin',
        type: CONST_1.default.POLICY.TYPE.TEAM,
        owner: 'myuser@gmail.com',
        outputCurrency: 'BRL',
        avatarURL: '',
        employeeList: {},
        isPolicyExpenseChatEnabled: true,
        lastModified: '1697323926777105',
        autoReporting: true,
        autoReportingFrequency: 'immediate',
        harvesting: {
            enabled: true,
        },
        autoReportingOffset: 1,
        preventSelfApproval: true,
        defaultBillable: false,
        disabledFields: { defaultBillable: true, reimbursable: false },
        approvalMode: 'BASIC',
    };
}
function getFakeTransactionViolation(violationName, showInReview = true) {
    return {
        type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
        name: violationName,
        showInReview,
    };
}
/**
 * @param millisecondsInThePast the number of milliseconds in the past for the last message timestamp (to order reports by most recent messages)
 */
function getFakeAdvancedReportAction(actionName = 'IOU', actor = 'email1@test.com', millisecondsInThePast = 0) {
    return {
        ...getFakeReportAction(actor, millisecondsInThePast),
        actionName,
    };
}
function MockedSidebarLinks({ currentReportID = '' }) {
    return (<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider]}>
            {/*
         * Only required to make unit tests work, since we
         * explicitly pass the currentReportID in LHNTestUtils
         * to SidebarLinksData, so this context doesn't have an
         * access to currentReportID in that case.
         *
         * So this is a work around to have currentReportID available
         * only in testing environment.
         *  */}
            <useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider currentReportIDForTests={currentReportID}>
                <SidebarLinksData_1.default insets={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }}/>
            </useSidebarOrderedReports_1.SidebarOrderedReportsContextProvider>
        </ComposeProviders_1.default>);
}
function getDefaultRenderedSidebarLinks(currentReportID = '') {
    // A try-catch block needs to be added to the rendering so that any errors that happen while the component
    // renders are caught and logged to the console. Without the try-catch block, Jest might only report the error
    // as "The above error occurred in your component", without providing specific details. By using a try-catch block,
    // any errors are caught and logged, allowing you to identify the exact error that might be causing a rendering issue
    // when developing tests.
    try {
        // Wrap the SideBarLinks inside of LocaleContextProvider so that all the locale props
        // are passed to the component. If this is not done, then all the locale props are missing
        // and there are a lot of render warnings. It needs to be done like this because normally in
        // our app (App.js) is when the react application is wrapped in the context providers
        (0, react_native_1.render)(<MockedSidebarLinks currentReportID={currentReportID}/>);
        return (0, waitForBatchedUpdatesWithAct_1.default)();
    }
    catch (error) {
        console.error(error);
    }
}
function internalRender(component) {
    // A try-catch block needs to be added to the rendering so that any errors that happen while the component
    // renders are caught and logged to the console. Without the try-catch block, Jest might only report the error
    // as "The above error occurred in your component", without providing specific details. By using a try-catch block,
    // any errors are caught and logged, allowing you to identify the exact error that might be causing a rendering issue
    // when developing tests.
    try {
        (0, react_native_1.render)(component);
    }
    catch (error) {
        console.error(error);
    }
}
function MockedReportActionItemSingle({ report, reportAction }) {
    return (<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, withEnvironment_1.EnvironmentProvider, useCurrentReportID_1.CurrentReportIDContextProvider]}>
            <ReportActionItemSingle_1.default action={reportAction} report={report} showHeader hasBeenFlagged={false} iouReport={undefined} isHovered={false}/>
        </ComposeProviders_1.default>);
}
function getDefaultRenderedReportActionItemSingle(report, reportAction) {
    const currentReport = report ?? getFakeReport();
    const currentReportAction = reportAction ?? getFakeAdvancedReportAction();
    internalRender(<MockedReportActionItemSingle report={currentReport} reportAction={currentReportAction}/>);
}
