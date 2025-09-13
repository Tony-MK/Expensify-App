"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PlaidCardFeedIcon_1 = require("@components/PlaidCardFeedIcon");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useTheme_1 = require("@hooks/useTheme");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const Navigation_1 = require("@navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const variables_1 = require("@styles/variables");
const CompanyCards_1 = require("@userActions/CompanyCards");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const utils_1 = require("./utils");
function WorkspaceCompanyCardDetailsPage({ route }) {
    const { policyID, cardID, backTo } = route.params;
    const bank = decodeURIComponent(route.params.bank);
    const [connectionSyncProgress] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID}`, { canBeMissing: true });
    const [customCardNames] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_EXPENSIFY_COMPANY_CARDS_CUSTOM_NAMES, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = policy?.workspaceAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [isUnassignModalVisible, setIsUnassignModalVisible] = (0, react_1.useState)(false);
    const { translate, getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const accountingIntegrations = Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy, accountingIntegrations) ?? connectionSyncProgress?.connectionName;
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [allBankCards, allBankCardsMetadata] = (0, useCardsList_1.default)(policyID, bank);
    const card = allBankCards?.[cardID];
    const cardBank = card?.bank ?? '';
    const cardholder = personalDetails?.[card?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
    const displayName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(cardholder);
    const exportMenuItem = (0, utils_1.getExportMenuItem)(connectedIntegration, policyID, translate, policy, card);
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, companyFeeds[bank]);
    const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(bank);
    const unassignCard = () => {
        setIsUnassignModalVisible(false);
        if (card) {
            (0, CompanyCards_1.unassignWorkspaceCompanyCard)(domainOrWorkspaceAccountID, bank, card);
        }
        Navigation_1.default.goBack();
    };
    const updateCard = () => {
        (0, CompanyCards_1.updateWorkspaceCompanyCard)(domainOrWorkspaceAccountID, cardID, bank, card?.lastScrapeResult);
    };
    const lastScrape = (0, react_1.useMemo)(() => {
        if (!card?.lastScrape) {
            return '';
        }
        return (0, date_fns_1.format)(getLocalDateFromDatetime(card?.lastScrape), CONST_1.default.DATE.FNS_DATE_TIME_FORMAT_STRING);
    }, [getLocalDateFromDatetime, card?.lastScrape]);
    if (!card && !(0, isLoadingOnyxValue_1.default)(allBankCardsMetadata)) {
        return <NotFoundPage_1.default />;
    }
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding testID={WorkspaceCompanyCardDetailsPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.moreFeatures.companyCards.cardDetails')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                <ScrollView_1.default addBottomSafeAreaPadding>
                    <react_native_1.View style={[styles.walletCard, styles.mb3]}>
                        {plaidUrl ? (<PlaidCardFeedIcon_1.default plaidUrl={plaidUrl} isLarge/>) : (<ImageSVG_1.default contentFit="contain" src={(0, CardUtils_1.getCardFeedIcon)(cardBank, illustrations)} pointerEvents="none" height={variables_1.default.cardPreviewHeight} width={variables_1.default.cardPreviewWidth}/>)}
                    </react_native_1.View>

                    <MenuItem_1.default label={translate('workspace.moreFeatures.companyCards.cardholder')} title={displayName} icon={cardholder?.avatar ?? Expensicons_1.FallbackAvatar} iconType={CONST_1.default.ICON_TYPE_AVATAR} description={cardholder?.login} interactive={false}/>
                    <MenuItemWithTopDescription_1.default numberOfLinesTitle={3} description={translate('workspace.moreFeatures.companyCards.cardNumber')} title={(0, CardUtils_1.maskCardNumber)(card?.cardName ?? '', bank, true)} interactive={false} titleStyle={styles.walletCardNumber}/>
                    <OfflineWithFeedback_1.default pendingAction={card?.nameValuePairs?.pendingFields?.cardTitle} errorRowStyles={[styles.ph5, styles.mb3]} errors={(0, ErrorUtils_1.getLatestErrorField)(card?.nameValuePairs ?? {}, 'cardTitle')} onClose={() => (0, CompanyCards_1.clearCompanyCardErrorField)(domainOrWorkspaceAccountID, cardID, bank, 'cardTitle')}>
                        <MenuItemWithTopDescription_1.default description={translate('workspace.moreFeatures.companyCards.cardName')} title={customCardNames?.[cardID] ?? (0, CardUtils_1.getDefaultCardName)(cardholder?.firstName)} shouldShowRightIcon brickRoadIndicator={card?.nameValuePairs?.errorFields?.cardTitle ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARD_NAME.getRoute(policyID, cardID, bank))}/>
                    </OfflineWithFeedback_1.default>
                    {exportMenuItem?.shouldShowMenuItem ? (<OfflineWithFeedback_1.default pendingAction={exportMenuItem?.exportType ? card?.nameValuePairs?.pendingFields?.[exportMenuItem.exportType] : undefined} errorRowStyles={[styles.ph5, styles.mb3]} errors={exportMenuItem.exportType ? (0, ErrorUtils_1.getLatestErrorField)(card?.nameValuePairs ?? {}, exportMenuItem.exportType) : undefined} onClose={() => {
                if (!exportMenuItem.exportType) {
                    return;
                }
                (0, CompanyCards_1.clearCompanyCardErrorField)(domainOrWorkspaceAccountID, cardID, bank, exportMenuItem.exportType);
            }}>
                            <MenuItemWithTopDescription_1.default description={exportMenuItem.description} title={exportMenuItem.title} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARD_EXPORT.getRoute(policyID, cardID, bank, backTo))}/>
                        </OfflineWithFeedback_1.default>) : null}
                    <MenuItemWithTopDescription_1.default shouldShowRightComponent={card?.isLoadingLastUpdated} rightComponent={<react_native_1.ActivityIndicator style={[styles.popoverMenuIcon]} color={theme.spinner}/>} description={translate('workspace.moreFeatures.companyCards.lastUpdated')} title={card?.isLoadingLastUpdated ? translate('workspace.moreFeatures.companyCards.updating') : lastScrape} interactive={false}/>
                    <MenuItemWithTopDescription_1.default description={translate('workspace.moreFeatures.companyCards.transactionStartDate')} title={card?.scrapeMinDate ? (0, date_fns_1.format)((0, date_fns_1.parseISO)(card.scrapeMinDate), CONST_1.default.DATE.FNS_FORMAT_STRING) : ''} interactive={false}/>
                    <MenuItem_1.default icon={Expensicons.MoneySearch} title={translate('workspace.common.viewTransactions')} style={styles.mt3} onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                query: (0, SearchQueryUtils_1.buildCannedSearchQuery)({ type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, cardID }),
            }));
        }}/>
                    <OfflineWithFeedback_1.default pendingAction={card?.pendingFields?.lastScrape} errorRowStyles={[styles.ph5, styles.mb3]} errors={(0, ErrorUtils_1.getLatestErrorField)(card ?? {}, 'lastScrape')} onClose={() => (0, CompanyCards_1.clearCompanyCardErrorField)(domainOrWorkspaceAccountID, cardID, bank, 'lastScrape', true)}>
                        <MenuItem_1.default icon={Expensicons.Sync} disabled={isOffline || card?.isLoadingLastUpdated} title={translate('workspace.moreFeatures.companyCards.updateCard')} brickRoadIndicator={card?.errorFields?.lastScrape ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} onPress={updateCard}/>
                    </OfflineWithFeedback_1.default>
                    <MenuItem_1.default icon={Expensicons.RemoveMembers} title={translate('workspace.moreFeatures.companyCards.unassignCard')} style={styles.mb1} onPress={() => setIsUnassignModalVisible(true)}/>
                    <ConfirmModal_1.default title={translate('workspace.moreFeatures.companyCards.unassignCard')} isVisible={isUnassignModalVisible} onConfirm={unassignCard} onCancel={() => setIsUnassignModalVisible(false)} shouldSetModalVisibility={false} prompt={translate('workspace.moreFeatures.companyCards.unassignCardDescription')} confirmText={translate('workspace.moreFeatures.companyCards.unassign')} cancelText={translate('common.cancel')} danger/>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCompanyCardDetailsPage.displayName = 'WorkspaceCompanyCardDetailsPage';
exports.default = WorkspaceCompanyCardDetailsPage;
