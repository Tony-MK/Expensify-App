"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsListContext = exports.useOptionsList = void 0;
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const OnyxListItemProvider_1 = require("./OnyxListItemProvider");
const OptionsListContext = (0, react_1.createContext)({
    options: {
        reports: [],
        personalDetails: [],
    },
    initializeOptions: () => { },
    areOptionsInitialized: false,
    resetOptions: () => { },
});
exports.OptionsListContext = OptionsListContext;
const isEqualPersonalDetail = (prevPersonalDetail, personalDetail) => prevPersonalDetail?.firstName === personalDetail?.firstName &&
    prevPersonalDetail?.lastName === personalDetail?.lastName &&
    prevPersonalDetail?.login === personalDetail?.login &&
    prevPersonalDetail?.displayName === personalDetail?.displayName;
function OptionsListContextProvider({ children }) {
    const areOptionsInitialized = (0, react_1.useRef)(false);
    const [options, setOptions] = (0, react_1.useState)({
        reports: [],
        personalDetails: [],
    });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true });
    const prevReportAttributesLocale = (0, usePrevious_1.default)(reportAttributes?.locale);
    const [reports, { sourceValue: changedReports }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const prevReports = (0, usePrevious_1.default)(reports);
    const [, { sourceValue: changedReportActions }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, { canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const prevPersonalDetails = (0, usePrevious_1.default)(personalDetails);
    const hasInitialData = (0, react_1.useMemo)(() => Object.keys(personalDetails ?? {}).length > 0, [personalDetails]);
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true });
    const loadOptions = (0, react_1.useCallback)(() => {
        const optionLists = (0, OptionsListUtils_1.createOptionList)(personalDetails, reports, reportAttributes?.reports);
        setOptions({
            reports: optionLists.reports,
            personalDetails: optionLists.personalDetails,
        });
    }, [personalDetails, reports, reportAttributes?.reports]);
    /**
     * This effect is responsible for generating the options list when their data is not yet initialized
     */
    (0, react_1.useEffect)(() => {
        if (!areOptionsInitialized.current || !reports || hasInitialData) {
            return;
        }
        loadOptions();
    }, [reports, personalDetails, hasInitialData, loadOptions]);
    /**
     * This effect is responsible for generating the options list when the locale changes
     * Since options might use report attributes, it's necessary to call this after report attributes are loaded with the new locale to make sure the options are generated in a proper language
     */
    (0, react_1.useEffect)(() => {
        if (reportAttributes?.locale === prevReportAttributesLocale) {
            return;
        }
        loadOptions();
    }, [prevReportAttributesLocale, loadOptions, reportAttributes?.locale]);
    const changedReportsEntries = (0, react_1.useMemo)(() => {
        const result = {};
        Object.keys(changedReports ?? {}).forEach((key) => {
            let report = reports?.[key] ?? null;
            result[key] = report;
            if (reports?.[key] === undefined && prevReports?.[key]) {
                report = null;
            }
        });
        return result;
    }, [changedReports, reports, prevReports]);
    /**
     * This effect is responsible for updating the options only for changed reports
     */
    (0, react_1.useEffect)(() => {
        if (!changedReportsEntries || !areOptionsInitialized.current) {
            return;
        }
        setOptions((prevOptions) => {
            const changedReportKeys = Object.keys(changedReportsEntries);
            if (changedReportKeys.length === 0) {
                return prevOptions;
            }
            const updatedReportsMap = new Map(prevOptions.reports.map((report) => [report.reportID, report]));
            changedReportKeys.forEach((reportKey) => {
                const report = changedReportsEntries[reportKey];
                const reportID = reportKey.replace(ONYXKEYS_1.default.COLLECTION.REPORT, '');
                const { reportOption } = (0, OptionsListUtils_1.processReport)(report, personalDetails, reportAttributes?.reports);
                if (reportOption) {
                    updatedReportsMap.set(reportID, reportOption);
                }
                else {
                    updatedReportsMap.delete(reportID);
                }
            });
            return {
                ...prevOptions,
                reports: Array.from(updatedReportsMap.values()),
            };
        });
    }, [changedReportsEntries, personalDetails, reportAttributes?.reports]);
    (0, react_1.useEffect)(() => {
        if (!changedReportActions || !areOptionsInitialized.current) {
            return;
        }
        setOptions((prevOptions) => {
            const changedReportActionsEntries = Object.entries(changedReportActions);
            if (changedReportActionsEntries.length === 0) {
                return prevOptions;
            }
            const updatedReportsMap = new Map(prevOptions.reports.map((report) => [report.reportID, report]));
            changedReportActionsEntries.forEach(([key, reportAction]) => {
                if (!reportAction) {
                    return;
                }
                const reportID = key.replace(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, '');
                const { reportOption } = (0, OptionsListUtils_1.processReport)(updatedReportsMap.get(reportID)?.item, personalDetails, reportAttributes?.reports);
                if (reportOption) {
                    updatedReportsMap.set(reportID, reportOption);
                }
            });
            return {
                ...prevOptions,
                reports: Array.from(updatedReportsMap.values()),
            };
        });
    }, [changedReportActions, personalDetails, reportAttributes?.reports, transactions]);
    /**
     * This effect is used to update the options list when personal details change.
     */
    (0, react_1.useEffect)(() => {
        // there is no need to update the options if the options are not initialized
        if (!areOptionsInitialized.current) {
            return;
        }
        if (!personalDetails) {
            return;
        }
        // Handle initial personal details load. This initialization is required here specifically to prevent
        // UI freezing that occurs when resetting the app from the troubleshooting page.
        if (!prevPersonalDetails) {
            const { personalDetails: newPersonalDetailsOptions, reports: newReports } = (0, OptionsListUtils_1.createOptionList)(personalDetails, reports, reportAttributes?.reports);
            setOptions((prevOptions) => ({
                ...prevOptions,
                personalDetails: newPersonalDetailsOptions,
                reports: newReports,
            }));
            return;
        }
        const newReportOptions = [];
        Object.keys(personalDetails).forEach((accountID) => {
            const prevPersonalDetail = prevPersonalDetails?.[accountID];
            const personalDetail = personalDetails[accountID];
            if (prevPersonalDetail && personalDetail && isEqualPersonalDetail(prevPersonalDetail, personalDetail)) {
                return;
            }
            Object.values(reports ?? {})
                .filter((report) => !!Object.keys(report?.participants ?? {}).includes(accountID) || ((0, ReportUtils_1.isSelfDM)(report) && report?.ownerAccountID === Number(accountID)))
                .forEach((report) => {
                if (!report) {
                    return;
                }
                const newReportOption = (0, OptionsListUtils_1.createOptionFromReport)(report, personalDetails, reportAttributes?.reports);
                const replaceIndex = options.reports.findIndex((option) => option.reportID === report.reportID);
                newReportOptions.push({
                    newReportOption,
                    replaceIndex,
                });
            });
        });
        // since personal details are not a collection, we need to recreate the whole list from scratch
        const newPersonalDetailsOptions = (0, OptionsListUtils_1.createOptionList)(personalDetails, reports, reportAttributes?.reports).personalDetails;
        setOptions((prevOptions) => {
            const newOptions = { ...prevOptions };
            newOptions.personalDetails = newPersonalDetailsOptions;
            newReportOptions.forEach((newReportOption) => (newOptions.reports[newReportOption.replaceIndex] = newReportOption.newReportOption));
            return newOptions;
        });
        // This effect is used to update the options list when personal details change so we ignore all dependencies except personalDetails
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [personalDetails]);
    const initializeOptions = (0, react_1.useCallback)(() => {
        loadOptions();
        areOptionsInitialized.current = true;
    }, [loadOptions]);
    const resetOptions = (0, react_1.useCallback)(() => {
        if (!areOptionsInitialized.current) {
            return;
        }
        areOptionsInitialized.current = false;
        setOptions({
            reports: [],
            personalDetails: [],
        });
    }, []);
    return (<OptionsListContext.Provider // eslint-disable-next-line react-compiler/react-compiler
     value={(0, react_1.useMemo)(() => ({ options, initializeOptions, areOptionsInitialized: areOptionsInitialized.current, resetOptions }), [options, initializeOptions, resetOptions])}>
            {children}
        </OptionsListContext.Provider>);
}
const useOptionsListContext = () => (0, react_1.useContext)(OptionsListContext);
// Hook to use the OptionsListContext with an initializer to load the options
const useOptionsList = (options) => {
    const { shouldInitialize = true } = options ?? {};
    const { initializeOptions, options: optionsList, areOptionsInitialized, resetOptions } = useOptionsListContext();
    const [internalOptions, setInternalOptions] = (0, react_1.useState)(optionsList);
    const prevOptions = (0, react_1.useRef)(null);
    const [areInternalOptionsInitialized, setAreInternalOptionsInitialized] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!prevOptions.current) {
            prevOptions.current = optionsList;
            setInternalOptions(optionsList);
            setAreInternalOptionsInitialized(areOptionsInitialized);
            return;
        }
        /**
         * optionsList reference can change multiple times even the value of its arrays is the same. We perform shallow comparison to check if the options have truly changed.
         * This is necessary to avoid unnecessary re-renders in components that use this context.
         */
        const areOptionsEqual = (0, OptionsListUtils_1.shallowOptionsListCompare)(prevOptions.current, optionsList);
        prevOptions.current = optionsList;
        if (areOptionsEqual) {
            return;
        }
        setInternalOptions(optionsList);
        setAreInternalOptionsInitialized(areOptionsInitialized);
    }, [optionsList, areOptionsInitialized]);
    (0, react_1.useEffect)(() => {
        if (!shouldInitialize || areOptionsInitialized) {
            return;
        }
        initializeOptions();
    }, [shouldInitialize, initializeOptions, areOptionsInitialized]);
    const resetInternalOptions = (0, react_1.useCallback)(() => {
        setAreInternalOptionsInitialized(false);
        resetOptions();
    }, [resetOptions]);
    return (0, react_1.useMemo)(() => ({
        initializeOptions,
        options: internalOptions,
        areOptionsInitialized: areInternalOptionsInitialized,
        resetOptions: resetInternalOptions,
    }), [initializeOptions, internalOptions, resetInternalOptions, areInternalOptionsInitialized]);
};
exports.useOptionsList = useOptionsList;
exports.default = OptionsListContextProvider;
