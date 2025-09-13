"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RenderHTML_1 = require("@components/RenderHTML");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useCardsList_1 = require("@hooks/useCardsList");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const CompanyCards_1 = require("@libs/actions/CompanyCards");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const utils_1 = require("./utils");
function WorkspaceCompanyCardAccountSelectCardPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const { policyID, cardID, backTo } = route.params;
    const bank = decodeURIComponent(route.params.bank);
    const policy = (0, usePolicy_1.default)(policyID);
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [allBankCards] = (0, useCardsList_1.default)(policyID, bank);
    const card = allBankCards?.[cardID];
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy) ?? CONST_1.default.POLICY.CONNECTIONS.NAME.QBO;
    const exportMenuItem = (0, utils_1.getExportMenuItem)(connectedIntegration, policyID, translate, policy, card, Navigation_1.default.getActiveRoute());
    const currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    const shouldShowTextInput = (exportMenuItem?.data?.length ?? 0) >= CONST_1.default.STANDARD_LIST_ITEM_LIMIT;
    const defaultCard = translate('workspace.moreFeatures.companyCards.defaultCard');
    const isXeroConnection = connectedIntegration === CONST_1.default.POLICY.CONNECTIONS.NAME.XERO;
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const domainOrWorkspaceAccountID = (0, CardUtils_1.getDomainOrWorkspaceAccountID)(workspaceAccountID, companyFeeds[bank]);
    const searchedListOptions = (0, react_1.useMemo)(() => {
        return (0, tokenizedSearch_1.default)(exportMenuItem?.data ?? [], searchText, (option) => [option.value]);
    }, [exportMenuItem?.data, searchText]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.moreFeatures.companyCards.noAccountsFound')} subtitle={currentConnectionName ? translate('workspace.moreFeatures.companyCards.noAccountsFoundDescription', { connection: currentConnectionName }) : undefined} containerStyle={styles.pb10}/>), [translate, currentConnectionName, styles]);
    const updateExportAccount = (0, react_1.useCallback)(({ value }) => {
        if (!exportMenuItem?.exportType) {
            return;
        }
        const isDefaultCardSelected = value === defaultCard;
        const exportValue = isDefaultCardSelected ? CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE : value;
        (0, CompanyCards_1.setCompanyCardExportAccount)(policyID, domainOrWorkspaceAccountID, cardID, exportMenuItem.exportType, exportValue, bank);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, cardID, bank));
    }, [exportMenuItem?.exportType, domainOrWorkspaceAccountID, cardID, policyID, bank, defaultCard]);
    return (<SelectionScreen_1.default policyID={policyID} headerContent={<react_native_1.View style={[styles.mh5, styles.mb3]}>
                    {!!exportMenuItem?.description && (<react_native_1.View style={[styles.renderHTML, styles.flexRow]}>
                            <RenderHTML_1.default html={isXeroConnection
                    ? translate('workspace.moreFeatures.companyCards.integrationExportTitleXero', { integration: exportMenuItem.description })
                    : translate('workspace.moreFeatures.companyCards.integrationExportTitle', {
                        integration: exportMenuItem.description,
                        exportPageLink: `${environmentURL}/${exportMenuItem.exportPageLink}`,
                    })}/>
                        </react_native_1.View>)}
                </react_native_1.View>} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED} displayName={WorkspaceCompanyCardAccountSelectCardPage.displayName} sections={[{ data: searchedListOptions ?? [] }]} listItem={RadioListItem_1.default} textInputLabel={translate('common.search')} textInputValue={searchText} onChangeText={setSearchText} onSelectRow={updateExportAccount} initiallyFocusedOptionKey={exportMenuItem?.data?.find((mode) => mode.isSelected)?.keyForList} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, cardID, bank, backTo), { compareParams: false })} headerTitleAlreadyTranslated={exportMenuItem?.description} listEmptyContent={listEmptyContent} connectionName={connectedIntegration} shouldShowTextInput={shouldShowTextInput}/>);
}
WorkspaceCompanyCardAccountSelectCardPage.displayName = 'WorkspaceCompanyCardAccountSelectCardPage';
exports.default = WorkspaceCompanyCardAccountSelectCardPage;
