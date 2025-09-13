"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_avatar_1_svg_1 = require("@assets/images/avatars/user/default-avatar_1.svg");
const default_avatar_2_svg_1 = require("@assets/images/avatars/user/default-avatar_2.svg");
const default_avatar_3_svg_1 = require("@assets/images/avatars/user/default-avatar_3.svg");
const default_avatar_4_svg_1 = require("@assets/images/avatars/user/default-avatar_4.svg");
const default_avatar_5_svg_1 = require("@assets/images/avatars/user/default-avatar_5.svg");
const default_avatar_6_svg_1 = require("@assets/images/avatars/user/default-avatar_6.svg");
const default_avatar_7_svg_1 = require("@assets/images/avatars/user/default-avatar_7.svg");
const default_avatar_8_svg_1 = require("@assets/images/avatars/user/default-avatar_8.svg");
const default_avatar_9_svg_1 = require("@assets/images/avatars/user/default-avatar_9.svg");
const default_avatar_10_svg_1 = require("@assets/images/avatars/user/default-avatar_10.svg");
const default_avatar_11_svg_1 = require("@assets/images/avatars/user/default-avatar_11.svg");
const default_avatar_12_svg_1 = require("@assets/images/avatars/user/default-avatar_12.svg");
const default_avatar_13_svg_1 = require("@assets/images/avatars/user/default-avatar_13.svg");
const default_avatar_14_svg_1 = require("@assets/images/avatars/user/default-avatar_14.svg");
const default_avatar_15_svg_1 = require("@assets/images/avatars/user/default-avatar_15.svg");
const default_avatar_16_svg_1 = require("@assets/images/avatars/user/default-avatar_16.svg");
const default_avatar_17_svg_1 = require("@assets/images/avatars/user/default-avatar_17.svg");
const default_avatar_18_svg_1 = require("@assets/images/avatars/user/default-avatar_18.svg");
const default_avatar_19_svg_1 = require("@assets/images/avatars/user/default-avatar_19.svg");
const default_avatar_20_svg_1 = require("@assets/images/avatars/user/default-avatar_20.svg");
const default_avatar_21_svg_1 = require("@assets/images/avatars/user/default-avatar_21.svg");
const default_avatar_22_svg_1 = require("@assets/images/avatars/user/default-avatar_22.svg");
const default_avatar_23_svg_1 = require("@assets/images/avatars/user/default-avatar_23.svg");
const default_avatar_24_svg_1 = require("@assets/images/avatars/user/default-avatar_24.svg");
const StringUtils_1 = require("./StringUtils");
const avatars = [
    default_avatar_1_svg_1.default,
    default_avatar_2_svg_1.default,
    default_avatar_3_svg_1.default,
    default_avatar_4_svg_1.default,
    default_avatar_5_svg_1.default,
    default_avatar_6_svg_1.default,
    default_avatar_7_svg_1.default,
    default_avatar_8_svg_1.default,
    default_avatar_9_svg_1.default,
    default_avatar_10_svg_1.default,
    default_avatar_11_svg_1.default,
    default_avatar_12_svg_1.default,
    default_avatar_13_svg_1.default,
    default_avatar_14_svg_1.default,
    default_avatar_15_svg_1.default,
    default_avatar_16_svg_1.default,
    default_avatar_17_svg_1.default,
    default_avatar_18_svg_1.default,
    default_avatar_19_svg_1.default,
    default_avatar_20_svg_1.default,
    default_avatar_21_svg_1.default,
    default_avatar_22_svg_1.default,
    default_avatar_23_svg_1.default,
    default_avatar_24_svg_1.default,
];
const DEFAULT_AVATAR = default_avatar_1_svg_1.default;
/**
 * Deterministically choose an avatar for a contact with an even distribution.
 */
const getAvatarForContact = (name) => {
    if (!name) {
        return DEFAULT_AVATAR;
    }
    return avatars.at(StringUtils_1.default.hash(name, avatars.length)) ?? DEFAULT_AVATAR;
};
exports.default = { getAvatarForContact };
