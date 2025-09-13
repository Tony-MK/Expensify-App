"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOUNDS = void 0;
exports.clearSoundAssetsCache = clearSoundAssetsCache;
const react_native_sound_1 = require("react-native-sound");
const BaseSound_1 = require("./BaseSound");
Object.defineProperty(exports, "SOUNDS", { enumerable: true, get: function () { return BaseSound_1.SOUNDS; } });
const config_1 = require("./config");
const playSound = (soundFile) => {
    const sound = new react_native_sound_1.default(`${config_1.default.prefix}${soundFile}.mp3`, react_native_sound_1.default.MAIN_BUNDLE, (error) => {
        if (error || (0, BaseSound_1.getIsMuted)()) {
            return;
        }
        sound.play();
    });
};
function clearSoundAssetsCache() { }
exports.default = (0, BaseSound_1.withMinimalExecutionTime)(playSound, 300);
