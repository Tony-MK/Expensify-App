"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ActionCell_1 = require("./ActionCell");
const UserInfoCellsWithArrow_1 = require("./UserInfoCellsWithArrow");
function UserInfoAndActionButtonRow({ item, handleActionButtonPress, shouldShowUserInfo, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const hasFromSender = !!item?.from && !!item?.from?.accountID && !!item?.from?.displayName;
    const hasToRecipient = !!item?.to && !!item?.to?.accountID && !!item?.to?.displayName;
    const participantFromDisplayName = item?.from?.displayName ?? item?.from?.login ?? translate('common.hidden');
    const participantToDisplayName = item?.to?.displayName ?? item?.to?.login ?? translate('common.hidden');
    const shouldShowToRecipient = hasFromSender && hasToRecipient && !!item?.to?.accountID && !!(0, SearchUIUtils_1.isCorrectSearchUserName)(participantToDisplayName);
    return (<react_native_1.View style={[styles.pt0, styles.flexRow, styles.alignItemsCenter, shouldShowUserInfo ? styles.justifyContentBetween : styles.justifyContentEnd, styles.gap2, styles.ph3]}>
            {shouldShowUserInfo && (<UserInfoCellsWithArrow_1.default shouldShowToRecipient={shouldShowToRecipient} participantFrom={item?.from} participantFromDisplayName={participantFromDisplayName} participantToDisplayName={participantToDisplayName} participantTo={item?.to} avatarSize={CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT} style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]} infoCellsTextStyle={{ ...styles.textMicroBold, lineHeight: 14 }} infoCellsAvatarStyle={styles.pr1} fromRecipientStyle={!shouldShowToRecipient ? styles.mw100 : {}}/>)}
            <react_native_1.View style={[{ width: variables_1.default.w80 }, styles.alignItemsEnd]}>
                <ActionCell_1.default action={item.action} goToItem={handleActionButtonPress} isSelected={item.isSelected} isLoading={item.isActionLoading} policyID={item.policyID} reportID={item.reportID} hash={item.hash} amount={item?.amount ?? item?.total}/>
            </react_native_1.View>
        </react_native_1.View>);
}
exports.default = UserInfoAndActionButtonRow;
