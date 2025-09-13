"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyRoomName = modifyRoomName;
const CONST_1 = require("@src/CONST");
/**
 * Replaces spaces with dashes
 */
function modifyRoomName(roomName) {
    const modifiedRoomNameWithoutHash = roomName
        .replace(/ /g, '-')
        // Replaces the smart dash on iOS devices with two hyphens
        .replace(/—/g, '--');
    return `${CONST_1.default.POLICY.ROOM_PREFIX}${modifiedRoomNameWithoutHash}`;
}
