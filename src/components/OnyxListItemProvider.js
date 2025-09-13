"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkspaceCardList = exports.useCardList = exports.useAllReportsTransactionsAndViolations = exports.usePolicyTags = exports.usePolicyCategories = exports.useSession = exports.useBlockedFromConcierge = exports.PersonalDetailsContext = exports.useBetaConfiguration = exports.useBetas = exports.BetaConfigurationContext = exports.BetasContext = exports.usePersonalDetails = void 0;
const react_1 = require("react");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ComposeProviders_1 = require("./ComposeProviders");
const createOnyxContext_1 = require("./createOnyxContext");
/**
 * IMPORTANT: this should only be used for components that are rendered in a list (e.g. FlatList, SectionList, etc.)
 * Set up any providers for individual keys. This should only be used in cases where many components will subscribe to
 * the same key (e.g. FlatList renderItem components)
 */
const [PersonalDetailsProvider, PersonalDetailsContext, usePersonalDetails] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST);
exports.PersonalDetailsContext = PersonalDetailsContext;
exports.usePersonalDetails = usePersonalDetails;
const [BlockedFromConciergeProvider, , useBlockedFromConcierge] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.NVP_BLOCKED_FROM_CONCIERGE);
exports.useBlockedFromConcierge = useBlockedFromConcierge;
const [BetasProvider, BetasContext, useBetas] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.BETAS);
exports.BetasContext = BetasContext;
exports.useBetas = useBetas;
const [BetaConfigurationProvider, BetaConfigurationContext, useBetaConfiguration] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.BETA_CONFIGURATION);
exports.BetaConfigurationContext = BetaConfigurationContext;
exports.useBetaConfiguration = useBetaConfiguration;
const [SessionProvider, , useSession] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.SESSION);
exports.useSession = useSession;
const [PolicyCategoriesProvider, , usePolicyCategories] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES);
exports.usePolicyCategories = usePolicyCategories;
const [PolicyTagsProvider, , usePolicyTags] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS);
exports.usePolicyTags = usePolicyTags;
const [ReportTransactionsAndViolationsProvider, , useAllReportsTransactionsAndViolations] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_TRANSACTIONS_AND_VIOLATIONS);
exports.useAllReportsTransactionsAndViolations = useAllReportsTransactionsAndViolations;
const [CardListProvider, , useCardList] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.CARD_LIST);
exports.useCardList = useCardList;
const [WorkspaceCardListProvider, , useWorkspaceCardList] = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST);
exports.useWorkspaceCardList = useWorkspaceCardList;
function OnyxListItemProvider(props) {
    return (<ComposeProviders_1.default components={[
            PersonalDetailsProvider,
            BlockedFromConciergeProvider,
            BetasProvider,
            BetaConfigurationProvider,
            SessionProvider,
            PolicyCategoriesProvider,
            PolicyTagsProvider,
            ReportTransactionsAndViolationsProvider,
            CardListProvider,
            WorkspaceCardListProvider,
        ]}>
            {props.children}
        </ComposeProviders_1.default>);
}
OnyxListItemProvider.displayName = 'OnyxListItemProvider';
exports.default = OnyxListItemProvider;
