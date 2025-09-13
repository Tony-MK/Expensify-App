"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_error_boundary_1 = require("react-error-boundary");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var usePrevious_1 = require("@hooks/usePrevious");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var PendingMapView_1 = require("./PendingMapView");
function MapView(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var _b = (0, react_1.useState)(0), errorResetKey = _b[0], setErrorResetKey = _b[1];
    // Retry the error when reconnecting.
    var wasOffline = (0, usePrevious_1.default)(isOffline);
    (0, react_1.useEffect)(function () {
        if (!wasOffline || isOffline) {
            return;
        }
        setErrorResetKey(function (key) { return key + 1; });
    }, [isOffline, wasOffline]);
    // The only way to retry loading the module is to call `React.lazy` again.
    var MapViewImpl = (0, react_1.useMemo)(function () { return (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return require('./MapViewImpl.website'); }); }); }, 
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
