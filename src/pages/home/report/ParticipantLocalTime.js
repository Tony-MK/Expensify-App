"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const Timers_1 = require("@libs/Timers");
const CONST_1 = require("@src/CONST");
function getParticipantLocalTime(participant, getLocalDateFromDatetime) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null
    const reportRecipientTimezone = participant.timezone || CONST_1.default.DEFAULT_TIME_ZONE;
    const reportTimezone = getLocalDateFromDatetime(undefined, reportRecipientTimezone.selected);
    const currentTimezone = getLocalDateFromDatetime();
    const reportRecipientDay = DateUtils_1.default.formatToDayOfWeek(reportTimezone);
    const currentUserDay = DateUtils_1.default.formatToDayOfWeek(currentTimezone);
    if (reportRecipientDay !== currentUserDay) {
        return `${DateUtils_1.default.formatToLocalTime(reportTimezone)} ${reportRecipientDay}`;
    }
    return `${DateUtils_1.default.formatToLocalTime(reportTimezone)}`;
}
function ParticipantLocalTime({ participant }) {
    const { translate, getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [localTime, setLocalTime] = (0, react_1.useState)(() => getParticipantLocalTime(participant, getLocalDateFromDatetime));
    (0, react_1.useEffect)(() => {
        const timer = Timers_1.default.register(setInterval(() => {
            setLocalTime(getParticipantLocalTime(participant, getLocalDateFromDatetime));
        }, 1000));
        return () => {
            clearInterval(timer);
        };
    }, [participant, getLocalDateFromDatetime]);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null
    const reportRecipientDisplayName = participant.firstName || participant.displayName;
    if (!reportRecipientDisplayName) {
        return null;
    }
    return (<react_native_1.View style={[styles.chatItemComposeSecondaryRow]}>
            <Text_1.default style={[styles.chatItemComposeSecondaryRowSubText, styles.chatItemComposeSecondaryRowOffset, styles.pre]} numberOfLines={1}>
                {translate('reportActionCompose.localTime', {
            user: reportRecipientDisplayName,
            time: localTime,
        })}
            </Text_1.default>
        </react_native_1.View>);
}
ParticipantLocalTime.displayName = 'ParticipantLocalTime';
exports.default = ParticipantLocalTime;
