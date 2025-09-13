"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HISTORY_PARAM_1 = require("@libs/Navigation/linkingConfig/HISTORY_PARAM");
const SCREENS_1 = require("@src/SCREENS");
// This file maps screens to their history parameters
const SCREEN_TO_HISTORY_PARAM = {
    [SCREENS_1.default.SETTINGS.DELEGATE.DELEGATE_CONFIRM]: HISTORY_PARAM_1.default.SHOW_VALIDATE_CODE_ACTION_MODAL,
};
exports.default = SCREEN_TO_HISTORY_PARAM;
