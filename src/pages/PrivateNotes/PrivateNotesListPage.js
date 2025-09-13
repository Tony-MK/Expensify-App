"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const AttachmentContext_1 = require("@components/AttachmentContext");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const withReportAndPrivateNotesOrNotFound_1 = require("@pages/home/report/withReportAndPrivateNotesOrNotFound");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function PrivateNotesListPage({ report, accountID: sessionAccountID }) {
    const route = (0, native_1.useRoute)();
    const backTo = route.params.backTo;
    const [personalDetailsList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const getAttachmentValue = (0, react_1.useCallback)((item) => ({ reportID: item.reportID, accountID: Number(item.accountID), type: CONST_1.default.ATTACHMENT_TYPE.NOTE }), []);
    /**
     * Gets the menu item for each workspace
     */
    function getMenuItem(item) {
        return (<AttachmentContext_1.AttachmentContext.Provider value={getAttachmentValue(item)}>
                <MenuItemWithTopDescription_1.default key={item.title} description={item.title} title={item.note} onPress={item.action} shouldShowRightIcon={!item.disabled} numberOfLinesTitle={0} shouldRenderAsHTML brickRoadIndicator={item.brickRoadIndicator} disabled={item.disabled} shouldGreyOutWhenDisabled={false}/>
            </AttachmentContext_1.AttachmentContext.Provider>);
    }
    /**
     * Returns a list of private notes on the given chat report
     */
    const privateNotes = (0, react_1.useMemo)(() => {
        const privateNoteBrickRoadIndicator = (accountID) => (report.privateNotes?.[accountID].errors ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined);
        return Object.keys(report.privateNotes ?? {}).map((privateNoteAccountID) => {
            const accountID = Number(privateNoteAccountID);
            const privateNote = report.privateNotes?.[accountID];
            return {
                reportID: report.reportID,
                accountID: privateNoteAccountID,
                title: Number(sessionAccountID) === accountID ? translate('privateNotes.myNote') : (personalDetailsList?.[privateNoteAccountID]?.login ?? ''),
                action: () => Navigation_1.default.navigate(ROUTES_1.default.PRIVATE_NOTES_EDIT.getRoute(report.reportID, accountID, backTo)),
                brickRoadIndicator: privateNoteBrickRoadIndicator(accountID),
                note: privateNote?.note ?? '',
                disabled: Number(sessionAccountID) !== accountID,
            };
        });
    }, [report, personalDetailsList, sessionAccountID, translate, backTo]);
    return (<ScreenWrapper_1.default testID={PrivateNotesListPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('privateNotes.title')} shouldShowBackButton onBackButtonPress={() => (0, ReportUtils_1.goBackToDetailsPage)(report, route.params.backTo, true)} onCloseButtonPress={() => Navigation_1.default.dismissModal()}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1} bounces={false}>
                <Text_1.default style={[styles.mb5, styles.ph5]}>{translate('privateNotes.personalNoteMessage')}</Text_1.default>
                {privateNotes.map((item) => getMenuItem(item))}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
PrivateNotesListPage.displayName = 'PrivateNotesListPage';
exports.default = (0, withReportAndPrivateNotesOrNotFound_1.default)('privateNotes.title')(PrivateNotesListPage);
