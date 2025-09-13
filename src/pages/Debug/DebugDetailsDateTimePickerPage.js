"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_native_1 = require("react-native");
const DatePicker_1 = require("@components/DatePicker");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TimePicker_1 = require("@components/TimePicker/TimePicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Url_1 = require("@libs/Url");
function DebugDetailsDateTimePickerPage({ route: { params: { fieldName, fieldValue = '', backTo = '' }, }, navigation, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [date, setDate] = (0, react_1.useState)(() => DateUtils_1.default.extractDate(fieldValue));
    return (<ScreenWrapper_1.default testID={DebugDetailsDateTimePickerPage.displayName}>
            <HeaderWithBackButton_1.default title={fieldName}/>
            <ScrollView_1.default contentContainerStyle={styles.gap8}>
                <react_native_1.View style={styles.ph5}>
                    <Text_1.default style={styles.headerText}>{translate('debug.date')}</Text_1.default>
                    <DatePicker_1.default inputID="" value={date} onInputChange={setDate}/>
                </react_native_1.View>
                <react_native_1.View>
                    <Text_1.default style={[styles.headerText, styles.ph5]}>{translate('debug.time')}</Text_1.default>
                    <TimePicker_1.default onSubmit={(time) => {
            // Check the navigation state and "backTo" parameter to decide navigation behavior
            if (navigation.getState().routes.length === 1 && !backTo) {
                // If there is only one route and "backTo" is empty, go back in navigation
                Navigation_1.default.goBack();
            }
            else if (!!backTo && navigation.getState().routes.length === 1) {
                // If "backTo" is not empty and there is only one route, go back to the specific route defined in "backTo" with a country parameter
                Navigation_1.default.goBack((0, Url_1.appendParam)(backTo, fieldName, (0, date_fns_1.format)(new Date(`${date} ${time}`), 'yyyy-MM-dd HH:mm:ss.SSS')));
            }
            else {
                // Otherwise, navigate to the specific route defined in "backTo" with a country parameter
                Navigation_1.default.navigate((0, Url_1.appendParam)(backTo, fieldName, (0, date_fns_1.format)(new Date(`${date} ${time}`), 'yyyy-MM-dd HH:mm:ss.SSS')));
            }
        }} defaultValue={fieldValue} shouldValidate={false} showFullFormat/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
DebugDetailsDateTimePickerPage.displayName = 'DebugDetailsDateTimePickerPage';
exports.default = DebugDetailsDateTimePickerPage;
