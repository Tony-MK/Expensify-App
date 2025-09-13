"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_error_boundary_1 = require("react-error-boundary");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PendingMapView_1 = require("./PendingMapView");
function MapView({ ref, ...props }) {
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [errorResetKey, setErrorResetKey] = (0, react_1.useState)(0);
    // Retry the error when reconnecting.
    const wasOffline = (0, usePrevious_1.default)(isOffline);
    (0, react_1.useEffect)(() => {
        if (!wasOffline || isOffline) {
            return;
        }
        setErrorResetKey((key) => key + 1);
    }, [isOffline, wasOffline]);
    // The only way to retry loading the module is to call `React.lazy` again.
    const MapViewImpl = (0, react_1.useMemo)(() => (0, react_1.lazy)(() => Promise.resolve().then(() => require('./MapViewImpl.website'))), 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [errorResetKey]);
    return (<react_error_boundary_1.ErrorBoundary resetKeys={[errorResetKey]} fallback={<PendingMapView_1.default title={isOffline ? translate('distance.mapPending.title') : translate('distance.mapPending.errorTitle')} subtitle={isOffline ? translate('distance.mapPending.subtitle') : translate('distance.mapPending.errorSubtitle')} style={styles.mapEditView}/>}>
            <react_1.Suspense fallback={<FullscreenLoadingIndicator_1.default />}>
                {!isOffline ? (<MapViewImpl ref={ref} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}/>) : (<PendingMapView_1.default title={translate('distance.mapPending.title')} subtitle={translate('distance.mapPending.subtitle')} style={styles.mapEditView}/>)}
            </react_1.Suspense>
        </react_error_boundary_1.ErrorBoundary>);
}
exports.default = MapView;
