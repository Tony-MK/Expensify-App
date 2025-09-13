"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const LottieAnimations_1 = require("@components/LottieAnimations");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const minModalHeight = 380;
function SearchMoneyRequestReportEmptyState() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={styles.flex1}>
            <EmptyStateComponent_1.default cardStyles={[styles.appBG]} cardContentStyles={[styles.pt5, styles.pb0]} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={LottieAnimations_1.default.GenericEmptyState} title={translate('search.moneyRequestReport.emptyStateTitle')} subtitle={translate('search.moneyRequestReport.emptyStateSubtitle')} headerStyles={[styles.emptyStateMoneyRequestReport]} lottieWebViewStyles={styles.emptyStateFolderWebStyles} headerContentStyles={styles.emptyStateFolderWebStyles} minModalHeight={minModalHeight}/>
        </react_native_1.View>);
}
SearchMoneyRequestReportEmptyState.displayName = 'SearchMoneyRequestReportEmptyState';
exports.default = SearchMoneyRequestReportEmptyState;
