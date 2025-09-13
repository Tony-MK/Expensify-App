"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const computer_svg_1 = require("@assets/images/computer.svg");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const MenuItemList_1 = require("@components/MenuItemList");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const fileDownload_1 = require("@libs/fileDownload");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctPrerequisitesPage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const popoverAnchor = (0, react_1.useRef)(null);
    const policyID = route.params.policyID;
    const backTo = route.params.backTo;
    const menuItems = (0, react_1.useMemo)(() => [
        {
            title: translate('workspace.intacct.downloadExpensifyPackage'),
            key: 'workspace.intacct.downloadExpensifyPackage',
            icon: Expensicons.Download,
            iconRight: Expensicons.NewWindow,
            shouldShowRightIcon: true,
            onPress: () => {
                (0, fileDownload_1.default)(CONST_1.default.EXPENSIFY_PACKAGE_FOR_SAGE_INTACCT, CONST_1.default.EXPENSIFY_PACKAGE_FOR_SAGE_INTACCT_FILE_NAME, '', true);
            },
            onSecondaryInteraction: (event) => (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event,
                selection: CONST_1.default.EXPENSIFY_PACKAGE_FOR_SAGE_INTACCT,
                contextMenuAnchor: popoverAnchor.current,
            }),
            numberOfLinesTitle: 2,
        },
        {
            title: translate('workspace.intacct.followSteps'),
            key: 'workspace.intacct.followSteps',
            icon: Expensicons.Task,
            iconRight: Expensicons.NewWindow,
            shouldShowRightIcon: true,
            onPress: () => {
                (0, Link_1.openExternalLink)(CONST_1.default.HOW_TO_CONNECT_TO_SAGE_INTACCT);
            },
            onSecondaryInteraction: (event) => (0, ReportActionContextMenu_1.showContextMenu)({
                type: CONST_1.default.CONTEXT_MENU_TYPES.LINK,
                event,
                selection: CONST_1.default.HOW_TO_CONNECT_TO_SAGE_INTACCT,
                contextMenuAnchor: popoverAnchor.current,
            }),
            numberOfLinesTitle: 3,
        },
    ], [translate]);
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={SageIntacctPrerequisitesPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default title={translate('workspace.intacct.sageIntacctSetup')} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <react_native_1.View style={styles.flex1}>
                <react_native_1.View style={[styles.alignSelfCenter, styles.computerIllustrationContainer]}>
                    <ImageSVG_1.default src={computer_svg_1.default}/>
                </react_native_1.View>

                <Text_1.default style={[styles.textHeadlineH1, styles.p5, styles.p6]}>{translate('workspace.intacct.prerequisitesTitle')}</Text_1.default>
                <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>

                <FixedFooter_1.default style={[styles.mtAuto]} addBottomSafeAreaPadding>
                    <Button_1.default success text={translate('common.next')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ENTER_CREDENTIALS.getRoute(policyID))} pressOnEnter large/>
                </FixedFooter_1.default>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SageIntacctPrerequisitesPage.displayName = 'SageIntacctPrerequisitesPage';
exports.default = SageIntacctPrerequisitesPage;
