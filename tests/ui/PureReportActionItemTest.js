"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const NativeNavigation = require("@react-navigation/native");
const react_native_1 = require("@testing-library/react-native");
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const ComposeProviders_1 = require("@components/ComposeProviders");
const HTMLEngineProvider_1 = require("@components/HTMLEngineProvider");
const LocaleContextProvider_1 = require("@components/LocaleContextProvider");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const OptionListContextProvider_1 = require("@components/OptionListContextProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Localize_1 = require("@libs/Localize");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const PureReportActionItem_1 = require("@pages/home/report/PureReportActionItem");
const CONST_1 = require("@src/CONST");
const ReportActionUtils = require("@src/libs/ReportActionsUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdatesWithAct_1 = require("../utils/waitForBatchedUpdatesWithAct");
const wrapOnyxWithWaitForBatchedUpdates_1 = require("../utils/wrapOnyxWithWaitForBatchedUpdates");
jest.mock('@react-navigation/native');
const ACTOR_ACCOUNT_ID = 123456789;
const actorEmail = 'test@test.com';
const createReportAction = (actionName, originalMessageExtras) => ({
    reportActionID: '12345',
    actorAccountID: ACTOR_ACCOUNT_ID,
    created: '2025-07-12 09:03:17.653',
    actionName,
    automatic: true,
    shouldShow: true,
    avatar: '',
    person: [{ type: 'TEXT', style: 'strong', text: 'Concierge' }],
    message: [{ type: 'COMMENT', html: 'some message', text: 'some message' }],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    originalMessage: {
        ...originalMessageExtras,
    },
});
describe('PureReportActionItem', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
            evictableKeys: [ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS],
        });
        jest.spyOn(NativeNavigation, 'useRoute').mockReturnValue({ key: '', name: '' });
        jest.spyOn(ReportActionUtils, 'getIOUActionForReportID').mockImplementation(ReportActionsUtils_1.getIOUActionForReportID);
    });
    beforeEach(() => {
        (0, wrapOnyxWithWaitForBatchedUpdates_1.default)(react_native_onyx_1.default);
        return react_native_onyx_1.default.merge(ONYXKEYS_1.default.NETWORK, { isOffline: false }).then(() => react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.PERSONAL_DETAILS_LIST}`, {
            [ACTOR_ACCOUNT_ID]: {
                accountID: ACTOR_ACCOUNT_ID,
                avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/default-avatar_9.png',
                displayName: actorEmail,
                login: actorEmail,
            },
        }));
    });
    afterEach(() => {
        react_native_onyx_1.default.clear();
    });
    function renderItemWithAction(action) {
        return (0, react_native_1.render)(<ComposeProviders_1.default components={[OnyxListItemProvider_1.default, LocaleContextProvider_1.LocaleContextProvider, HTMLEngineProvider_1.default]}>
                <OptionListContextProvider_1.default>
                    <ScreenWrapper_1.default testID="test">
                        <portal_1.PortalProvider>
                            <PureReportActionItem_1.default allReports={undefined} policies={undefined} report={undefined} reportActions={[]} parentReportAction={undefined} action={action} displayAsGroup={false} isMostRecentIOUReportAction={false} shouldDisplayNewMarker={false} index={0} isFirstVisibleReportAction={false} taskReport={undefined} linkedReport={undefined} iouReportOfLinkedReport={undefined}/>
                        </portal_1.PortalProvider>
                    </ScreenWrapper_1.default>
                </OptionListContextProvider_1.default>
            </ComposeProviders_1.default>);
    }
    describe('Automatic actions', () => {
        const testCases = [
            {
                testTitle: 'APPROVED action via workspace rules',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED,
                originalMessageExtras: { automaticAction: true },
                translationKey: 'iou.automaticallyApproved',
            },
            {
                testTitle: 'FORWARDED action via workspace rules',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED,
                originalMessageExtras: { automaticAction: true },
                translationKey: 'iou.automaticallyForwarded',
            },
            {
                testTitle: 'SUBMITTED action via harvesting',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED,
                originalMessageExtras: { harvesting: true },
                translationKey: 'iou.automaticallySubmitted',
            },
            {
                testTitle: 'SUBMITTED_AND_CLOSED action via harvesting',
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED,
                originalMessageExtras: { harvesting: true },
                translationKey: 'iou.automaticallySubmitted',
            },
        ];
        const parseTextWithTrailingLink = (translatedText) => {
            const match = translatedText.match(/^(.*?)(<a[^>]*>)(.*?)(<\/a>)$/);
            if (!match) {
                return null;
            }
            const [, textBeforeLink, , linkText] = match;
            return { textBeforeLink, linkText };
        };
        it.each(testCases)('$testTitle', async ({ actionName, originalMessageExtras, translationKey }) => {
            const action = createReportAction(actionName, originalMessageExtras);
            renderItemWithAction(action);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
            const parsedText = parseTextWithTrailingLink((0, Localize_1.translateLocal)(translationKey));
            if (!parsedText) {
                throw new Error('Text cannot be parsed, translation failed');
            }
            const { textBeforeLink, linkText } = parsedText;
            expect(react_native_1.screen.getByText(textBeforeLink)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText(linkText)).toBeOnTheScreen();
        });
    });
    describe('Manual actions', () => {
        it('APPROVED action', async () => {
            const action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.APPROVED, { automaticAction: false });
            renderItemWithAction(action);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.approvedMessage'))).toBeOnTheScreen();
        });
        it('FORWARDED action', async () => {
            const action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.FORWARDED, { automaticAction: false });
            renderItemWithAction(action);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.forwarded'))).toBeOnTheScreen();
        });
        it('SUBMITTED action', async () => {
            const action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED, { harvesting: false });
            renderItemWithAction(action);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.submitted', {}))).toBeOnTheScreen();
        });
        it('SUBMITTED action with memo', async () => {
            const memo = 'memo message';
            const action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED, { harvesting: false, message: memo });
            renderItemWithAction(action);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.submitted', { memo }))).toBeOnTheScreen();
        });
        it('SUBMITTED_AND_CLOSED action', async () => {
            const action = createReportAction(CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED_AND_CLOSED, { harvesting: false });
            renderItemWithAction(action);
            await (0, waitForBatchedUpdatesWithAct_1.default)();
            expect(react_native_1.screen.getByText(actorEmail)).toBeOnTheScreen();
            expect(react_native_1.screen.getByText((0, Localize_1.translateLocal)('iou.submitted', {}))).toBeOnTheScreen();
        });
    });
});
