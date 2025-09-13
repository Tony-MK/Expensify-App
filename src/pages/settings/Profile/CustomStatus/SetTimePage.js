"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TimePicker_1 = require("@components/TimePicker/TimePicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const User_1 = require("@libs/actions/User");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SetTimePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [customStatus] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CUSTOM_STATUS_DRAFT, { canBeMissing: true });
    const clearAfter = customStatus?.clearAfter ?? '';
    const onSubmit = (time) => {
        const timeToUse = DateUtils_1.default.combineDateAndTime(time, clearAfter);
        (0, User_1.updateDraftCustomStatus)({ clearAfter: timeToUse });
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER);
    };
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID={SetTimePage.displayName}>
            <HeaderWithBackButton_1.default title={translate('statusPage.time')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_STATUS_CLEAR_AFTER)}/>
            <react_native_1.View style={styles.flex1}>
                <TimePicker_1.default defaultValue={clearAfter} onSubmit={onSubmit}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SetTimePage.displayName = 'SetTimePage';
exports.default = SetTimePage;
