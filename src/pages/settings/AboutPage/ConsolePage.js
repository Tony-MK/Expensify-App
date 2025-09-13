"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const InvertedFlatList_1 = require("@components/InvertedFlatList");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Console_1 = require("@libs/actions/Console");
const Console_2 = require("@libs/Console");
const localFileCreate_1 = require("@libs/localFileCreate");
const localFileDownload_1 = require("@libs/localFileDownload");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const filterBy = {
    all: '',
    network: '[Network]',
};
function ConsolePage() {
    const [capturedLogs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGS, { canBeMissing: false });
    const [shouldStoreLogs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_STORE_LOGS, { canBeMissing: true });
    const [input, setInput] = (0, react_1.useState)('');
    const [isGeneratingLogsFile, setIsGeneratingLogsFile] = (0, react_1.useState)(false);
    const [isLimitModalVisible, setIsLimitModalVisible] = (0, react_1.useState)(false);
    const [activeFilterIndex, setActiveFilterIndex] = (0, react_1.useState)(filterBy.all);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const route = (0, native_1.useRoute)();
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    const menuItems = (0, react_1.useMemo)(() => [
        {
            text: translate('common.filterLogs'),
            disabled: true,
        },
        {
            icon: Expensicons.All,
            text: translate('common.all'),
            iconFill: activeFilterIndex === filterBy.all ? theme.iconSuccessFill : theme.icon,
            iconRight: Expensicons.Checkmark,
            shouldShowRightIcon: activeFilterIndex === filterBy.all,
            success: activeFilterIndex === filterBy.all,
            onSelected: () => {
                setActiveFilterIndex(filterBy.all);
            },
        },
        {
            icon: Expensicons.Globe,
            text: translate('common.network'),
            iconFill: activeFilterIndex === filterBy.network ? theme.iconSuccessFill : theme.icon,
            iconRight: Expensicons.CheckCircle,
            shouldShowRightIcon: activeFilterIndex === filterBy.network,
            success: activeFilterIndex === filterBy.network,
            onSelected: () => {
                setActiveFilterIndex(filterBy.network);
            },
        },
    ], [activeFilterIndex, theme.icon, theme.iconSuccessFill, translate]);
    const prevLogs = (0, react_1.useRef)({});
    const getLogs = (0, react_1.useCallback)(() => {
        if (!shouldStoreLogs) {
            return [];
        }
        prevLogs.current = { ...prevLogs.current, ...capturedLogs };
        return Object.entries(prevLogs.current ?? {})
            .map(([key, value]) => ({ key, ...value }))
            .reverse();
    }, [capturedLogs, shouldStoreLogs]);
    // eslint-disable-next-line react-compiler/react-compiler
    const logsList = (0, react_1.useMemo)(() => getLogs(), [getLogs]);
    const filteredLogsList = (0, react_1.useMemo)(() => logsList.filter((log) => log.message.includes(activeFilterIndex)), [activeFilterIndex, logsList]);
    const executeArbitraryCode = () => {
        const sanitizedInput = (0, Console_2.sanitizeConsoleInput)(input);
        const output = (0, Console_2.createLog)(sanitizedInput);
        output.forEach((log) => (0, Console_1.addLog)(log));
        setInput('');
    };
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, executeArbitraryCode);
    const saveLogs = () => {
        const logsWithParsedMessages = (0, Console_2.parseStringifiedMessages)(filteredLogsList);
        (0, localFileDownload_1.default)('logs', JSON.stringify(logsWithParsedMessages, null, 2));
    };
    const shareLogs = () => {
        setIsGeneratingLogsFile(true);
        const logsWithParsedMessages = (0, Console_2.parseStringifiedMessages)(filteredLogsList);
        // Generate a file with the logs and pass its path to the list of reports to share it with
        (0, localFileCreate_1.default)('logs', JSON.stringify(logsWithParsedMessages, null, 2)).then(({ path, size }) => {
            setIsGeneratingLogsFile(false);
            // if the file size is too large to send it as an attachment, show a modal and return
            if (size > CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE) {
                setIsLimitModalVisible(true);
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SHARE_LOG.getRoute(path));
        });
    };
    const renderItem = (0, react_1.useCallback)(({ item }) => {
        if (!item) {
            return null;
        }
        return (<react_native_1.View style={styles.mb2}>
                    <Text_1.default family="MONOSPACE">{`${(0, date_fns_1.format)(new Date(item.time), CONST_1.default.DATE.FNS_DB_FORMAT_STRING)} ${item.message}`}</Text_1.default>
                </react_native_1.View>);
    }, [styles.mb2]);
    return (<ScreenWrapper_1.default testID={ConsolePage.displayName} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('initialSettingsPage.troubleshoot.debugConsole')} onBackButtonPress={() => Navigation_1.default.goBack(route.params?.backTo)} shouldShowThreeDotsButton threeDotsMenuItems={menuItems} threeDotsMenuIcon={Expensicons.Filter} threeDotsMenuIconFill={theme.icon}/>
            <react_native_1.View style={[styles.border, styles.highlightBG, styles.borderNone, styles.mh5, styles.flex1]}>
                <InvertedFlatList_1.default data={filteredLogsList} renderItem={renderItem} contentContainerStyle={styles.p5} ListEmptyComponent={<Text_1.default>{translate('initialSettingsPage.debugConsole.noLogsAvailable')}</Text_1.default>}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.dFlex, styles.flexRow, styles.m5]}>
                <Button_1.default text={translate('initialSettingsPage.debugConsole.saveLog')} onPress={saveLogs} large icon={Expensicons.Download} style={[styles.flex1, styles.mr1]}/>
                {isAuthenticated && (<Button_1.default text={translate('initialSettingsPage.debugConsole.shareLog')} onPress={shareLogs} large icon={!isGeneratingLogsFile ? Expensicons.UploadAlt : undefined} style={[styles.flex1, styles.ml1]} isLoading={isGeneratingLogsFile}/>)}
            </react_native_1.View>
            <react_native_1.View style={[styles.mh5]}>
                <TextInput_1.default onChangeText={setInput} value={input} placeholder={translate('initialSettingsPage.debugConsole.enterCommand')} autoGrowHeight autoCorrect={false} accessibilityRole="text"/>
                <Button_1.default success text={translate('initialSettingsPage.debugConsole.execute')} onPress={executeArbitraryCode} style={[styles.mv5]} large/>
            </react_native_1.View>
            <ConfirmModal_1.default title={translate('initialSettingsPage.debugConsole.shareLog')} isVisible={isLimitModalVisible} onConfirm={() => setIsLimitModalVisible(false)} onCancel={() => setIsLimitModalVisible(false)} prompt={translate('initialSettingsPage.debugConsole.logSizeTooLarge', {
            size: CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE / 1024 / 1024,
        })} shouldShowCancelButton={false} confirmText={translate('common.ok')}/>
        </ScreenWrapper_1.default>);
}
ConsolePage.displayName = 'ConsolePage';
exports.default = ConsolePage;
