"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Welcome_1 = require("@libs/actions/Welcome");
const CONST_1 = require("@src/CONST");
const { CONCIERGE_LHN_GBR, RENAME_SAVED_SEARCH, BOTTOM_NAV_INBOX_TOOLTIP, LHN_WORKSPACE_CHAT_TOOLTIP, GLOBAL_CREATE_TOOLTIP, SCAN_TEST_TOOLTIP, SCAN_TEST_TOOLTIP_MANAGER, SCAN_TEST_CONFIRMATION, OUTSTANDING_FILTER, GBR_RBR_CHAT, ACCOUNT_SWITCHER, EXPENSE_REPORTS_FILTER, SCAN_TEST_DRIVE_CONFIRMATION, MULTI_SCAN_EDUCATIONAL_MODAL, } = CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES;
const TOOLTIPS = {
    [CONCIERGE_LHN_GBR]: {
        content: 'productTrainingTooltip.conciergeLHNGBR',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(CONCIERGE_LHN_GBR, isDismissedUsingCloseButton),
        name: CONCIERGE_LHN_GBR,
        priority: 1300,
        // TODO: CONCIERGE_LHN_GBR tooltip will be replaced by a tooltip in the #admins room
        // https://github.com/Expensify/App/issues/57045#issuecomment-2701455668
        shouldShow: () => false,
    },
    [RENAME_SAVED_SEARCH]: {
        content: 'productTrainingTooltip.saveSearchTooltip',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(RENAME_SAVED_SEARCH, isDismissedUsingCloseButton),
        name: RENAME_SAVED_SEARCH,
        priority: 1250,
        shouldShow: ({ shouldUseNarrowLayout }) => !shouldUseNarrowLayout,
    },
    [GLOBAL_CREATE_TOOLTIP]: {
        content: 'productTrainingTooltip.globalCreateTooltip',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(GLOBAL_CREATE_TOOLTIP, isDismissedUsingCloseButton),
        name: GLOBAL_CREATE_TOOLTIP,
        priority: 1950,
        shouldShow: ({ isUserPolicyEmployee }) => isUserPolicyEmployee,
    },
    [BOTTOM_NAV_INBOX_TOOLTIP]: {
        content: 'productTrainingTooltip.bottomNavInboxTooltip',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(BOTTOM_NAV_INBOX_TOOLTIP, isDismissedUsingCloseButton),
        name: BOTTOM_NAV_INBOX_TOOLTIP,
        priority: 1700,
        shouldShow: ({ hasBeenAddedToNudgeMigration }) => hasBeenAddedToNudgeMigration,
    },
    [LHN_WORKSPACE_CHAT_TOOLTIP]: {
        content: 'productTrainingTooltip.workspaceChatTooltip',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(LHN_WORKSPACE_CHAT_TOOLTIP, isDismissedUsingCloseButton),
        name: LHN_WORKSPACE_CHAT_TOOLTIP,
        priority: 1800,
        shouldShow: ({ isUserPolicyEmployee }) => isUserPolicyEmployee,
    },
    [GBR_RBR_CHAT]: {
        content: 'productTrainingTooltip.GBRRBRChat',
        onHideTooltip: () => (0, Welcome_1.dismissProductTraining)(GBR_RBR_CHAT),
        name: GBR_RBR_CHAT,
        priority: 1900,
        shouldShow: () => true,
    },
    [ACCOUNT_SWITCHER]: {
        content: 'productTrainingTooltip.accountSwitcher',
        onHideTooltip: () => (0, Welcome_1.dismissProductTraining)(ACCOUNT_SWITCHER),
        name: ACCOUNT_SWITCHER,
        priority: 1600,
        shouldShow: () => true,
    },
    [EXPENSE_REPORTS_FILTER]: {
        content: 'productTrainingTooltip.expenseReportsFilter',
        onHideTooltip: () => (0, Welcome_1.dismissProductTraining)(EXPENSE_REPORTS_FILTER),
        name: EXPENSE_REPORTS_FILTER,
        priority: 2000,
        shouldShow: ({ shouldUseNarrowLayout, isUserPolicyAdmin, hasBeenAddedToNudgeMigration }) => !shouldUseNarrowLayout && isUserPolicyAdmin && hasBeenAddedToNudgeMigration,
    },
    [SCAN_TEST_TOOLTIP]: {
        content: 'productTrainingTooltip.scanTestTooltip.main',
        onHideTooltip: () => (0, Welcome_1.dismissProductTraining)(SCAN_TEST_TOOLTIP),
        name: SCAN_TEST_TOOLTIP,
        priority: 900,
        shouldShow: ({ isUserInPaidPolicy, hasBeenAddedToNudgeMigration }) => !isUserInPaidPolicy && !hasBeenAddedToNudgeMigration,
        shouldRenderActionButtons: true,
    },
    [SCAN_TEST_TOOLTIP_MANAGER]: {
        content: 'productTrainingTooltip.scanTestTooltip.manager',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(SCAN_TEST_TOOLTIP_MANAGER, isDismissedUsingCloseButton),
        name: SCAN_TEST_TOOLTIP_MANAGER,
        priority: 1000,
        shouldShow: ({ hasBeenAddedToNudgeMigration }) => !hasBeenAddedToNudgeMigration,
    },
    [SCAN_TEST_CONFIRMATION]: {
        content: 'productTrainingTooltip.scanTestTooltip.confirmation',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(SCAN_TEST_CONFIRMATION, isDismissedUsingCloseButton),
        name: SCAN_TEST_CONFIRMATION,
        priority: 1100,
        shouldShow: ({ hasBeenAddedToNudgeMigration }) => !hasBeenAddedToNudgeMigration,
    },
    [OUTSTANDING_FILTER]: {
        content: 'productTrainingTooltip.outstandingFilter',
        onHideTooltip: () => (0, Welcome_1.dismissProductTraining)(OUTSTANDING_FILTER),
        name: OUTSTANDING_FILTER,
        priority: 1925,
        shouldShow: ({ isUserPolicyAdmin }) => isUserPolicyAdmin,
    },
    [SCAN_TEST_DRIVE_CONFIRMATION]: {
        content: 'productTrainingTooltip.scanTestDriveTooltip',
        onHideTooltip: (isDismissedUsingCloseButton = false) => (0, Welcome_1.dismissProductTraining)(SCAN_TEST_DRIVE_CONFIRMATION, isDismissedUsingCloseButton),
        name: SCAN_TEST_DRIVE_CONFIRMATION,
        priority: 1200,
        shouldShow: () => true,
    },
};
exports.default = TOOLTIPS;
