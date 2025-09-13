"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_2 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const actions_1 = require("../../__mocks__/reportData/actions");
const personalDetails_1 = require("../../__mocks__/reportData/personalDetails");
const policies_1 = require("../../__mocks__/reportData/policies");
const reports_1 = require("../../__mocks__/reportData/reports");
const transactions_1 = require("../../__mocks__/reportData/transactions");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
/* --- UI Mocks --- */
const parseSource = (source) => {
    if (typeof source === 'string') {
        return source;
    }
    if (typeof source === 'object' && 'name' in source) {
        return source.name;
    }
    if (typeof source === 'object' && 'uri' in source) {
        return source.uri ?? 'No Source';
    }
    if (typeof source === 'function') {
        // If the source is a function, we assume it's an SVG component
        return source.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return source?.toString() ?? 'No Source';
};
jest.mock('@src/components/Avatar', () => {
    return ({ source, name, avatarID, testID = 'Avatar' }) => {
        return (<react_native_2.View dataSet={{
                name,
                avatarID,
                uri: parseSource(source ?? '') || 'No Source',
                parent: testID,
            }} testID="MockedAvatarData"/>);
    };
});
jest.mock('@src/components/Icon', () => {
    return ({ src, testID = 'Avatar' }) => {
        return (<react_native_2.View dataSet={{
                uri: parseSource(src) || 'No Source',
                parent: testID,
            }} testID="MockedIconData"/>);
    };
});
/* --- Data Mocks --- */
const LOGGED_USER_ID = reports_1.iouReportR14932.ownerAccountID;
const SECOND_USER_ID = reports_1.iouReportR14932.managerID;
const policy = {
    ...policies_1.policy420A,
    name: 'XYZ',
    id: 'WORKSPACE_POLICY',
};
const personalPolicy = {
    ...policies_1.policy420A,
    name: 'Test user expenses',
    id: 'PERSONAL_POLICY',
    type: CONST_1.default.POLICY.TYPE.PERSONAL,
};
const chatReport = {
    ...reports_1.chatReportR14932,
    reportID: 'CHAT_REPORT',
    policyID: policy.id,
};
const reportChatDM = {
    ...reports_1.chatReportR14932,
    chatType: undefined,
    reportID: 'CHAT_REPORT_DM',
    policyID: personalPolicy.id,
};
const reportPreviewAction = {
    ...actions_1.actionR14932,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
    reportActionID: 'REPORT_PREVIEW',
    childReportID: 'IOU_REPORT',
};
const reportPreviewDMAction = {
    ...actions_1.actionR14932,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
    reportActionID: 'REPORT_PREVIEW_DM',
    childReportID: 'IOU_REPORT_DM',
};
const reportPreviewSingleTransactionDMAction = {
    ...actions_1.actionR14932,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW,
    reportActionID: 'REPORT_PREVIEW_SINGLE_ACTION_DM',
    childReportID: 'IOU_REPORT_SINGLE_EXPENSE_DM',
    childOwnerAccountID: LOGGED_USER_ID,
    childManagerAccountID: SECOND_USER_ID,
};
const tripPreviewAction = {
    ...actions_1.actionR14932,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.TRIP_PREVIEW,
    reportActionID: 'TRIP_PREVIEW',
    childReportID: 'IOU_REPORT_TRIP',
};
const commentAction = {
    ...actions_1.actionR14932,
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
    reportActionID: 'ADD_COMMENT',
};
const iouDMReport = {
    ...reports_1.iouReportR14932,
    reportID: 'IOU_REPORT_DM',
    chatReportID: reportChatDM.reportID,
    parentReportActionID: reportPreviewDMAction.reportActionID,
    policyID: personalPolicy.id,
};
const iouDMSingleExpenseReport = {
    ...reports_1.iouReportR14932,
    reportID: 'IOU_REPORT_SINGLE_EXPENSE_DM',
    chatReportID: reportChatDM.reportID,
    parentReportActionID: reportPreviewSingleTransactionDMAction.reportActionID,
    policyID: personalPolicy.id,
};
const iouReport = {
    ...reports_1.iouReportR14932,
    reportID: 'IOU_REPORT',
    chatReportID: chatReport.reportID,
    parentReportActionID: reportPreviewAction.reportActionID,
    policyID: policy.id,
};
const iouTripReport = {
    ...reports_1.iouReportR14932,
    reportID: 'IOU_REPORT_TRIP',
    chatReportID: chatReport.reportID,
    parentReportActionID: tripPreviewAction.reportActionID,
    policyID: policy.id,
};
const iouActionOne = {
    ...actions_1.actionR14932,
    originalMessage: {
        ...(0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932),
        IOUTransactionID: 'TRANSACTION_NUMBER_ONE',
        IOUReportID: iouDMReport.reportID,
    },
};
const iouActionTwo = {
    ...actions_1.actionR14932,
    originalMessage: {
        ...(0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932),
        IOUTransactionID: 'TRANSACTION_NUMBER_TWO',
        IOUReportID: iouDMReport.reportID,
    },
};
const iouActionThree = {
    ...actions_1.actionR14932,
    originalMessage: {
        ...(0, ReportActionsUtils_1.getOriginalMessage)(actions_1.actionR14932),
        IOUTransactionID: 'TRANSACTION_NUMBER_THREE',
        IOUReportID: iouDMSingleExpenseReport.reportID,
    },
};
const transactions = [
    {
        ...transactions_1.transactionR14932,
        reportID: iouDMReport.reportID,
        transactionID: 'TRANSACTION_NUMBER_ONE',
    },
    {
        ...transactions_1.transactionR14932,
        reportID: iouDMReport.reportID,
        transactionID: 'TRANSACTION_NUMBER_TWO',
    },
    {
        ...transactions_1.transactionR14932,
        reportID: iouDMSingleExpenseReport.reportID,
        transactionID: 'TRANSACTION_NUMBER_THREE',
    },
];
const reports = [iouReport, iouTripReport, chatReport, iouDMReport, iouDMSingleExpenseReport, reportChatDM];
const policies = [policy, personalPolicy];
const DEFAULT_WORKSPACE_AVATAR = (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policies.at(0)?.name);
const USER_AVATAR = personalDetails_1.default[LOGGED_USER_ID].avatar;
const SECOND_USER_AVATAR = personalDetails_1.default[SECOND_USER_ID].avatar;
/* --- Onyx Mocks --- */
const transactionCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, transactions, (transaction) => transaction.transactionID);
const reportActionCollectionDataSet = {
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport.reportID}`]: {
        [reportPreviewAction.reportActionID]: reportPreviewAction,
        [tripPreviewAction.reportActionID]: tripPreviewAction,
        [commentAction.reportActionID]: commentAction,
    },
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportChatDM.reportID}`]: {
        [reportPreviewDMAction.reportActionID]: reportPreviewDMAction,
        [reportPreviewSingleTransactionDMAction.reportActionID]: reportPreviewSingleTransactionDMAction,
    },
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportPreviewDMAction.reportID}`]: {
        [iouActionOne.reportActionID]: iouActionOne,
        [iouActionTwo.reportActionID]: iouActionTwo,
    },
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportPreviewSingleTransactionDMAction.reportID}`]: {
        [iouActionThree.reportActionID]: iouActionThree,
    },
};
const reportCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.REPORT, reports, (report) => report.reportID);
const policiesCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, policies, (item) => item.id);
const onyxState = {
    [ONYXKEYS_1.default.SESSION]: { accountID: LOGGED_USER_ID, email: personalDetails_1.default[LOGGED_USER_ID].login },
    [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: personalDetails_1.default,
    ...policiesCollectionDataSet,
    ...transactionCollectionDataSet,
    ...reportActionCollectionDataSet,
    ...reportCollectionDataSet,
};
/* --- Helpers --- */
function renderAvatar(props) {
    return (0, react_native_1.render)(<OnyxListItemProvider_1.default>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ReportActionAvatars_1.default {...props}/>
        </OnyxListItemProvider_1.default>);
}
async function retrieveDataFromAvatarView(props) {
    renderAvatar(props);
    await (0, waitForBatchedUpdatesWithAct_1.default)();
    const images = react_native_1.screen.queryAllByTestId('MockedAvatarData');
    const icons = react_native_1.screen.queryAllByTestId('MockedIconData');
    const reportAvatarFragments = react_native_1.screen.queryAllByTestId('ReportActionAvatars-', {
        exact: false,
    });
    const imageData = images.map((img) => img.props.dataSet);
    const iconData = icons.map((icon) => icon.props.dataSet);
    const fragmentsData = reportAvatarFragments.map((fragment) => fragment.props.testID);
    return {
        images: imageData,
        icons: iconData,
        fragments: fragmentsData,
    };
}
function isSubscriptAvatarRendered({ images, fragments, workspaceIconAsPrimaryAvatar, negate = false, }) {
    const isEveryAvatarFragmentASubscript = fragments.every((fragment) => fragment.startsWith('ReportActionAvatars-Subscript')) && fragments.length !== 0;
    const isUserAvatarCorrect = images.some((image) => image.uri === USER_AVATAR && image.parent === `ReportActionAvatars-Subscript-${workspaceIconAsPrimaryAvatar ? 'SecondaryAvatar' : 'MainAvatar'}`);
    const isWorkspaceAvatarCorrect = images.some((image) => image.uri === DEFAULT_WORKSPACE_AVATAR.name && image.parent === `ReportActionAvatars-Subscript-${workspaceIconAsPrimaryAvatar ? 'MainAvatar' : 'SecondaryAvatar'}`);
    expect(isEveryAvatarFragmentASubscript).toBe(!negate);
    expect(isWorkspaceAvatarCorrect).toBe(!negate);
    expect(isUserAvatarCorrect).toBe(!negate);
}
function isMultipleAvatarRendered({ images, fragments, workspaceIconAsPrimaryAvatar, negate = false, secondUserAvatar, stacked, }) {
    const isEveryAvatarFragmentAMultiple = fragments.every((fragment) => fragment.startsWith('ReportActionAvatars-MultipleAvatars')) && fragments.length !== 0;
    const isUserAvatarCorrect = images.some((image) => image.uri === USER_AVATAR &&
        image.parent ===
            (stacked
                ? 'ReportActionAvatars-MultipleAvatars-StackedHorizontally-Avatar'
                : `ReportActionAvatars-MultipleAvatars-${workspaceIconAsPrimaryAvatar ? 'SecondaryAvatar' : 'MainAvatar'}`));
    const isWorkspaceAvatarCorrect = images.some((image) => image.uri === (secondUserAvatar ?? DEFAULT_WORKSPACE_AVATAR.name) &&
        image.parent ===
            (stacked
                ? 'ReportActionAvatars-MultipleAvatars-StackedHorizontally-Avatar'
                : `ReportActionAvatars-MultipleAvatars-${workspaceIconAsPrimaryAvatar ? 'MainAvatar' : 'SecondaryAvatar'}`));
    expect(isEveryAvatarFragmentAMultiple).toBe(!negate);
    expect(isWorkspaceAvatarCorrect).toBe(!negate);
    expect(isUserAvatarCorrect).toBe(!negate);
}
function isSingleAvatarRendered({ images, negate = false, userAvatar }) {
    const isUserAvatarCorrect = images.some((image) => image.uri === (userAvatar ?? USER_AVATAR) && image.parent === 'ReportActionAvatars-SingleAvatar');
    expect(isUserAvatarCorrect).toBe(!negate);
}
describe('ReportActionAvatars', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            initialKeyStates: onyxState,
        });
        (0, OnyxDerived_1.default)();
        return (0, waitForBatchedUpdates_1.default)();
    });
    afterAll(async () => {
        await react_native_onyx_1.default.clear();
    });
    describe('renders properly subscript avatars', () => {
        it('renders user primary avatar and workspace subscript next to report preview action', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ reportID: iouReport.reportID });
            isSubscriptAvatarRendered(retrievedData);
        });
        it('renders workspace avatar with user subscript avatar on chat report view', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ reportID: chatReport.reportID });
            isSubscriptAvatarRendered({ ...retrievedData, workspaceIconAsPrimaryAvatar: true });
        });
        it('renders user primary avatar and workspace subscript next to the trip preview', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ reportID: iouTripReport.reportID });
            isSubscriptAvatarRendered(retrievedData);
        });
        it('renders subscript avatar if the report preview action is provided instead of report ID', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ action: reportPreviewAction });
            isSubscriptAvatarRendered(retrievedData);
        });
        it("doesn't render subscript for user message in workspace if they are text messages", async () => {
            const retrievedData = await retrieveDataFromAvatarView({ action: commentAction, reportID: iouReport.reportID });
            isSubscriptAvatarRendered({ ...retrievedData, negate: true });
        });
        it('properly converts subscript avatars to multiple avatars if the avatars are stacked horizontally', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ reportID: iouReport.reportID, horizontalStacking: true });
            isSubscriptAvatarRendered({ ...retrievedData, negate: true });
            isMultipleAvatarRendered({ ...retrievedData, stacked: true });
        });
    });
    describe('renders properly multiple and single avatars', () => {
        it('renders single avatar if only one account ID is passed even if reportID & action is passed as well', async () => {
            const retrievedData = await retrieveDataFromAvatarView({
                reportID: iouReport.reportID,
                action: reportPreviewAction,
                accountIDs: [SECOND_USER_ID],
            });
            isMultipleAvatarRendered({ ...retrievedData, negate: true });
            isSingleAvatarRendered({ ...retrievedData, userAvatar: SECOND_USER_AVATAR });
        });
        it('renders multiple avatars if more than one account ID is passed', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ accountIDs: [LOGGED_USER_ID, SECOND_USER_ID] });
            isMultipleAvatarRendered({ ...retrievedData, secondUserAvatar: SECOND_USER_AVATAR });
        });
        it('renders diagonal avatar if both DM chat members sent expense to each other in one report', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ reportID: iouDMReport.reportID });
            isMultipleAvatarRendered({ ...retrievedData, secondUserAvatar: SECOND_USER_AVATAR, workspaceIconAsPrimaryAvatar: true });
        });
        it('renders single avatar if only one chat member sent an expense to the other', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ reportID: iouDMSingleExpenseReport.reportID });
            isSingleAvatarRendered(retrievedData);
        });
        it('renders workspace avatar if policyID is passed as a prop', async () => {
            const retrievedData = await retrieveDataFromAvatarView({ policyID: policy.id });
            isSingleAvatarRendered({ ...retrievedData, userAvatar: (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name).name });
        });
    });
});
