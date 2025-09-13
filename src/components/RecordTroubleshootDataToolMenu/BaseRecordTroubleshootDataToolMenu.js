"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_device_info_1 = require("react-native-device-info");
const react_native_release_profiler_1 = require("react-native-release-profiler");
const Button_1 = require("@components/Button");
const Switch_1 = require("@components/Switch");
const TestToolRow_1 = require("@components/TestToolRow");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Console_1 = require("@libs/actions/Console");
const ProfilingTool_1 = require("@libs/actions/ProfilingTool");
const Troubleshoot_1 = require("@libs/actions/Troubleshoot");
const Console_2 = require("@libs/Console");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const memoize_1 = require("@libs/memoize");
const Performance_1 = require("@libs/Performance");
const TestTool_1 = require("@userActions/TestTool");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const package_json_1 = require("../../../package.json");
const RNFS_1 = require("./RNFS");
const Share_1 = require("./Share");
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes.at(i)}`;
}
// WARNING: When changing this name make sure that the "scripts/symbolicate-profile.ts" script is still working!
const newFileName = `Profile_trace_for_${package_json_1.default.version}.cpuprofile`;
function BaseRecordTroubleshootDataToolMenu({ file, onDisableLogging, onEnableLogging, showShareButton = false, pathToBeUsed, zipRef, onDownloadZip, showDownloadButton = false, displayPath, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [shouldRecordTroubleshootData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_RECORD_TROUBLESHOOT_DATA, { canBeMissing: true });
    const [capturedLogs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGS, { canBeMissing: true });
    const [isProfilingInProgress] = (0, useOnyx_1.default)(ONYXKEYS_1.default.APP_PROFILING_IN_PROGRESS, { canBeMissing: true });
    const [shareUrls, setShareUrls] = (0, react_1.useState)();
    const [isDisabled, setIsDisabled] = (0, react_1.useState)(false);
    const [profileTracePath, setProfileTracePath] = (0, react_1.useState)();
    const shouldShowProfileTool = (0, react_1.useMemo)(() => (0, TestTool_1.shouldShowProfileTool)(), []);
    const onToggleProfiling = (0, react_1.useCallback)(() => {
        const shouldProfiling = !isProfilingInProgress;
        if (shouldProfiling) {
            setShareUrls(undefined);
            memoize_1.Memoize.startMonitoring();
            Performance_1.default.enableMonitoring();
            (0, react_native_release_profiler_1.startProfiling)();
        }
        else {
            Performance_1.default.disableMonitoring();
        }
        (0, ProfilingTool_1.default)(isProfilingInProgress);
        return () => {
            Performance_1.default.disableMonitoring();
        };
    }, [isProfilingInProgress]);
    const getAppInfo = (0, react_1.useCallback)(() => {
        return Promise.all([react_native_device_info_1.default.getTotalMemory(), react_native_device_info_1.default.getUsedMemory()]).then(([totalMemory, usedMemory]) => {
            return JSON.stringify({
                appVersion: package_json_1.default.version,
                environment: CONFIG_1.default.ENVIRONMENT,
                platform: (0, getPlatform_1.default)(),
                totalMemory: formatBytes(totalMemory, 2),
                usedMemory: formatBytes(usedMemory, 2),
                memoizeStats: memoize_1.Memoize.stopMonitoring(),
                performance: shouldShowProfileTool ? Performance_1.default.getPerformanceMeasures() : undefined,
            });
        });
    }, [shouldShowProfileTool]);
    const onStopProfiling = (0, react_1.useMemo)(() => (shouldShowProfileTool ? react_native_release_profiler_1.stopProfiling : () => Promise.resolve()), [shouldShowProfileTool]);
    const onToggle = () => {
        if (shouldShowProfileTool) {
            onToggleProfiling();
        }
        if (!shouldRecordTroubleshootData) {
            (0, Console_1.setShouldStoreLogs)(true);
            (0, Troubleshoot_1.setShouldRecordTroubleshootData)(true);
            if (onEnableLogging) {
                onEnableLogging();
            }
            return;
        }
        setIsDisabled(true);
        if (!capturedLogs) {
            react_native_1.Alert.alert(translate('initialSettingsPage.troubleshoot.noLogsToShare'));
            (0, Console_1.disableLoggingAndFlushLogs)();
            (0, Troubleshoot_1.setShouldRecordTroubleshootData)(false);
            return;
        }
        const logs = Object.values(capturedLogs);
        const logsWithParsedMessages = (0, Console_2.parseStringifiedMessages)(logs);
        const infoFileName = `App_Info_${package_json_1.default.version}.json`;
        if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB) {
            onStopProfiling(true, newFileName).then(() => {
                getAppInfo().then((appInfo) => {
                    zipRef.current?.file(infoFileName, appInfo);
                    onDisableLogging(logsWithParsedMessages).then(() => {
                        (0, Console_1.disableLoggingAndFlushLogs)();
                        (0, Troubleshoot_1.setShouldRecordTroubleshootData)(false);
                        setIsDisabled(false);
                        onDownloadZip?.();
                    });
                });
            });
        }
        else if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS) {
            onStopProfiling(true, newFileName).then((path) => {
                if (!path) {
                    return;
                }
                const newFilePath = `${pathToBeUsed}/${newFileName}`;
                RNFS_1.default.exists(newFilePath)
                    .then((fileExists) => {
                    if (!fileExists) {
                        return;
                    }
                    return RNFS_1.default.unlink(newFilePath).then(() => {
                        Log_1.default.hmmm('[ProfilingToolMenu] existing file deleted successfully');
                    });
                })
                    .catch((error) => {
                    const typedError = error;
                    Log_1.default.hmmm('[ProfilingToolMenu] error checking/deleting existing file: ', typedError.message);
                })
                    .then(() => {
                    RNFS_1.default.copyFile(path, newFilePath)
                        .then(() => {
                        getAppInfo().then((appInfo) => {
                            zipRef.current?.file(infoFileName, appInfo);
                            onDisableLogging(logsWithParsedMessages).then(() => {
                                (0, Console_1.disableLoggingAndFlushLogs)();
                                (0, Troubleshoot_1.setShouldRecordTroubleshootData)(false);
                                setIsDisabled(false);
                                onDownloadZip?.();
                            });
                        });
                        Log_1.default.hmmm('[ProfilingToolMenu] file copied successfully');
                        setProfileTracePath(newFilePath);
                    })
                        .catch((err) => {
                        console.error('[ProfilingToolMenu] error copying file: ', err);
                    });
                })
                    .catch((error) => {
                    console.error('[ProfilingToolMenu] error copying file: ', error);
                    Log_1.default.hmmm('[ProfilingToolMenu] error copying file: ', error);
                });
            });
        }
        else if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID) {
            onStopProfiling(true, newFileName).then((path) => {
                if (!path) {
                    return;
                }
                setProfileTracePath(path);
                getAppInfo().then((appInfo) => {
                    zipRef.current?.file(infoFileName, appInfo);
                    onDisableLogging(logsWithParsedMessages).then(() => {
                        (0, Console_1.disableLoggingAndFlushLogs)();
                        (0, Troubleshoot_1.setShouldRecordTroubleshootData)(false);
                        setIsDisabled(false);
                    });
                });
            });
        }
        else {
            // Desktop
            onStopProfiling(true, newFileName).then(() => {
                getAppInfo().then((appInfo) => {
                    zipRef.current?.file(infoFileName, appInfo);
                    onDisableLogging(logsWithParsedMessages).then(() => {
                        (0, Console_1.disableLoggingAndFlushLogs)();
                        (0, Troubleshoot_1.setShouldRecordTroubleshootData)(false);
                        setIsDisabled(false);
                    });
                });
            });
        }
    };
    (0, react_1.useEffect)(() => {
        if (!profileTracePath || !file) {
            return;
        }
        setShareUrls([`file://${profileTracePath}`, `file://${file?.path}`]);
    }, [profileTracePath, file]);
    const onShare = () => {
        Share_1.default.open({
            urls: shareUrls,
        });
    };
    return (<>
            <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.recordTroubleshootData')}>
                <Switch_1.default accessibilityLabel={translate('initialSettingsPage.troubleshoot.recordTroubleshootData')} isOn={!!shouldRecordTroubleshootData} onToggle={onToggle} disabled={isDisabled}/>
            </TestToolRow_1.default>
            {(shareUrls?.length ?? 0) > 0 && showShareButton && (<>
                    <Text_1.default style={[styles.textLabelSupporting, styles.mb4]}>{`path: ${displayPath}`}</Text_1.default>
                    <TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.results')}>
                        <Button_1.default small text={translate('common.share')} onPress={onShare}/>
                    </TestToolRow_1.default>
                </>)}
            {showDownloadButton && !!file?.path && (<TestToolRow_1.default title={translate('initialSettingsPage.troubleshoot.profileTrace')}>
                    <Button_1.default small text={translate('common.download')} onPress={onDownloadZip}/>
                </TestToolRow_1.default>)}
        </>);
}
BaseRecordTroubleshootDataToolMenu.displayName = 'BaseRecordTroubleshootDataToolMenu';
exports.default = BaseRecordTroubleshootDataToolMenu;
