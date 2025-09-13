"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceAccountID_1 = require("@hooks/useWorkspaceAccountID");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceCardsListLabel_1 = require("./WorkspaceCardsListLabel");
function WorkspaceCardListLabels({ policyID, cardSettings }) {
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isMediumScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    const workspaceAccountID = (0, useWorkspaceAccountID_1.default)(policyID);
    const [cardManualBilling] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_MANUAL_BILLING}${workspaceAccountID}`, { canBeMissing: true });
    const shouldShowSettlementButtonOrDate = !!cardSettings?.isMonthlySettlementAllowed || cardManualBilling;
    const isLessThanMediumScreen = isMediumScreenWidth || isSmallScreenWidth;
    if (!isLessThanMediumScreen) {
        return (<react_native_1.View style={[styles.flexRow, styles.mt5, styles.mh5, styles.pr4]}>
                <WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE] ?? 0}/>
                <WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT] ?? 0}/>
                {!isUkEuCurrencySupported && (<WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CASH_BACK} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CASH_BACK] ?? 0}/>)}
            </react_native_1.View>);
    }
    return shouldShowSettlementButtonOrDate ? (<react_native_1.View style={[styles.flexColumn, styles.mt5, styles.mh5, styles.pr4]}>
            <WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE] ?? 0}/>
            <react_native_1.View style={[styles.flexRow, !isLessThanMediumScreen ? styles.flex2 : styles.mt5]}>
                <WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT] ?? 0}/>
                {!isUkEuCurrencySupported && (<WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CASH_BACK} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CASH_BACK] ?? 0}/>)}
            </react_native_1.View>
        </react_native_1.View>) : (<react_native_1.View style={[styles.flexColumn, styles.mt5, styles.mh5, styles.pr4]}>
            <react_native_1.View style={[styles.flexRow, isLessThanMediumScreen && styles.mb5]}>
                <WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CURRENT_BALANCE] ?? 0}/>
                <WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.REMAINING_LIMIT] ?? 0}/>
            </react_native_1.View>
            {!isUkEuCurrencySupported && (<WorkspaceCardsListLabel_1.default type={CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CASH_BACK} value={cardSettings?.[CONST_1.default.WORKSPACE_CARDS_LIST_LABEL_TYPE.CASH_BACK] ?? 0}/>)}
        </react_native_1.View>);
}
WorkspaceCardListLabels.displayName = 'WorkspaceCardListLabels';
exports.default = WorkspaceCardListLabels;
