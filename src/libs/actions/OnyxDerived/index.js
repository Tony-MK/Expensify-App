"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file contains logic for derived Onyx keys. The idea behind derived keys is that if there is a common computation
 * that we're doing in many places across the app to derive some value from multiple Onyx values, we can move that
 * computation into this file, run it only once, and then share it across the app by storing the result of that computation in Onyx.
 *
 * The primary purpose is to optimize performance by reducing redundant computations. More info can be found in the README.
 */
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUtils_1 = require("react-native-onyx/dist/OnyxUtils");
const Log_1 = require("@libs/Log");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ObjectUtils_1 = require("@src/types/utils/ObjectUtils");
const ONYX_DERIVED_VALUES_1 = require("./ONYX_DERIVED_VALUES");
const utils_1 = require("./utils");
/**
 * Initialize all Onyx derived values, store them in Onyx, and setup listeners to update them when dependencies change.
 * Using connectWithoutView in this function since this is only executed once while initializing the App.
 */
function init() {
    for (const [key, { compute, dependencies }] of ObjectUtils_1.default.typedEntries(ONYX_DERIVED_VALUES_1.default)) {
        let areAllConnectionsSet = false;
        let connectionsEstablishedCount = 0;
        const totalConnections = dependencies.length;
        const connectionInitializedFlags = new Array(totalConnections).fill(false);
        // Create an array to hold the current values for each dependency.
        // We cast its type to match the tuple expected by config.compute.
        let dependencyValues = new Array(totalConnections);
        OnyxUtils_1.default.get(key).then((storedDerivedValue) => {
            let derivedValue = storedDerivedValue;
            if (derivedValue) {
                Log_1.default.info(`Derived value for ${key} restored from disk`);
            }
            else {
                OnyxUtils_1.default.tupleGet(dependencies).then((values) => {
                    const initialContext = {
                        currentValue: derivedValue,
                        sourceValues: undefined,
                        areAllConnectionsSet: false,
                    };
                    // @ts-expect-error TypeScript can't confirm the shape of dependencyValues matches the compute function's parameters
                    derivedValue = compute(dependencyValues, initialContext);
                    dependencyValues = values;
                    (0, utils_1.setDerivedValue)(key, derivedValue ?? null);
                });
            }
            const setDependencyValue = (i, value) => {
                dependencyValues[i] = value;
            };
            const checkAndMarkConnectionInitialized = (index) => {
                if (connectionInitializedFlags.at(index)) {
                    return;
                }
                connectionInitializedFlags[index] = true;
                connectionsEstablishedCount++;
                if (connectionsEstablishedCount === totalConnections) {
                    areAllConnectionsSet = true;
                    Log_1.default.info(`[OnyxDerived] All connections initialized for key: ${key}`);
                }
            };
            // Create context once outside the function, swap values inline to avoid overhead of creating new objects frequently
            const context = {
                currentValue: undefined,
                sourceValues: undefined,
                areAllConnectionsSet: false,
            };
            const recomputeDerivedValue = (sourceKey, sourceValue, triggeredByIndex) => {
                // If this recompute was triggered by a connection callback, check if it initializes the connection
                if (triggeredByIndex !== undefined) {
                    checkAndMarkConnectionInitialized(triggeredByIndex);
                }
                context.currentValue = derivedValue;
                context.areAllConnectionsSet = areAllConnectionsSet;
                context.sourceValues = sourceKey && sourceValue !== undefined ? { [sourceKey]: sourceValue } : undefined;
                // @ts-expect-error TypeScript can't confirm the shape of dependencyValues matches the compute function's parameters
                const newDerivedValue = compute(dependencyValues, context);
                Log_1.default.info(`[OnyxDerived] updating value for ${key} in Onyx`);
                derivedValue = newDerivedValue;
                (0, utils_1.setDerivedValue)(key, derivedValue);
            };
            for (let i = 0; i < dependencies.length; i++) {
                const dependencyIndex = i;
                const dependencyOnyxKey = dependencies[dependencyIndex];
                if (OnyxUtils_1.default.isCollectionKey(dependencyOnyxKey)) {
                    react_native_onyx_1.default.connectWithoutView({
                        key: dependencyOnyxKey,
                        waitForCollectionCallback: true,
                        callback: (value, collectionKey, sourceValue) => {
                            Log_1.default.info(`[OnyxDerived] dependency ${collectionKey} for derived key ${key} changed, recomputing`);
                            setDependencyValue(dependencyIndex, value);
                            recomputeDerivedValue(dependencyOnyxKey, sourceValue, dependencyIndex);
                        },
                    });
                }
                else if (dependencyOnyxKey === ONYXKEYS_1.default.NVP_PREFERRED_LOCALE) {
                    // Special case for locale, we want to recompute derived values when the locale change actually loads.
                    react_native_onyx_1.default.connectWithoutView({
                        key: ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING,
                        initWithStoredValues: false,
                        callback: (value) => {
                            if (value ?? true) {
                                Log_1.default.info(`[OnyxDerived] translations are still loading, not recomputing derived value for ${key}`);
                                return;
                            }
                            Log_1.default.info(`[OnyxDerived] translations loaded, recomputing derived value for ${key}`);
                            const localeValue = IntlStore_1.default.getCurrentLocale();
                            if (!localeValue) {
                                Log_1.default.info(`[OnyxDerived] No locale found for derived key ${key}, skipping recompute`);
                                return;
                            }
                            Log_1.default.info(`[OnyxDerived] dependency ${dependencyOnyxKey} for derived key ${key} changed, recomputing`);
                            setDependencyValue(dependencyIndex, localeValue);
                            recomputeDerivedValue(dependencyOnyxKey, localeValue, dependencyIndex);
                        },
                    });
                }
                else {
                    react_native_onyx_1.default.connectWithoutView({
                        key: dependencyOnyxKey,
                        callback: (value) => {
                            Log_1.default.info(`[OnyxDerived] dependency ${dependencyOnyxKey} for derived key ${key} changed, recomputing`);
                            setDependencyValue(dependencyIndex, value);
                            // if the dependency is not a collection, pass the entire value as the source value
                            recomputeDerivedValue(dependencyOnyxKey, value, dependencyIndex);
                        },
                    });
                }
            }
        });
    }
}
exports.default = init;
