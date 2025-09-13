"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
const joinPaths = (...paths) => []
    .concat(...paths.map((p) => p.split('/')))
    .filter(Boolean)
    .join('/');
const createConfigItem = (screen, routeNames, pattern, path, parse) => {
    // Normalize pattern to remove any leading, trailing slashes, duplicate slashes etc.
    pattern = pattern.split('/').filter(Boolean).join('/');
    const regex = pattern
        ? new RegExp(`^(${pattern
            .split('/')
            .map((it) => {
            if (it.startsWith(':')) {
                return `(([^/]+\\/)${it.endsWith('?') ? '?' : ''})`;
            }
            return `${it === '*' ? '.*' : escape(it)}\\/`;
        })
            .join('')})`)
        : undefined;
    return {
        screen,
        regex,
        pattern,
        path,
        // The routeNames array is mutated, so copy it to keep the current state
        routeNames: [...routeNames],
        parse,
    };
};
const createNormalizedConfigs = (screen, routeConfig, routeNames = [], initials, parentScreens, parentPattern) => {
    const configs = [];
    routeNames.push(screen);
    parentScreens.push(screen);
    // @ts-expect-error: we can't strongly typecheck this for now
    const config = routeConfig[screen];
    if (typeof config === 'string') {
        // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
        const pattern = parentPattern ? joinPaths(parentPattern, config) : config;
        configs.push(createConfigItem(screen, routeNames, pattern, config));
    }
    else if (typeof config === 'object') {
        let pattern;
        // if an object is specified as the value (e.g. Foo: { ... }),
        // it can have `path` property and
        // it could have `screens` prop which has nested configs
        if (typeof config.path === 'string') {
            if (config.exact && config.path === undefined) {
                throw new Error("A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`.");
            }
            pattern = config.exact !== true ? joinPaths(parentPattern || '', config.path || '') : config.path || '';
            configs.push(createConfigItem(screen, routeNames, pattern, config.path, config.parse));
        }
        if (config.screens) {
            // property `initialRouteName` without `screens` has no purpose
            if (config.initialRouteName) {
                initials.push({
                    initialRouteName: config.initialRouteName,
                    parentScreens,
                });
            }
            Object.keys(config.screens).forEach((nestedConfig) => {
                const result = createNormalizedConfigs(nestedConfig, config.screens, routeNames, initials, [...parentScreens], pattern ?? parentPattern);
                configs.push(...result);
            });
        }
    }
    routeNames.pop();
    return configs;
};
exports.default = createNormalizedConfigs;
