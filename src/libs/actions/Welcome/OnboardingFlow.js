"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnboardingMessages = void 0;
exports.getOnboardingInitialPath = getOnboardingInitialPath;
exports.startOnboardingFlow = startOnboardingFlow;
const native_1 = require("@react-navigation/native");
const react_native_onyx_1 = require("react-native-onyx");
const Localize_1 = require("@libs/Localize");
const getAdaptedStateFromPath_1 = require("@libs/Navigation/helpers/getAdaptedStateFromPath");
const linkingConfig_1 = require("@libs/Navigation/linkingConfig");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
let onboardingValues;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ONBOARDING,
    callback: (value) => {
        if (value === undefined) {
            return;
        }
        onboardingValues = value;
    },
});
/**
 * Start a new onboarding flow or continue from the last visited onboarding page.
 */
function startOnboardingFlow(startOnboardingFlowParams) {
    const currentRoute = Navigation_1.navigationRef.getCurrentRoute();
    const adaptedState = (0, getAdaptedStateFromPath_1.default)(getOnboardingInitialPath(startOnboardingFlowParams), linkingConfig_1.linkingConfig.config, false);
    const focusedRoute = (0, native_1.findFocusedRoute)(adaptedState);
    if (focusedRoute?.name === currentRoute?.name) {
        return;
    }
    const rootState = Navigation_1.navigationRef.getRootState();
    const rootStateRouteNamesSet = new Set(rootState.routes.map((route) => route.name));
    Navigation_1.navigationRef.resetRoot({
        ...rootState,
        ...adaptedState,
        stale: true,
        routes: [...rootState.routes, ...(adaptedState?.routes.filter((route) => !rootStateRouteNamesSet.has(route.name)) ?? [])],
    });
}
function getOnboardingInitialPath(getOnboardingInitialPathParams) {
    const { isUserFromPublicDomain, hasAccessiblePolicies, onboardingValuesParam, currentOnboardingPurposeSelected, currentOnboardingCompanySize, onboardingInitialPath = '', } = getOnboardingInitialPathParams;
    const state = (0, native_1.getStateFromPath)(onboardingInitialPath, linkingConfig_1.linkingConfig.config);
    const currentOnboardingValues = onboardingValuesParam ?? onboardingValues;
    const isVsb = currentOnboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    const isSmb = currentOnboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
    const isIndividual = currentOnboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.INDIVIDUAL;
    const isCurrentOnboardingPurposeManageTeam = currentOnboardingPurposeSelected === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM;
    if (isVsb) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, CONST_1.default.ONBOARDING_COMPANY_SIZE.MICRO);
    }
    if (isSmb) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM);
    }
    if (isIndividual) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.ONBOARDING_CUSTOM_CHOICES, [CONST_1.default.ONBOARDING_CHOICES.PERSONAL_SPEND, CONST_1.default.ONBOARDING_CHOICES.EMPLOYER, CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT]);
    }
    if (isUserFromPublicDomain && !onboardingValuesParam?.isMergeAccountStepCompleted) {
        return `/${ROUTES_1.default.ONBOARDING_WORK_EMAIL.route}`;
    }
    if (!isUserFromPublicDomain && hasAccessiblePolicies) {
        return `/${ROUTES_1.default.ONBOARDING_PERSONAL_DETAILS.route}`;
    }
    if (isVsb) {
        return `/${ROUTES_1.default.ONBOARDING_ACCOUNTING.route}`;
    }
    if (isSmb) {
        return `/${ROUTES_1.default.ONBOARDING_EMPLOYEES.route}`;
    }
    if (state?.routes?.at(-1)?.name !== NAVIGATORS_1.default.ONBOARDING_MODAL_NAVIGATOR) {
        return `/${ROUTES_1.default.ONBOARDING_ROOT.route}`;
    }
    if (onboardingInitialPath.includes(ROUTES_1.default.ONBOARDING_EMPLOYEES.route) && !isCurrentOnboardingPurposeManageTeam) {
        return `/${ROUTES_1.default.ONBOARDING_PURPOSE.route}`;
    }
    if (onboardingInitialPath.includes(ROUTES_1.default.ONBOARDING_ACCOUNTING.route) && (!isCurrentOnboardingPurposeManageTeam || !currentOnboardingCompanySize)) {
        return `/${ROUTES_1.default.ONBOARDING_PURPOSE.route}`;
    }
    return onboardingInitialPath;
}
const getOnboardingMessages = (hasIntroSelected = false, locale) => {
    const resolvedLocale = locale ?? IntlStore_1.default.getCurrentLocale();
    const testDrive = {
        ONBOARDING_TASK_NAME: (0, Localize_1.translate)(resolvedLocale, 'onboarding.testDrive.name', {}),
        EMBEDDED_DEMO_WHITELIST: ['http://', 'https://', 'about:'],
        EMBEDDED_DEMO_IFRAME_TITLE: (0, Localize_1.translate)(resolvedLocale, 'onboarding.testDrive.embeddedDemoIframeTitle'),
        EMPLOYEE_FAKE_RECEIPT: {
            AMOUNT: 2000,
            CURRENCY: 'USD',
            DESCRIPTION: (0, Localize_1.translate)(resolvedLocale, 'onboarding.testDrive.employeeFakeReceipt.description'),
            MERCHANT: "Tommy's Tires",
        },
    };
    const createReportTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.CREATE_REPORT,
        autoCompleted: false,
        mediaAttributes: {},
        title: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.createReportTask.title'),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.createReportTask.description'),
    };
    const testDriveAdminTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR,
        autoCompleted: false,
        mediaAttributes: {},
        title: ({ testDriveURL }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.testDriveAdminTask.title', { testDriveURL }),
        description: ({ testDriveURL }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.testDriveAdminTask.description', { testDriveURL }),
    };
    const testDriveEmployeeTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.VIEW_TOUR,
        autoCompleted: false,
        mediaAttributes: {},
        title: ({ testDriveURL }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.testDriveEmployeeTask.title', { testDriveURL }),
        description: ({ testDriveURL }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.testDriveEmployeeTask.description', { testDriveURL }),
    };
    const createTestDriveAdminWorkspaceTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.CREATE_WORKSPACE,
        autoCompleted: false,
        mediaAttributes: {},
        title: ({ workspaceConfirmationLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.createTestDriveAdminWorkspaceTask.title', { workspaceConfirmationLink }),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.createTestDriveAdminWorkspaceTask.description'),
    };
    const createWorkspaceTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.CREATE_WORKSPACE,
        autoCompleted: true,
        mediaAttributes: {},
        title: ({ workspaceSettingsLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.createWorkspaceTask.title', { workspaceSettingsLink }),
        description: ({ workspaceSettingsLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.createWorkspaceTask.description', { workspaceSettingsLink }),
    };
    const setupCategoriesTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.SETUP_CATEGORIES,
        autoCompleted: false,
        mediaAttributes: {
            [`${CONST_1.default.CLOUDFRONT_URL}/videos/walkthrough-categories-v2.mp4`]: `data-expensify-thumbnail-url="${CONST_1.default.CLOUDFRONT_URL}/images/walkthrough-categories.png" data-expensify-width="1920" data-expensify-height="1080"`,
        },
        title: ({ workspaceCategoriesLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.setupCategoriesTask.title', { workspaceCategoriesLink }),
        description: ({ workspaceCategoriesLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.setupCategoriesTask.description', { workspaceCategoriesLink }),
    };
    const combinedTrackSubmitExpenseTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.SUBMIT_EXPENSE,
        autoCompleted: false,
        mediaAttributes: {},
        title: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.combinedTrackSubmitExpenseTask.title'),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.combinedTrackSubmitExpenseTask.description'),
    };
    const adminSubmitExpenseTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.SUBMIT_EXPENSE,
        autoCompleted: false,
        mediaAttributes: {},
        title: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.adminSubmitExpenseTask.title'),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.adminSubmitExpenseTask.description'),
    };
    const trackExpenseTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.TRACK_EXPENSE,
        autoCompleted: false,
        mediaAttributes: {},
        title: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.trackExpenseTask.title'),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.trackExpenseTask.description'),
    };
    const addAccountingIntegrationTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.ADD_ACCOUNTING_INTEGRATION,
        autoCompleted: false,
        mediaAttributes: {
            [`${CONST_1.default.CLOUDFRONT_URL}/${CONST_1.default.connectionsVideoPaths[CONST_1.default.ONBOARDING_ACCOUNTING_MAPPING.netsuite]}`]: `data-expensify-thumbnail-url="${CONST_1.default.CLOUDFRONT_URL}/images/walkthrough-connect_to_netsuite.png" data-expensify-width="1920" data-expensify-height="1080"`,
            [`${CONST_1.default.CLOUDFRONT_URL}/${CONST_1.default.connectionsVideoPaths[CONST_1.default.ONBOARDING_ACCOUNTING_MAPPING.quickbooksOnline]}`]: `data-expensify-thumbnail-url="${CONST_1.default.CLOUDFRONT_URL}/images/walkthrough-connect_to_qbo.png" data-expensify-width="1920" data-expensify-height="1080"`,
            [`${CONST_1.default.CLOUDFRONT_URL}/${CONST_1.default.connectionsVideoPaths[CONST_1.default.ONBOARDING_ACCOUNTING_MAPPING.xero]}`]: `data-expensify-thumbnail-url="${CONST_1.default.CLOUDFRONT_URL}/images/walkthrough-connect_to_xero.png" data-expensify-width="1920" data-expensify-height="1080"`,
        },
        title: ({ integrationName, workspaceAccountingLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.addAccountingIntegrationTask.title', { integrationName, workspaceAccountingLink }),
        description: ({ integrationName, workspaceAccountingLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.addAccountingIntegrationTask.description', { integrationName, workspaceAccountingLink }),
    };
    const connectCorporateCardTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.CONNECT_CORPORATE_CARD,
        title: ({ corporateCardLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.connectCorporateCardTask.title', { corporateCardLink }),
        description: ({ corporateCardLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.connectCorporateCardTask.description', { corporateCardLink }),
        autoCompleted: false,
        mediaAttributes: {},
    };
    const inviteTeamTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.INVITE_TEAM,
        autoCompleted: false,
        mediaAttributes: {
            [`${CONST_1.default.CLOUDFRONT_URL}/videos/walkthrough-invite_members-v2.mp4`]: `data-expensify-thumbnail-url="${CONST_1.default.CLOUDFRONT_URL}/images/walkthrough-invite_members.png" data-expensify-width="1920" data-expensify-height="1080"`,
        },
        title: ({ workspaceMembersLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.inviteTeamTask.title', { workspaceMembersLink }),
        description: ({ workspaceMembersLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.inviteTeamTask.description', { workspaceMembersLink }),
    };
    const setupCategoriesAndTags = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.SETUP_CATEGORIES_AND_TAGS,
        autoCompleted: false,
        mediaAttributes: {},
        title: ({ workspaceCategoriesLink, workspaceTagsLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.setupCategoriesAndTags.title', { workspaceCategoriesLink, workspaceTagsLink }),
        description: ({ workspaceCategoriesLink, workspaceAccountingLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.setupCategoriesAndTags.description', { workspaceCategoriesLink, workspaceAccountingLink }),
    };
    const setupTagsTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.SETUP_TAGS,
        autoCompleted: false,
        title: ({ workspaceTagsLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.setupTagsTask.title', { workspaceTagsLink }),
        description: ({ workspaceMoreFeaturesLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.setupTagsTask.description', { workspaceMoreFeaturesLink }),
        mediaAttributes: {
            [`${CONST_1.default.CLOUDFRONT_URL}/videos/walkthrough-tags-v2.mp4`]: `data-expensify-thumbnail-url="${CONST_1.default.CLOUDFRONT_URL}/images/walkthrough-tags.png" data-expensify-width="1920" data-expensify-height="1080"`,
        },
    };
    const startChatTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.START_CHAT,
        autoCompleted: false,
        mediaAttributes: {},
        title: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.startChatTask.title'),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.startChatTask.description'),
    };
    const splitExpenseTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.SPLIT_EXPENSE,
        autoCompleted: false,
        mediaAttributes: {},
        title: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.splitExpenseTask.title'),
        description: (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.splitExpenseTask.description'),
    };
    const reviewWorkspaceSettingsTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.REVIEW_WORKSPACE_SETTINGS,
        autoCompleted: false,
        mediaAttributes: {},
        title: ({ workspaceSettingsLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.reviewWorkspaceSettingsTask.title', { workspaceSettingsLink }),
        description: ({ workspaceSettingsLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.reviewWorkspaceSettingsTask.description', { workspaceSettingsLink }),
    };
    const inviteAccountantTask = {
        type: CONST_1.default.ONBOARDING_TASK_TYPE.INVITE_ACCOUNTANT,
        autoCompleted: false,
        mediaAttributes: {},
        title: ({ workspaceMembersLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.inviteAccountantTask.title', { workspaceMembersLink }),
        description: ({ workspaceMembersLink }) => (0, Localize_1.translate)(resolvedLocale, 'onboarding.tasks.inviteAccountantTask.description', { workspaceMembersLink }),
    };
    const onboardingEmployerOrSubmitMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingEmployerOrSubmitMessage'),
        tasks: [testDriveEmployeeTask, adminSubmitExpenseTask],
    };
    const combinedTrackSubmitOnboardingEmployerOrSubmitMessage = {
        ...onboardingEmployerOrSubmitMessage,
        tasks: [testDriveEmployeeTask, combinedTrackSubmitExpenseTask],
    };
    const onboardingPersonalSpendMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingPersonalSpendMessage'),
        tasks: [testDriveEmployeeTask, trackExpenseTask],
    };
    const combinedTrackSubmitOnboardingPersonalSpendMessage = {
        ...onboardingPersonalSpendMessage,
        tasks: [testDriveEmployeeTask, trackExpenseTask],
    };
    const onboardingManageTeamMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingManageTeamMessage', { hasIntroSelected }),
        tasks: [createWorkspaceTask, testDriveAdminTask, addAccountingIntegrationTask, connectCorporateCardTask, inviteTeamTask, setupCategoriesAndTags, setupCategoriesTask, setupTagsTask],
    };
    const onboardingTrackWorkspaceMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingTrackWorkspaceMessage'),
        video: {
            url: `${CONST_1.default.CLOUDFRONT_URL}/videos/guided-setup-manage-team-v2.mp4`,
            thumbnailUrl: `${CONST_1.default.CLOUDFRONT_URL}/images/guided-setup-manage-team.jpg`,
            duration: 55,
            width: 1280,
            height: 960,
        },
        tasks: [createWorkspaceTask, testDriveAdminTask, createReportTask, setupCategoriesTask, inviteAccountantTask, reviewWorkspaceSettingsTask],
    };
    const onboardingChatSplitMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingChatSplitMessage'),
        tasks: [testDriveEmployeeTask, startChatTask, splitExpenseTask],
    };
    const onboardingAdminMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingAdminMessage'),
        tasks: [reviewWorkspaceSettingsTask, adminSubmitExpenseTask],
    };
    const onboardingLookingAroundMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingLookingAroundMessage'),
        tasks: [],
    };
    const onboardingTestDriveReceiverMessage = {
        message: (0, Localize_1.translate)(resolvedLocale, 'onboarding.messages.onboardingTestDriveReceiverMessage'),
        tasks: [testDriveAdminTask, createTestDriveAdminWorkspaceTask],
    };
    return {
        onboardingMessages: {
            [CONST_1.default.ONBOARDING_CHOICES.EMPLOYER]: onboardingEmployerOrSubmitMessage,
            [CONST_1.default.ONBOARDING_CHOICES.SUBMIT]: onboardingEmployerOrSubmitMessage,
            [CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM]: onboardingManageTeamMessage,
            [CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE]: onboardingTrackWorkspaceMessage,
            [CONST_1.default.ONBOARDING_CHOICES.PERSONAL_SPEND]: onboardingPersonalSpendMessage,
            [CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT]: onboardingChatSplitMessage,
            [CONST_1.default.ONBOARDING_CHOICES.ADMIN]: onboardingAdminMessage,
            [CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND]: onboardingLookingAroundMessage,
            [CONST_1.default.ONBOARDING_CHOICES.TEST_DRIVE_RECEIVER]: onboardingTestDriveReceiverMessage,
        },
        createExpenseOnboardingMessages: {
            [CONST_1.default.CREATE_EXPENSE_ONBOARDING_CHOICES.PERSONAL_SPEND]: combinedTrackSubmitOnboardingPersonalSpendMessage,
            [CONST_1.default.CREATE_EXPENSE_ONBOARDING_CHOICES.EMPLOYER]: combinedTrackSubmitOnboardingEmployerOrSubmitMessage,
            [CONST_1.default.CREATE_EXPENSE_ONBOARDING_CHOICES.SUBMIT]: combinedTrackSubmitOnboardingEmployerOrSubmitMessage,
        },
        testDrive,
    };
};
exports.getOnboardingMessages = getOnboardingMessages;
