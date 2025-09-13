"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceExpensifyCardListPage_1 = require("./WorkspaceExpensifyCardListPage");
const WorkspaceExpensifyCardPageEmptyState_1 = require("./WorkspaceExpensifyCardPageEmptyState");
function WorkspaceExpensifyCardPage({ route }) {
    const policyID = route.params.policyID;
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`, { canBeMissing: true });
    const [cardsList] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${defaultFundID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`, { selector: CardUtils_1.filterInactiveCards, canBeMissing: true });
    const fetchExpensifyCards = (0, react_1.useCallback)(() => {
        (0, Policy_1.openPolicyExpensifyCardsPage)(policyID, defaultFundID);
    }, [policyID, defaultFundID]);
    const { isOffline } = (0, useNetwork_1.default)({ onReconnect: fetchExpensifyCards });
    (0, react_1.useEffect)(() => {
        fetchExpensifyCards();
    }, [fetchExpensifyCards]);
    const paymentBankAccountID = cardSettings?.paymentBankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isLoading = !isOffline && (!cardSettings || cardSettings.isLoading);
    const renderContent = () => {
        if (!!isLoading && !paymentBankAccountID) {
            return (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={styles.flex1} color={theme.spinner}/>);
        }
        if (paymentBankAccountID) {
            return (<WorkspaceExpensifyCardListPage_1.default cardsList={cardsList} fundID={defaultFundID} route={route}/>);
        }
        if (!paymentBankAccountID && !isLoading) {
            return <WorkspaceExpensifyCardPageEmptyState_1.default route={route}/>;
        }
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={route.params.policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            {renderContent()}
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceExpensifyCardPage.displayName = 'WorkspaceExpensifyCardPage';
exports.default = WorkspaceExpensifyCardPage;
