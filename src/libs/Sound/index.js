"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOUNDS = void 0;
exports.clearSoundAssetsCache = clearSoundAssetsCache;
const howler_1 = require("howler");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const BaseSound_1 = require("./BaseSound");
Object.defineProperty(exports, "SOUNDS", { enumerable: true, get: function () { return BaseSound_1.SOUNDS; } });
const config_1 = require("./config");
function cacheSoundAssets() {
    // Exit early if the Cache API is not available in the current browser.
    if (!('caches' in window)) {
        return;
    }
    // If this is Desktop app, Cache API wont work with app scheme
    if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.DESKTOP) {
        return;
    }
    caches.open('sound-assets').then((cache) => {
        const soundFiles = Object.values(BaseSound_1.SOUNDS).map((sound) => `${config_1.default.prefix}${sound}.mp3`);
        // Cache each sound file if it's not already cached.
        const cachePromises = soundFiles.map((soundFile) => {
            return cache.match(soundFile).then((response) => {
                if (response) {
                    return;
                }
                return cache.add(soundFile);
            });
        });
        return Promise.all(cachePromises);
    });
}
const initializeAndPlaySound = (src) => {
    const sound = new howler_1.Howl({
        src: [src],
        format: ['mp3'],
        onloaderror: (_id, error) => {
            Log_1.default.alert('[sound] Load error:', { message: error.message });
        },
        onplayerror: (_id, error) => {
            Log_1.default.alert('[sound] Play error:', { message: error.message });
        },
    });
    sound.play();
};
const playSound = (soundFile) => {
    if ((0, BaseSound_1.getIsMuted)()) {
        return;
    }
    const soundSrc = `${config_1.default.prefix}${soundFile}.mp3`;
    if (!('caches' in window)) {
        // Fallback to fetching from network if not in cache
        initializeAndPlaySound(soundSrc);
        return;
    }
    caches.open('sound-assets').then((cache) => {
        cache.match(soundSrc).then((response) => {
            if (response) {
                response.blob().then((soundBlob) => {
                    const soundUrl = URL.createObjectURL(soundBlob);
                    initializeAndPlaySound(soundUrl);
                });
                return;
            }
            initializeAndPlaySound(soundSrc);
        });
    });
};
function clearSoundAssetsCache() {
    // Exit early if the Cache API is not available in the current browser.
    if (!('caches' in window)) {
        return;
    }
    caches
        .delete('sound-assets')
        .then((success) => {
        if (success) {
            return;
        }
        Log_1.default.alert('[sound] Failed to clear sound assets cache.');
    })
        .catch((error) => {
        Log_1.default.alert('[sound] Error clearing sound assets cache:', { message: error.message });
    });
}
// Cache sound assets on load
cacheSoundAssets();
exports.default = (0, BaseSound_1.withMinimalExecutionTime)(playSound, 300);
