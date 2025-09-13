"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPopoverMenuContextProvider = VideoPopoverMenuContextProvider;
exports.useVideoPopoverMenuContext = useVideoPopoverMenuContext;
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const fileDownload_1 = require("@libs/fileDownload");
const CONST_1 = require("@src/CONST");
const Context = react_1.default.createContext(null);
function VideoPopoverMenuContextProvider({ children }) {
    const { translate } = (0, useLocalize_1.default)();
    const [source, setSource] = (0, react_1.useState)('');
    const [currentPlaybackSpeed, setCurrentPlaybackSpeed] = (0, react_1.useState)(CONST_1.default.VIDEO_PLAYER.PLAYBACK_SPEEDS[3]);
    const { isOffline } = (0, useNetwork_1.default)();
    const isLocalFile = source && CONST_1.default.ATTACHMENT_LOCAL_URL_PREFIX.some((prefix) => source.startsWith(prefix));
    const videoPopoverMenuPlayerRef = (0, react_1.useRef)(null);
    const updatePlaybackSpeed = (0, react_1.useCallback)((speed) => {
        setCurrentPlaybackSpeed(speed);
        videoPopoverMenuPlayerRef.current?.setStatusAsync?.({ rate: speed });
    }, [videoPopoverMenuPlayerRef]);
    const downloadAttachment = (0, react_1.useCallback)(() => {
        if (typeof source === 'number' || !source) {
            return;
        }
        (0, fileDownload_1.default)((0, addEncryptedAuthTokenToURL_1.default)(source));
    }, [source]);
    const menuItems = (0, react_1.useMemo)(() => {
        const items = [];
        if (!isOffline && !isLocalFile) {
            // eslint-disable-next-line react-compiler/react-compiler
            items.push({
                icon: Expensicons.Download,
                text: translate('common.download'),
                onSelected: () => {
                    downloadAttachment();
                },
            });
        }
        items.push({
            icon: Expensicons.Meter,
            text: translate('videoPlayer.playbackSpeed'),
            subMenuItems: CONST_1.default.VIDEO_PLAYER.PLAYBACK_SPEEDS.map((speed) => ({
                icon: currentPlaybackSpeed === speed ? Expensicons.Checkmark : undefined,
                text: speed === 1 ? translate('videoPlayer.normal') : speed.toString(),
                onSelected: () => {
                    updatePlaybackSpeed(speed);
                },
                shouldPutLeftPaddingWhenNoIcon: true,
                isSelected: currentPlaybackSpeed === speed,
            })),
        });
        return items;
    }, [currentPlaybackSpeed, downloadAttachment, translate, updatePlaybackSpeed, isOffline, isLocalFile]);
    const contextValue = (0, react_1.useMemo)(() => ({ menuItems, videoPopoverMenuPlayerRef, currentPlaybackSpeed, updatePlaybackSpeed, setCurrentPlaybackSpeed, setSource }), [menuItems, videoPopoverMenuPlayerRef, currentPlaybackSpeed, updatePlaybackSpeed, setCurrentPlaybackSpeed, setSource]);
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
function useVideoPopoverMenuContext() {
    const videoPopoverMenuContext = (0, react_1.useContext)(Context);
    if (!videoPopoverMenuContext) {
        throw new Error('useVideoPopoverMenuContext must be used within a VideoPopoverMenuContext');
    }
    return videoPopoverMenuContext;
}
VideoPopoverMenuContextProvider.displayName = 'VideoPopoverMenuContextProvider';
