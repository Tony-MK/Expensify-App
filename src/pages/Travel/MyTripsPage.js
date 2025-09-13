"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const ManageTrips_1 = require("./ManageTrips");
function MyTripsPage() {
    const { translate } = (0, useLocalize_1.default)();
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight testID={MyTripsPage.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('travel.header')} shouldShowBackButton/>
            <ManageTrips_1.default />
        </ScreenWrapper_1.default>);
}
MyTripsPage.displayName = 'MyTripsPage';
exports.default = MyTripsPage;
