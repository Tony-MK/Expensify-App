"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolumeContextProvider = VolumeContextProvider;
exports.useVolumeContext = useVolumeContext;
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const PlaybackContext_1 = require("./PlaybackContext");
const Context = react_1.default.createContext(null);
function VolumeContextProvider({ children }) {
    const { currentVideoPlayerRef, originalParent } = (0, PlaybackContext_1.usePlaybackContext)();
    const volume = (0, react_native_reanimated_1.useSharedValue)(0);
    // We need this field to remember the last value before clicking mute
    const lastNonZeroVolume = (0, react_native_reanimated_1.useSharedValue)(1);
    const updateVolume = (0, react_1.useCallback)((newVolume) => {
        if (!currentVideoPlayerRef.current) {
            return;
        }
        currentVideoPlayerRef.current.setStatusAsync({ volume: newVolume, isMuted: newVolume === 0 });
        volume.set(newVolume);
    }, [currentVideoPlayerRef, volume]);
    // This function ensures mute and unmute functionality. Overwriting lastNonZeroValue
    // only in the case of mute guarantees that a pan gesture reducing the volume to zero won’t cause
    // us to lose this value. As a result, unmute restores the last non-zero value.
    const toggleMute = (0, react_1.useCallback)(() => {
        if (volume.get() !== 0) {
            lastNonZeroVolume.set(volume.get());
        }
        updateVolume(volume.get() === 0 ? lastNonZeroVolume.get() : 0);
    }, [lastNonZeroVolume, updateVolume, volume]);
    // We want to update the volume when currently playing video changes.
    // When originalParent changed we're sure that currentVideoPlayerRef is updated. So we can apply the new volume.
    (0, react_1.useEffect)(() => {
        if (!originalParent) {
            return;
        }
        updateVolume(volume.get());
    }, [originalParent, updateVolume, volume]);
    const contextValue = (0, react_1.useMemo)(() => ({
        updateVolume,
        volume,
        lastNonZeroVolume,
        toggleMute,
    }), [updateVolume, volume, lastNonZeroVolume, toggleMute]);
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
function useVolumeContext() {
    const volumeContext = (0, react_1.useContext)(Context);
    if (!volumeContext) {
        throw new Error('useVolumeContext must be used within a VolumeContextProvider');
    }
    return volumeContext;
}
VolumeContextProvider.displayName = 'VolumeContextProvider';
