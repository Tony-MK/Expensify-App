"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkspaceCardList = exports.useCardList = exports.useAllReportsTransactionsAndViolations = exports.usePolicyTags = exports.usePolicyCategories = exports.useSession = exports.useBlockedFromConcierge = exports.PersonalDetailsContext = exports.useBetaConfiguration = exports.useBetas = exports.BetaConfigurationContext = exports.BetasContext = exports.usePersonalDetails = void 0;
var react_1 = require("react");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ComposeProviders_1 = require("./ComposeProviders");
var createOnyxContext_1 = require("./createOnyxContext");
/**
 * IMPORTANT: this should only be used for components that are rendered in a list (e.g. FlatList, SectionList, etc.)
 * Set up any providers for individual keys. This should only be used in cases where many components will subscribe to
 * the same key (e.g. FlatList renderItem components)
 */
var _a = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST), PersonalDetailsProvider = _a[0], PersonalDetailsContext = _a[1], usePersonalDetails = _a[2];
exports.PersonalDetailsContext = PersonalDetailsContext;
exports.usePersonalDetails = usePersonalDetails;
var _b = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.NVP_BLOCKED_FROM_CONCIERGE), BlockedFromConciergeProvider = _b[0], useBlockedFromConcierge = _b[2];
exports.useBlockedFromConcierge = useBlockedFromConcierge;
var _c = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.BETAS), BetasProvider = _c[0], BetasContext = _c[1], useBetas = _c[2];
exports.BetasContext = BetasContext;
exports.useBetas = useBetas;
var _d = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.BETA_CONFIGURATION), BetaConfigurationProvider = _d[0], BetaConfigurationContext = _d[1], useBetaConfiguration = _d[2];
exports.BetaConfigurationContext = BetaConfigurationContext;
exports.useBetaConfiguration = useBetaConfiguration;
var _e = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.SESSION), SessionProvider = _e[0], useSession = _e[2];
exports.useSession = useSession;
var _f = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES), PolicyCategoriesProvider = _f[0], usePolicyCategories = _f[2];
exports.usePolicyCategories = usePolicyCategories;
var _g = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS), PolicyTagsProvider = _g[0], usePolicyTags = _g[2];
exports.usePolicyTags = usePolicyTags;
var _h = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_TRANSACTIONS_AND_VIOLATIONS), ReportTransactionsAndViolationsProvider = _h[0], useAllReportsTransactionsAndViolations = _h[2];
exports.useAllReportsTransactionsAndViolations = useAllReportsTransactionsAndViolations;
var _j = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.CARD_LIST), CardListProvider = _j[0], useCardList = _j[2];
exports.useCardList = useCardList;
var _k = (0, createOnyxContext_1.default)(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST), WorkspaceCardListProvider = _k[0], useWorkspaceCardList = _k[2];
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
