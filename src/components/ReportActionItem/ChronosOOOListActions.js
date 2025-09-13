"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const Chronos_1 = require("@userActions/Chronos");
function ChronosOOOListActions({ reportID, action }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const events = (0, ReportActionsUtils_1.getOriginalMessage)(action)?.events ?? [];
    if (!events.length) {
        return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.ml18]}>
                <Text_1.default>You haven&apos;t created any events</Text_1.default>
            </react_native_1.View>);
    }
    return (<OfflineWithFeedback_1.default pendingAction={action.pendingAction}>
            <react_native_1.View style={styles.chatItemMessage}>
                {events.map((event) => {
            const start = getLocalDateFromDatetime(event?.start?.date ?? '');
            const end = getLocalDateFromDatetime(event?.end?.date ?? '');
            return (<react_native_1.View key={event.id} style={[styles.flexRow, styles.ml18, styles.pr4, styles.alignItemsCenter]}>
                            <Text_1.default style={styles.flexShrink1}>
                                {event.lengthInDays > 0
                    ? translate('chronos.oooEventSummaryFullDay', {
                        summary: event.summary,
                        dayCount: event.lengthInDays,
                        date: DateUtils_1.default.formatToLongDateWithWeekday(end),
                    })
                    : translate('chronos.oooEventSummaryPartialDay', {
                        summary: event.summary,
                        timePeriod: `${DateUtils_1.default.formatToLocalTime(start)} - ${DateUtils_1.default.formatToLocalTime(end)}`,
                        date: DateUtils_1.default.formatToLongDateWithWeekday(end),
                    })}
                            </Text_1.default>
                            <Button_1.default small style={styles.pl2} onPress={() => (0, Chronos_1.removeEvent)(reportID, action.reportActionID, event.id, events)}>
                                <Text_1.default style={styles.buttonSmallText}>{translate('common.remove')}</Text_1.default>
                            </Button_1.default>
                        </react_native_1.View>);
        })}
            </react_native_1.View>
        </OfflineWithFeedback_1.default>);
}
ChronosOOOListActions.displayName = 'ChronosOOOListActions';
exports.default = ChronosOOOListActions;
