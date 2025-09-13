"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ListBoundaryLoader({ type, isLoadingOlderReportActions = false, isLoadingInitialReportActions = false, lastReportActionName = '', isLoadingNewerReportActions = false, hasError = false, onRetry, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    // When retrying we want to show the loading state in the retry button so we
    // have this separate state to handle that.
    const [isRetrying, setIsRetrying] = react_1.default.useState(false);
    const retry = () => {
        setIsRetrying(true);
        onRetry?.();
    };
    // Reset the retrying state once loading is done.
    (0, react_1.useEffect)(() => {
        if (isLoadingNewerReportActions || isLoadingOlderReportActions) {
            return;
        }
        setIsRetrying(false);
    }, [isLoadingNewerReportActions, isLoadingOlderReportActions]);
    if (hasError || isRetrying) {
        return (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.listBoundaryError]}>
                <Text_1.default style={styles.listBoundaryErrorText}>{translate('listBoundary.errorMessage')}</Text_1.default>
                {!isOffline && (<Button_1.default small onPress={retry} text={translate('listBoundary.tryAgain')} isLoading={isRetrying}/>)}
            </react_native_1.View>);
    }
    // We use two different loading components for the header and footer
    // to reduce the jumping effect when the user is scrolling to the newer report actions
    if (type === CONST_1.default.LIST_COMPONENTS.FOOTER) {
        /*
         Ensure that the report chat is not loaded until the beginning.
         This is to avoid displaying the skeleton view above the "created" action in a newly generated optimistic chat or one with not that many comments.
         Additionally, if we are offline and the report is not loaded until the beginning, we assume there are more actions to load;
         Therefore, show the skeleton view even though the actions are not actually loading.
        */
        const isReportLoadedUntilBeginning = lastReportActionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED;
        const mayLoadMoreActions = !isReportLoadedUntilBeginning && (isLoadingInitialReportActions || isOffline);
        if (isLoadingOlderReportActions || mayLoadMoreActions) {
            return <ReportActionsSkeletonView_1.default />;
        }
    }
    if (type === CONST_1.default.LIST_COMPONENTS.HEADER && isLoadingNewerReportActions) {
        // applied for a header of the list, i.e. when you scroll to the bottom of the list
        // the styles for android and the rest components are different that's why we use two different components
        return (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.listBoundaryLoader]}>
                <react_native_1.ActivityIndicator color={theme.spinner} size="small"/>
            </react_native_1.View>);
    }
}
ListBoundaryLoader.displayName = 'ListBoundaryLoader';
exports.default = ListBoundaryLoader;
